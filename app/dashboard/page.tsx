'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Users, TrendingUp, Clock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Stats {
  totalDevis: number
  devisEnAttente: number
  devisEnvoyes: number
  devisAcceptes: number
  totalClients: number
  tauxConversion: number
}

interface ChartData {
  name: string
  [key: string]: string | number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalDevis: 0,
    devisEnAttente: 0,
    devisEnvoyes: 0,
    devisAcceptes: 0,
    totalClients: 0,
    tauxConversion: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // 1. Charger les agences
      const { data: agences } = await supabase
        .from('agences')
        .select('id, nom')
        .order('id')

      // 2. Récupérer tous les devis avec date et agence
      const { data: devis } = await supabase
        .from('devis')
        .select('statut, email_client, date_reception, agence_id')

      if (devis && agences) {
        // --- Calcul des KPIs existants ---
        const totalDevis = devis.length
        const devisEnAttente = devis.filter(d => ['recu', 'relance_j2'].includes(d.statut)).length
        const devisEnvoyes = devis.filter(d => d.statut === 'email_j4').length
        const devisAcceptes = devis.filter(d => d.statut === 'converti').length

        // Clients uniques (basé sur email_client)
        const uniqueClients = new Set(devis.map(d => d.email_client).filter(Boolean)).size

        const tauxConversion = totalDevis > 0
          ? Math.round((devisAcceptes / totalDevis) * 100)
          : 0

        setStats({
          totalDevis,
          devisEnAttente,
          devisEnvoyes,
          devisAcceptes,
          totalClients: uniqueClients,
          tauxConversion,
        })

        // --- Préparation des données du graphique (6 derniers mois) ---
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date()
          d.setMonth(d.getMonth() - (5 - i))
          return {
            monthKey: d.toISOString().slice(0, 7), // "YYYY-MM"
            label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
          }
        })

        // Initialiser les données du graphique
        const data = last6Months.map(m => {
          const entry: ChartData = { name: m.label }
          agences.forEach((a: any) => entry[a.nom] = 0)
          return { ...entry, monthKey: m.monthKey }
        })

        // Remplir avec les compteurs
        devis.forEach((d: any) => {
          if (!d.date_reception || !d.agence_id) return
          const devisMonth = d.date_reception.slice(0, 7)
          const dataEntry = data.find(entry => entry['monthKey'] === devisMonth)

          if (dataEntry) {
            const agence = agences.find((a: any) => a.id === d.agence_id)
            if (agence) {
              const currentVal = (dataEntry as any)[agence.nom] as number
              (dataEntry as any)[agence.nom] = currentVal + 1
            }
          }
        })

        setChartData(data)
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total Devis',
      value: stats.totalDevis,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'En attente',
      value: stats.devisEnAttente,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Acceptés',
      value: stats.devisAcceptes,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-purple-500',
    },
  ]

  // Couleurs pour les agences (Palette cohérente avec le thème sombre)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

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
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <p className="mt-2 text-slate-400">Vue d&apos;ensemble de ton activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`rounded-lg ${card.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        {/* Taux de conversion */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white">Taux de conversion</h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-bold text-orange-500">{stats.tauxConversion}%</span>
            <span className="mb-2 text-sm text-slate-400">des devis sont acceptés</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${stats.tauxConversion}%` }}
            />
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white">Répartition des devis</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">En attente</span>
              <span className="font-medium text-white">{stats.devisEnAttente}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Envoyés</span>
              <span className="font-medium text-white">{stats.devisEnvoyes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Acceptés</span>
              <span className="font-medium text-green-500">{stats.devisAcceptes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique Évolution par Agence */}
      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-white">Évolution des devis par agence</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {chartData.length > 0 && Object.keys(chartData[0])
                .filter(key => key !== 'name' && key !== 'monthKey')
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLORS[index % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
