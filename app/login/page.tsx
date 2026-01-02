'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                throw error
            }

            toast.success('Connexion réussie')
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Erreur de connexion:', error)
            toast.error('Erreur lors de la connexion. Vérifiez vos identifiants.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950">
            <div className="w-full max-w-sm space-y-8 rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 h-12 w-12 overflow-hidden rounded bg-white">
                        <Image
                            src="/kangourou-kids-logo.png"
                            alt="Kangourou Kids"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Connexion K-Flow
                    </h2>
                    <p className="text-sm text-slate-400">
                        Entrez vos identifiants pour accéder au dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium leading-none text-slate-200"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="nom@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium leading-none text-slate-200"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-950"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <Link
                        href="/dashboard"
                        className="text-slate-400 hover:text-white hover:underline"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    )
}
