'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/supabase'
import {
    FileText,
    Clock,
    Mail,
    TrendingUp,
    Users,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
    devisAujourdhui: number
    devisJ2: number
    emailsJ4: number
    tauxConversion: number
    contratsActifs: number
    alertesNonTraitees: number
}

export default function HomePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getDashboardStats()
                setStats(data)
            } catch (error) {
                console.error('Erreur chargement stats:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0e1a]">
                <div className="text-gray-400">Chargement du dashboard...</div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0e1a] p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* En-tête */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                    <p className="text-gray-400 mt-2">Vue d'ensemble de vos agences Kangourou Kids</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Devis aujourd'hui */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Devis aujourd'hui
                            </CardTitle>
                            <FileText className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.devisAujourdhui ?? 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Reçus ce jour
                            </p>
                        </CardContent>
                    </Card>

                    {/* Devis J+2 */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Relances J+2
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.devisJ2 ?? 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                À relancer aujourd'hui
                            </p>
                        </CardContent>
                    </Card>

                    {/* Emails J+4 */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Emails auto J+4
                            </CardTitle>
                            <Mail className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.emailsJ4 ?? 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                À envoyer automatiquement
                            </p>
                        </CardContent>
                    </Card>

                    {/* Taux conversion */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Taux conversion
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.tauxConversion ?? 0}%
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                30 derniers jours
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Résumé activité */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Contrats actifs */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Users className="h-5 w-5 text-amber-500" />
                                Contrats Fantômes Actifs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white mb-2">
                                {stats?.contratsActifs ?? 0}
                            </div>
                            <p className="text-sm text-gray-400">
                                procédures en cours de traitement
                            </p>
                        </CardContent>
                    </Card>

                    {/* Alertes */}
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Alertes en attente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white mb-2">
                                {stats?.alertesNonTraitees ?? 0}
                            </div>
                            <p className="text-sm text-gray-400">
                                actions nécessitent votre attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Message de bienvenue */}
                <Card className="bg-gradient-to-r from-amber-600 to-orange-600 border-0">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Bienvenue Marc ! 👋
                        </h2>
                        <p className="text-amber-50">
                            Le tableau de bord K-Flow centralise toutes les données de vos 3 agences Kangourou Kids.
                            Utilisez les modules Devis et Contrats Fantômes pour optimiser votre suivi.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}