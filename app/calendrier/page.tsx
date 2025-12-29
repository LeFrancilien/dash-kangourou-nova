'use client'

import { useEffect, useState } from 'react'
import { supabase, type Devis, type Agence } from '@/lib/supabase'
import { Calendar as CalendarIcon, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react'

// Action dérivée de l'état du devis
interface Action {
  id: string
  type: 'relance_j2' | 'relance_j4'
  date: Date
  devis: Devis
  done: boolean
  overdue: boolean
}

export default function CalendrierPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [agences, setAgences] = useState<Agence[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatut, setFilterStatut] = useState<'all' | 'pending' | 'overdue'>('pending') // Default to pending for better UX

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // 1. Charger les agences
      const { data: agencesData } = await supabase
        .from('agences')
        .select('*')
        .order('nom')

      if (agencesData) {
        setAgences(agencesData)
      }

      // 2. Charger les devis actifs (non convertis, non perdus)
      // On récupère tout pour calculer les actions, même ceux déjà faits, pour l'historique si besoin
      // Mais pour le calendrier "à faire", on s'intéresse surtout aux non-convertis/perdus.
      const { data: devisData } = await supabase
        .from('devis')
        .select('*')
        .not('statut', 'in', '("converti","perdu")')

      if (devisData) {
        const allActions: Action[] = []
        const now = new Date()
        // Reset hours for cleaner date comparison
        now.setHours(0, 0, 0, 0)

        devisData.forEach((devis: Devis) => {
          if (!devis.date_reception) return

          const dateReception = new Date(devis.date_reception)

          // --- Action Relance J+2 ---
          const dateJ2 = new Date(dateReception)
          dateJ2.setDate(dateJ2.getDate() + 2)

          allActions.push({
            id: `${devis.id}-j2`,
            type: 'relance_j2',
            date: dateJ2,
            devis,
            done: devis.relance_j2_envoyee,
            overdue: !devis.relance_j2_envoyee && now > dateJ2
          })

          // --- Action Relance J+4 (Email) ---
          const dateJ4 = new Date(dateReception)
          dateJ4.setDate(dateJ4.getDate() + 4)

          allActions.push({
            id: `${devis.id}-j4`,
            type: 'relance_j4',
            date: dateJ4,
            devis,
            done: devis.email_j4_envoye,
            overdue: !devis.email_j4_envoye && now > dateJ4
          })
        })

        // Trier par date d'échéance (les plus urgents en premier)
        allActions.sort((a, b) => a.date.getTime() - b.date.getTime())
        setActions(allActions)
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  function getAgenceName(agenceId: number) {
    return agences.find(a => a.id === agenceId)?.nom || ''
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date)
  }

  function getActionLabel(type: Action['type']) {
    switch (type) {
      case 'relance_j2':
        return 'Relance J+2'
      case 'relance_j4':
        return 'Email J+4'
    }
  }

  function getActionIcon(type: Action['type']) {
    switch (type) {
      case 'relance_j2':
        return Clock
      case 'relance_j4':
        return Send
    }
  }

  const filteredActions = actions.filter(action => {
    if (filterStatut === 'pending') return !action.done
    if (filterStatut === 'overdue') return action.overdue && !action.done
    return true
  })

  // Group actions by date for the timeline view? 
  // For now keeping the valid list view as implemented previously but with real data.

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </div>
    )
  }

  const pendingCount = actions.filter(a => !a.done).length
  const overdueCount = actions.filter(a => a.overdue && !a.done).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Calendrier des actions</h1>
        <p className="mt-2 text-slate-400">Suivi des relances à effectuer (J+2, J+4)</p>
      </div>

      {/* Stats et filtres */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterStatut('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatut === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilterStatut('pending')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatut === 'pending'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            À faire ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatut('overdue')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatut === 'overdue'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            En retard ({overdueCount})
          </button>
        </div>
      </div>

      {/* Liste des actions */}
      <div className="space-y-4">
        {filteredActions.map((action, index) => {
          const Icon = getActionIcon(action.type)
          const isLast = index === filteredActions.length - 1

          // Determine color based on status
          let statusColor = 'bg-slate-500' // Default (future)
          if (action.done) statusColor = 'bg-green-500'
          else if (action.overdue) statusColor = 'bg-red-500'
          else if (!action.done) statusColor = 'bg-orange-500' // Pending but not overdue

          return (
            <div key={action.id} className="flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${statusColor}`}
                >
                  {action.done ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : action.overdue ? (
                    <AlertCircle className="h-5 w-5 text-white" />
                  ) : (
                    <Icon className="h-5 w-5 text-white" />
                  )}
                </div>
                {!isLast && <div className="h-full w-0.5 flex-1 bg-slate-800" />}
              </div>

              {/* Carte action */}
              <div className="flex-1 pb-8">
                <div className={`rounded-lg border bg-slate-900 p-4 shadow-sm ${action.overdue && !action.done ? 'border-red-500/50' : 'border-slate-800'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {getActionLabel(action.type)}
                        </h3>
                        {action.done && (
                          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                            Fait
                          </span>
                        )}
                        {action.overdue && !action.done && (
                          <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                            En retard
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(action.date)}
                      </div>
                    </div>
                  </div>

                  {/* Infos devis */}
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                      <div className="text-xs text-slate-500">Client</div>
                      <div className="mt-1 font-medium text-white">
                        {action.devis.prenom_client} {action.devis.nom_client}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Devis</div>
                      <div className="mt-1 font-medium text-white">
                        {action.devis.numero_devis}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Email</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {action.devis.email_client}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Agence</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {getAgenceName(action.devis.agence_id)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredActions.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-12 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-700" />
            <p className="mt-4 text-slate-400">Aucune action trouvée pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  )
}
