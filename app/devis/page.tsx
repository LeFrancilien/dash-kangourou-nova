'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDevis } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    FileText,
    Filter,
    Download,
    Search,
    Calendar,
    MapPin,
    Euro,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react'

interface Devis {
    id: number
    numero_devis: string
    nom_client: string
    email_client: string
    telephone_client?: string
    montant?: number
    agence_id: number
    agence_nom?: string
    date_reception: string
    statut: string
    relance_j2_envoyee: boolean
    date_relance_j2?: string
    email_j4_envoye: boolean
    date_email_j4?: string
    converti: boolean
    date_conversion?: string
    notes?: string
    created_at: string
    updated_at: string
}

interface Agence {
    id: number
    nom: string
}

export default function DevisPage() {
    const [devis, setDevis] = useState<Devis[]>([])
    const [agences, setAgences] = useState<Agence[]>([])
    const [loading, setLoading] = useState(true)
    const [filtreStatut, setFiltreStatut] = useState<string>('tous')
    const [filtreAgence, setFiltreAgence] = useState<string>('toutes')
    const [recherche, setRecherche] = useState('')

    // Charger les devis et les agences au montage
    useEffect(() => {
        async function loadData() {
            try {
                // Charger les devis
                const dataDevis = await getDevis()
                setDevis(dataDevis)

                // Charger les agences
                const { data: dataAgences, error } = await supabase
                    .from('agences')
                    .select('id, nom')
                    .order('nom', { ascending: true })

                if (error) throw error
                setAgences(dataAgences || [])
            } catch (error) {
                console.error('Erreur chargement données:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Fonction pour calculer le nombre de jours depuis la réception
    const joursDepuisReception = (dateReception: string) => {
        const date = new Date(dateReception)
        const aujourdhui = new Date()
        const diffTime = Math.abs(aujourdhui.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    // Fonction pour obtenir la couleur du badge statut
    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'recu':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'relance_j2':
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            case 'email_j4':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'converti':
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'perdu':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    // Fonction pour obtenir le libellé du statut
    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'recu':
                return 'Reçu'
            case 'relance_j2':
                return 'Relancé J+2'
            case 'email_j4':
                return 'Email J+4'
            case 'converti':
                return 'Converti'
            case 'perdu':
                return 'Perdu'
            default:
                return statut
        }
    }

    // Filtrer les devis
    const devisFiltres = devis.filter(d => {
        const matchStatut = filtreStatut === 'tous' || d.statut === filtreStatut
        const matchAgence = filtreAgence === 'toutes' || d.agence_id.toString() === filtreAgence
        const matchRecherche = recherche === '' ||
            d.nom_client.toLowerCase().includes(recherche.toLowerCase()) ||
            d.numero_devis.toLowerCase().includes(recherche.toLowerCase()) ||
            d.email_client.toLowerCase().includes(recherche.toLowerCase())

        return matchStatut && matchAgence && matchRecherche
    })

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0e1a]">
                <div className="text-gray-400">Chargement des devis...</div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0e1a] p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gestion des Devis</h1>
                        <p className="text-gray-400 mt-2">
                            {devisFiltres.length} devis {devisFiltres.length !== devis.length && `sur ${devis.length}`}
                        </p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 transition-colors">
                        <FileText className="h-4 w-4" />
                        Nouveau devis
                    </button>
                </div>

                {/* Filtres */}
                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            {/* Recherche */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={recherche}
                                    onChange={(e) => setRecherche(e.target.value)}
                                    className="w-full rounded-lg bg-[#0a0e1a] border border-gray-700 pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Filtre Statut */}
                            <select
                                value={filtreStatut}
                                onChange={(e) => setFiltreStatut(e.target.value)}
                                className="rounded-lg bg-[#0a0e1a] border border-gray-700 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="recu">Reçu</option>
                                <option value="relance_j2">Relancé J+2</option>
                                <option value="email_j4">Email J+4</option>
                                <option value="converti">Converti</option>
                                <option value="perdu">Perdu</option>
                            </select>

                            {/* Filtre Agence */}
                            <select
                                value={filtreAgence}
                                onChange={(e) => setFiltreAgence(e.target.value)}
                                className="rounded-lg bg-[#0a0e1a] border border-gray-700 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                            >
                                <option value="toutes">Toutes les agences</option>
                                {agences.map((agence) => (
                                    <option key={agence.id} value={agence.id.toString()}>
                                        {agence.nom}
                                    </option>
                                ))}
                            </select>

                            {/* Export */}
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-[#0a0e1a] transition-colors">
                                <Download className="h-4 w-4" />
                                Exporter
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des devis */}
                <div className="space-y-3">
                    {devisFiltres.length === 0 ? (
                        <Card className="bg-[#1a1f2e] border-gray-800">
                            <CardContent className="p-12 text-center">
                                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">Aucun devis trouvé</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Modifiez vos filtres ou créez un nouveau devis
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        devisFiltres.map((d) => (
                            <Card key={d.id} className="bg-[#1a1f2e] border-gray-800 hover:border-amber-600/50 transition-all cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Infos principales */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {d.nom_client}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(d.statut)}`}>
                                                    {getStatutLabel(d.statut)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <FileText className="h-4 w-4" />
                                                    <span>{d.numero_devis}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{d.agence_nom || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(d.date_reception).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                                {d.montant && (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Euro className="h-4 w-4" />
                                                        <span>{d.montant.toLocaleString('fr-FR')} €</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timeline J+0 / J+2 / J+4 */}
                                            <div className="mt-4 flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${d.statut !== 'perdu' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-700 text-gray-500'
                                                        }`}>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-xs text-gray-400">J+0</span>
                                                </div>

                                                <div className={`h-0.5 w-12 ${d.relance_j2_envoyee ? 'bg-orange-500' : 'bg-gray-700'}`} />

                                                <div className="flex items-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${d.relance_j2_envoyee ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-500'
                                                        }`}>
                                                        {d.relance_j2_envoyee ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                    </div>
                                                    <span className="text-xs text-gray-400">J+2</span>
                                                </div>

                                                <div className={`h-0.5 w-12 ${d.email_j4_envoye ? 'bg-purple-500' : 'bg-gray-700'}`} />

                                                <div className="flex items-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${d.email_j4_envoye ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-700 text-gray-500'
                                                        }`}>
                                                        {d.email_j4_envoye ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                    </div>
                                                    <span className="text-xs text-gray-400">J+4</span>
                                                </div>

                                                {d.converti && (
                                                    <>
                                                        <div className="h-0.5 w-12 bg-green-500" />
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-xs text-green-500 font-medium">Converti</span>
                                                        </div>
                                                    </>
                                                )}

                                                {d.statut === 'perdu' && (
                                                    <>
                                                        <div className="h-0.5 w-12 bg-red-500" />
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
                                                                <XCircle className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-xs text-red-500 font-medium">Perdu</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badge nombre de jours et bouton Voir */}
                                        <div className="ml-4 flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-xs font-medium">
                                                J+{joursDepuisReception(d.date_reception)}
                                            </div>
                                            <Link href={`/devis/${d.id}`}>
                                                <button className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600 transition-colors">
                                                    Voir
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}