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

interface DashboardDevis {
  statut: string
  email_client: string
  date_reception: string
  agence_id: number
}

interface ChartData {
  name: string
  [key: string]: string | number
}

// Skeleton Loading Component
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 bg-slate-700 rounded" />
          <div className="h-8 w-16 bg-slate-700 rounded" />
        </div>
        <div className="h-12 w-12 bg-slate-700 rounded-lg" />
      </div>
    </div>
  )
}

const SKELETON_HEIGHTS = ['45%', '70%', '55%', '80%', '40%', '65%']

function SkeletonChart() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-700 rounded mb-6" />
      <div className="h-[300px] bg-slate-800/50 rounded-lg flex items-end justify-around px-4 pb-4">
        {SKELETON_HEIGHTS.map((height, i) => (
          <div
            key={i}
            className="w-12 bg-slate-700 rounded-t"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  )
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
  const [animateProgress, setAnimateProgress] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  // Trigger progress bar animation after data loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setAnimateProgress(true), 100)
      return () => clearTimeout(timer)
    }
  }, [loading])

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
        const data: ChartData[] = last6Months.map(m => {
          const entry: ChartData = { name: m.label }
          agences.forEach((a: { nom: string }) => entry[a.nom] = 0)
          return { ...entry, monthKey: m.monthKey }
        })

        // Remplir avec les compteurs
        devis.forEach((d: DashboardDevis) => {
          if (!d.date_reception || !d.agence_id) return
          const devisMonth = d.date_reception.slice(0, 7)
          const dataEntry = data.find(entry => entry['monthKey'] === devisMonth)

          if (dataEntry) {
            const agence = agences.find((a: { id: number }) => a.id === d.agence_id)
            if (agence) {
              const currentVal = dataEntry[agence.nom] as number
              dataEntry[agence.nom] = currentVal + 1
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
      borderColor: 'border-l-blue-500',
      glowColor: 'hover:shadow-blue-500/20',
    },
    {
      title: 'En attente',
      value: stats.devisEnAttente,
      icon: Clock,
      color: 'bg-orange-500',
      borderColor: 'border-l-orange-500',
      glowColor: 'hover:shadow-orange-500/20',
    },
    {
      title: 'Acceptés',
      value: stats.devisAcceptes,
      icon: TrendingUp,
      color: 'bg-green-500',
      borderColor: 'border-l-green-500',
      glowColor: 'hover:shadow-green-500/20',
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-purple-500',
      borderColor: 'border-l-purple-500',
      glowColor: 'hover:shadow-purple-500/20',
    },
  ]

  // Couleurs pour les agences (Palette cohérente avec le thème sombre)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-9 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="mt-3 h-5 w-64 bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
            <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
            <div className="h-10 w-24 bg-slate-700 rounded mb-4" />
            <div className="h-3 bg-slate-800 rounded-full" />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
            <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-700 rounded" />
                  <div className="h-4 w-8 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SkeletonChart />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <p className="mt-2 text-slate-400">Vue d&apos;ensemble de ton activité</p>
      </div>

      {/* KPIs with staggered animation */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`
                rounded-xl border border-slate-800 border-l-4 ${card.borderColor}
                bg-slate-900/80 backdrop-blur-sm p-6
                shadow-lg ${card.glowColor} hover:shadow-xl
                transform hover:scale-[1.02] hover:-translate-y-1
                transition-all duration-300 ease-out
                animate-in fade-in slide-in-from-bottom-4
              `}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`rounded-xl ${card.color} p-3 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        {/* Taux de conversion */}
        <div
          className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg
                     hover:shadow-xl transition-shadow duration-300
                     animate-in fade-in slide-in-from-left-4 duration-500"
          style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
        >
          <h2 className="text-lg font-semibold text-white">Taux de conversion</h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-bold text-orange-500">{stats.tauxConversion}%</span>
            <span className="mb-2 text-sm text-slate-400">des devis sont acceptés</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full
                         transition-all duration-1000 ease-out"
              style={{ width: animateProgress ? `${stats.tauxConversion}%` : '0%' }}
            />
          </div>
        </div>

        {/* Répartition par statut */}
        <div
          className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg
                     hover:shadow-xl transition-shadow duration-300
                     animate-in fade-in slide-in-from-right-4 duration-500"
          style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
        >
          <h2 className="text-lg font-semibold text-white">Répartition des devis</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">En attente</span>
              </div>
              <span className="font-medium text-white">{stats.devisEnAttente}</span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Envoyés</span>
              </div>
              <span className="font-medium text-white">{stats.devisEnvoyes}</span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Acceptés</span>
              </div>
              <span className="font-medium text-green-500">{stats.devisAcceptes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique Évolution par Agence */}
      <div
        className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg
                   hover:shadow-xl transition-shadow duration-300
                   animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
      >
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
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
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
                    radius={[6, 6, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
