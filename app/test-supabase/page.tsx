'use client'

import { useEffect, useState } from 'react'
import { supabase, getDashboardStats } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Connexion basique
        const { data: agences, error: agencesError } = await supabase
          .from('agences')
          .select('*')
        
        if (agencesError) throw agencesError

        // Test 2: Stats dashboard
        const stats = await getDashboardStats()

        setData({
          agences,
          stats
        })
        setStatus('success')
      } catch (err: any) {
        console.error('Erreur:', err)
        setError(err.message || 'Erreur inconnue')
        setStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          🧪 Test Connexion Supabase K-Flow
        </h1>
        
        {status === 'loading' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg">
            <p className="font-semibold">⏳ Connexion en cours...</p>
            <p className="text-sm mt-1">Vérification de la connexion à Supabase</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg">
            <p className="font-bold text-lg">❌ Erreur de connexion</p>
            <p className="mt-2">Vérifie tes credentials dans .env.local</p>
            <pre className="mt-3 bg-red-100 p-3 rounded text-sm overflow-auto">
              {error}
            </pre>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-lg">
              <p className="font-bold text-lg">✅ Connexion réussie !</p>
              <p className="text-sm mt-1">La base de données K-Flow est opérationnelle</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-4">
                📍 Agences trouvées ({data?.agences?.length || 0})
              </h2>
              <div className="space-y-3">
                {data?.agences?.map((agence: any) => (
                  <div key={agence.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="font-semibold text-gray-900">{agence.nom}</p>
                    <p className="text-sm text-gray-600">{agence.ville}</p>
                    <p className="text-sm text-gray-600">{agence.email}</p>
                    <p className="text-sm text-gray-600">{agence.telephone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-4">
                📊 Stats Dashboard
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Devis aujourd'hui</p>
                  <p className="text-2xl font-bold text-blue-700">{data?.stats?.devisAujourdhui}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Devis J+2</p>
                  <p className="text-2xl font-bold text-orange-700">{data?.stats?.devisJ2}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Emails J+4</p>
                  <p className="text-2xl font-bold text-purple-700">{data?.stats?.emailsJ4}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Taux conversion</p>
                  <p className="text-2xl font-bold text-green-700">{data?.stats?.tauxConversion}%</p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Contrats actifs</p>
                  <p className="text-2xl font-bold text-red-700">{data?.stats?.contratsActifs}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Alertes</p>
                  <p className="text-2xl font-bold text-yellow-700">{data?.stats?.alertesNonTraitees}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600 mb-2">🎉 <strong>Prochaine étape :</strong> Dashboard principal</p>
              <p className="text-xs text-gray-500">Tout est prêt ! On peut maintenant créer les pages du dashboard.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}