'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDevis, Agence, Devis } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { NouveauDevisDialog } from '@/components/nouveau-devis-dialog'
import { ExportButton } from '@/components/export-button'
import {
    FileText,
    Search,
    Calendar,
    MapPin,
    Euro,
    Clock,
    CheckCircle2,
    XCircle,
    Plus
} from 'lucide-react'

export default function DevisPage() {
    const [devis, setDevis] = useState<Awaited<ReturnType<typeof getDevis>>>([])
    const [agences, setAgences] = useState<Agence[]>([])
    const [loading, setLoading] = useState(true)
    const [filtreStatut, setFiltreStatut] = useState<string>('tous')
    const [filtreAgence, setFiltreAgence] = useState<string>('toutes')
    const [recherche, setRecherche] = useState('')

    // Charger les devis et les agences au montage
    async function loadData() {
        try {
            // Charger les devis
            const dataDevis = await getDevis()
            setDevis(dataDevis)

            // Charger les agences
            const { data: dataAgences, error } = await supabase
                .from('agences')
                .select('*')
                .order('nom', { ascending: true })

            if (error) throw error
            setAgences(dataAgences || [])
        } catch (error) {
            console.error('Erreur chargement données:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
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
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Chargement des devis...</div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* En-tête avec Nouveau Devis */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestion des Devis</h1>
                        <p className="text-muted-foreground mt-2">
                            {devisFiltres.length} devis {devisFiltres.length !== devis.length && `sur ${devis.length}`}
                        </p>
                    </div>
                    <NouveauDevisDialog agences={agences} onSuccess={loadData}>
                        <button className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 transition-colors">
                            <Plus className="h-4 w-4" />
                            Nouveau devis
                        </button>
                    </NouveauDevisDialog>
                </div>

                {/* Filtres et Export */}
                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            {/* Recherche */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un client, un devis..."
                                    value={recherche}
                                    onChange={(e) => setRecherche(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Filtre Statut */}
                            <select
                                value={filtreStatut}
                                onChange={(e) => setFiltreStatut(e.target.value)}
                                className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
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
                                className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
                            >
                                <option value="toutes">Toutes les agences</option>
                                {agences.map((agence) => (
                                    <option key={agence.id} value={agence.id.toString()}>
                                        {agence.nom}
                                    </option>
                                ))}
                            </select>

                            {/* Export Button */}
                            <ExportButton data={devisFiltres} />
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
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {d.prenom_client} {d.nom_client.toUpperCase()}
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
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-foreground mb-1">{d.montant.toLocaleString('fr-FR')} €</p>
                                                        </div>                    </div>
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
                                            <Link
                                                href={`/devis/details?id=${d.id}`}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                                                title="Voir le détail"
                                            >
                                                <ArrowRight className="h-4 w-4" />
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