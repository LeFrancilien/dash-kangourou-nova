'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Phone, MapPin, Euro } from 'lucide-react'
import { toast } from 'sonner'

interface Devis {
  id: string
  numero_devis: string
  client_prenom: string
  client_nom: string
  client_email: string
  client_telephone: string | null
  client_commune: string | null
  type_garde: string | null
  montant: number | null
  statut: string
  date_creation: string
  agence_id: string
}

interface Agence {
  id: string
  nom: string
}

// Status codes from DB
const STATUTS = ['recu', 'relance_j2', 'email_j4', 'converti', 'perdu']

const STATUT_LABELS: Record<string, string> = {
  'recu': 'Reçu',
  'relance_j2': 'Relancé J+2',
  'email_j4': 'Email J+4',
  'converti': 'Converti',
  'perdu': 'Perdu',
}

const STATUT_COLORS: Record<string, string> = {
  'recu': 'border-blue-500/20 bg-blue-500/5',
  'relance_j2': 'border-orange-500/20 bg-orange-500/5',
  'email_j4': 'border-purple-500/20 bg-purple-500/5',
  'converti': 'border-green-500/20 bg-green-500/5',
  'perdu': 'border-red-500/20 bg-red-500/5',
}

export default function KanbanPage() {
  const [devisByStatut, setDevisByStatut] = useState<Record<string, Devis[]>>({})
  const [agences, setAgences] = useState<Agence[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedDevis, setDraggedDevis] = useState<Devis | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Charger les agences
      const { data: agencesData } = await supabase
        .from('agences')
        .select('id, nom')
        .order('nom')

      if (agencesData) {
        setAgences(agencesData)
      }

      // Charger les devis via getDevis helper
      // Note: we can import getDevis from lib/supabase if exported, or construct query here.
      // Assuming getDevis is available or we fix query.
      // Let's use the direct query correctly matching DB schema
      const { data: devisData, error } = await supabase
        .from('devis')
        .select(`
            *,
            agence:agences(nom)
        `)
        .order('created_at', { ascending: false }) // Fixed column

      if (error) throw error

      if (devisData) {
        // Grouper par statut
        const grouped: Record<string, Devis[]> = {}
        STATUTS.forEach(statut => {
          grouped[statut] = devisData.filter((d: Devis) => d.statut === statut)
        })
        setDevisByStatut(grouped)
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatut(devisId: string, newStatut: string) {
    try {
      const { error } = await supabase
        .from('devis')
        .update({ statut: newStatut })
        .eq('id', devisId)

      if (error) throw error

      toast.success('Statut mis à jour')
      loadData()
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  function handleDragStart(devis: Devis) {
    setDraggedDevis(devis)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent, newStatut: string) {
    e.preventDefault()
    if (draggedDevis && draggedDevis.statut !== newStatut) {
      updateStatut(draggedDevis.id, newStatut)
    }
    setDraggedDevis(null)
  }

  function getAgenceName(agenceId: string) {
    return agences.find(a => a.id === agenceId)?.nom || ''
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-x-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Vue Kanban</h1>
        <p className="mt-2 text-slate-400">Déplace les devis entre les colonnes pour changer leur statut</p>
      </div>

      <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
        {STATUTS.map(statut => {
          // Normalisation pour la correspondance des statuts
          const devis = devisByStatut[statut] || []

          return (
            <div
              key={statut}
              className="w-80 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, statut)}
            >
              {/* En-tête colonne */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3 border border-slate-800">
                <h2 className="font-semibold text-white">{STATUT_LABELS[statut]}</h2>
                <span className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300">
                  {devis.length}
                </span>
              </div>

              {/* Cartes devis */}
              <div className="space-y-3">
                {devis.map(d => (
                  <div
                    key={d.id}
                    draggable
                    onDragStart={() => handleDragStart(d)}
                    className={`cursor-move rounded-lg border-2 bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-700 ${STATUT_COLORS[statut] || 'border-slate-800'
                      }`}
                  >
                    {/* En-tête carte */}
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-white">
                          {d.client_prenom} {d.client_nom}
                        </div>
                        <div className="text-xs text-slate-400">{d.numero_devis}</div>
                      </div>
                      {d.montant && (
                        <div className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-sm font-medium text-slate-300">
                          <Euro className="h-3 w-3" />
                          {d.montant}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{d.client_email}</span>
                      </div>
                      {d.client_telephone && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          {d.client_telephone}
                        </div>
                      )}
                      {d.client_commune && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {d.client_commune}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                      <span className="text-xs text-slate-500">
                        {getAgenceName(d.agence_id)}
                      </span>
                      {d.type_garde && (
                        <span className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400">
                          {d.type_garde}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {devis.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-600">
                    Aucun devis
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
