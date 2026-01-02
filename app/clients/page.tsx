'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Mail, Phone, MapPin } from 'lucide-react'

interface Client {
  email: string
  nom: string
  prenom: string
  telephone: string | null
  commune: string | null
  totalDevis: number
  devisAcceptes: number
}

// Interface locale pour le typage
interface DevisRow {
  email_client: string
  nom_client: string
  prenom_client: string
  telephone_client: string | null
  ville: string | null
  client_commune: string | null
  statut: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  async function loadClients() {
    // supabase instance imported directly

    try {
      const { data: devis } = await supabase
        .from('devis')
        .select('*')

      if (devis) {
        // Grouper par email client
        const clientsMap = new Map<string, Client>()

        devis.forEach((d: DevisRow) => {
          // Utiliser email_client comme identifiant unique
          if (!d.email_client) return

          if (!clientsMap.has(d.email_client)) {
            clientsMap.set(d.email_client, {
              email: d.email_client,
              nom: d.nom_client || '',
              prenom: d.prenom_client || '',
              telephone: d.telephone_client || '',
              commune: d.ville || d.client_commune || null, // Tentative de récupération de la ville
              totalDevis: 0,
              devisAcceptes: 0,
            })
          }

          const client = clientsMap.get(d.email_client)!
          client.totalDevis++
          if (d.statut === 'Accepté') {
            client.devisAcceptes++
          }
        })

        const clientsArray = Array.from(clientsMap.values())
          .sort((a, b) => b.totalDevis - a.totalDevis)

        setClients(clientsArray)
        setFilteredClients(clientsArray)
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Clients</h1>
        <p className="mt-2 text-slate-400">Base de données de tes clients</p>
      </div>

      {/* Recherche */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-500"
          />
        </div>
        <div className="text-sm text-slate-400">
          {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Liste clients */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800 bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Commune
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Acceptés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Taux
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredClients.map((client) => {
                const taux = client.totalDevis > 0
                  ? Math.round((client.devisAcceptes / client.totalDevis) * 100)
                  : 0

                return (
                  <tr key={client.email} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {client.prenom} {client.nom}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        {client.telephone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="h-4 w-4" />
                            {client.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.commune && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="h-4 w-4" />
                          {client.commune}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">
                        {client.totalDevis}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-500">
                        {client.devisAcceptes}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">
                        {taux}%
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-slate-600">
            Aucun client trouvé
          </div>
        )}
      </div>
    </div>
  )
}
