'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ArrowLeft,
    FileText,
    MapPin,
    Calendar,
    Euro,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    Save,
    PhoneCall
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
    contact_etabli?: boolean
    date_contact?: string
    appel_j0_effectue?: boolean
    date_appel_j0?: string
    appel_j2_effectue?: boolean
    date_appel_j2?: string
    alerte_breschi_envoyee?: boolean
    date_alerte_breschi?: string
    created_at: string
    updated_at: string
}

export default function DevisDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [devis, setDevis] = useState<Devis | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notes, setNotes] = useState('')
    const [showConfirm, setShowConfirm] = useState<'convertir' | 'perdu' | 'contact' | 'appel_j0' | 'appel_j2' | null>(null)

    useEffect(() => {
        async function loadDevis() {
            try {
                const { data, error } = await supabase
                    .from('devis')
                    .select('*, agences:agence_id (nom)')
                    .eq('id', params.id)
                    .single()

                if (error) throw error

                const devisData: Devis = {
                    ...data,
                    agence_nom: data.agences?.nom
                }

                setDevis(devisData)
                setNotes(devisData.notes || '')
            } catch (error) {
                console.error('Erreur:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            loadDevis()
        }
    }, [params.id])

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleConvertir = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({
                    converti: true,
                    date_conversion: new Date().toISOString(),
                    statut: 'converti',
                    updated_at: new Date().toISOString()
                })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Devis converti !')
            router.push('/devis')
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur')
        } finally {
            setSaving(false)
            setShowConfirm(null)
        }
    }

    const handleMarquerPerdu = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({
                    statut: 'perdu',
                    updated_at: new Date().toISOString()
                })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Devis marqué perdu')
            router.push('/devis')
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur')
        } finally {
            setSaving(false)
            setShowConfirm(null)
        }
    }

    const handleRelancer = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            alert('📧 Relance envoyée !')
        } finally {
            setSaving(false)
        }
    }

    const handleContactEtabli = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({
                    contact_etabli: true,
                    date_contact: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Contact établi ! Les relances automatiques sont arrêtées.')
            window.location.reload()
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur lors de la mise à jour')
        } finally {
            setSaving(false)
            setShowConfirm(null)
        }
    }

    const handleAppelJ0 = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({
                    appel_j0_effectue: true,
                    date_appel_j0: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Appel J+0 enregistré !')
            window.location.reload()
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur')
        } finally {
            setSaving(false)
            setShowConfirm(null)
        }
    }

    const handleAppelJ2 = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({
                    appel_j2_effectue: true,
                    date_appel_j2: new Date().toISOString(),
                    relance_j2_envoyee: true,
                    date_relance_j2: new Date().toISOString(),
                    statut: 'relance_j2',
                    updated_at: new Date().toISOString()
                })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Appel J+2 enregistré !')
            window.location.reload()
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur')
        } finally {
            setSaving(false)
            setShowConfirm(null)
        }
    }

    const handleSaveNotes = async () => {
        if (!devis || saving) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('devis')
                .update({ notes: notes, updated_at: new Date().toISOString() })
                .eq('id', devis.id)

            if (error) throw error
            alert('✅ Notes sauvegardées !')
        } catch (error) {
            console.error('Erreur:', error)
            alert('❌ Erreur')
        } finally {
            setSaving(false)
        }
    }

    const joursDepuisReception = (dateReception: string) => {
        const date = new Date(dateReception)
        const aujourdhui = new Date()
        const diffTime = Math.abs(aujourdhui.getTime() - date.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0e1a]">
                <div className="text-gray-400">Chargement...</div>
            </div>
        )
    }

    if (!devis) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0e1a]">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">Devis introuvable</p>
                    <button onClick={() => router.push('/devis')} className="text-amber-500 hover:text-amber-400">
                        Retour
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0e1a] p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/devis')} className="p-2 rounded-lg hover:bg-gray-800">
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{devis.nom_client}</h1>
                            {devis.contact_etabli && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30">
                                    ✓ Contacté
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 mt-1">Devis {devis.numero_devis}</p>
                    </div>
                </div>

                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Informations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-xs text-gray-400">Numéro</p>
                                    <p className="text-white font-medium">{devis.numero_devis}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-xs text-gray-400">Agence</p>
                                    <p className="text-white font-medium">{devis.agence_nom || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-xs text-gray-400">Date</p>
                                    <p className="text-white font-medium">{formatDateTime(devis.date_reception)}</p>
                                    <p className="text-xs text-gray-500">Il y a {joursDepuisReception(devis.date_reception)} jours</p>
                                </div>
                            </div>
                            {devis.montant && (
                                <div className="flex items-center gap-3">
                                    <Euro className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Montant</p>
                                        <p className="text-white font-medium text-lg">{devis.montant.toLocaleString('fr-FR')} €</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-amber-500" />
                            <a href={`mailto:${devis.email_client}`} className="text-white hover:text-amber-500">
                                {devis.email_client}
                            </a>
                        </div>
                        {devis.telephone_client && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-amber-500" />
                                <a href={`tel:${devis.telephone_client}`} className="text-white hover:text-amber-500">
                                    {devis.telephone_client}
                                </a>
                            </div>
                        )}
                        {devis.appel_j0_effectue && devis.date_appel_j0 && (
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-blue-500 text-sm font-medium">
                                    📞 Appel J+0 effectué le {formatDateTime(devis.date_appel_j0)}
                                </p>
                            </div>
                        )}
                        {devis.appel_j2_effectue && devis.date_appel_j2 && (
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <p className="text-orange-500 text-sm font-medium">
                                    📞 Appel J+2 effectué le {formatDateTime(devis.date_appel_j2)}
                                </p>
                            </div>
                        )}
                        {devis.contact_etabli && devis.date_contact && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-green-500 text-sm font-medium">
                                    ✓ Contact établi le {formatDateTime(devis.date_contact)}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Suivi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${devis.appel_j0_effectue ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-700 text-gray-500'}`}>
                                    {devis.appel_j0_effectue ? <CheckCircle2 className="h-6 w-6" /> : <PhoneCall className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">J+0</p>
                                    <p className="text-white text-sm">{formatDateTime(devis.date_reception)}</p>
                                </div>
                            </div>
                            <div className={`h-1 w-16 ${devis.appel_j2_effectue ? 'bg-orange-500' : 'bg-gray-700'}`} />
                            <div className="flex items-center gap-2">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${devis.appel_j2_effectue ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-500'}`}>
                                    {devis.appel_j2_effectue ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">J+2</p>
                                    {devis.date_appel_j2 ? (
                                        <p className="text-white text-sm">{formatDateTime(devis.date_appel_j2)}</p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">En attente</p>
                                    )}
                                </div>
                            </div>
                            <div className={`h-1 w-16 ${devis.email_j4_envoye ? 'bg-purple-500' : 'bg-gray-700'}`} />
                            <div className="flex items-center gap-2">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${devis.email_j4_envoye ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-700 text-gray-500'}`}>
                                    {devis.email_j4_envoye ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">J+4</p>
                                    {devis.date_email_j4 ? (
                                        <p className="text-white text-sm">{formatDateTime(devis.date_email_j4)}</p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">En attente</p>
                                    )}
                                </div>
                            </div>
                            {devis.converti && (
                                <>
                                    <div className="h-1 w-16 bg-green-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Converti</p>
                                            {devis.date_conversion && (
                                                <p className="text-white text-sm">{formatDateTime(devis.date_conversion)}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {devis.statut === 'perdu' && (
                                <>
                                    <div className="h-1 w-16 bg-red-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
                                            <XCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Perdu</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {!devis.converti && devis.statut !== 'perdu' && (
                    <Card className="bg-[#1a1f2e] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-3 flex-wrap">
                            {!devis.appel_j0_effectue && !devis.contact_etabli && (
                                <button
                                    onClick={() => setShowConfirm('appel_j0')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <PhoneCall className="h-4 w-4" />
                                    Appel J+0 effectué
                                </button>
                            )}

                            {!devis.appel_j2_effectue && !devis.contact_etabli && devis.appel_j0_effectue && (
                                <button
                                    onClick={() => setShowConfirm('appel_j2')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                    <PhoneCall className="h-4 w-4" />
                                    Appel J+2 effectué
                                </button>
                            )}

                            {!devis.contact_etabli && (
                                <button
                                    onClick={() => setShowConfirm('contact')}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    <Phone className="h-4 w-4" />
                                    Contact établi
                                </button>
                            )}

                            <button onClick={() => setShowConfirm('convertir')} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                <CheckCircle2 className="h-4 w-4" />
                                Convertir
                            </button>
                            <button onClick={handleRelancer} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50">
                                <Send className="h-4 w-4" />
                                Relancer
                            </button>
                            <button onClick={() => setShowConfirm('perdu')} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                                <XCircle className="h-4 w-4" />
                                Marquer perdu
                            </button>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-[#1a1f2e] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." className="w-full min-h-[120px] rounded-lg bg-[#0a0e1a] border border-gray-700 p-3 text-white placeholder:text-gray-500 focus:border-amber-500 focus:outline-none resize-none" />
                        <button onClick={handleSaveNotes} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50">
                            <Save className="h-4 w-4" />
                            Sauvegarder
                        </button>
                    </CardContent>
                </Card>

                {showConfirm === 'appel_j0' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="bg-[#1a1f2e] border-gray-800 w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-white">Confirmer l'appel J+0</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">
                                    Tu as effectué le premier appel téléphonique avec ce client ?
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={handleAppelJ0} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                                        Oui, appel effectué
                                    </button>
                                    <button onClick={() => setShowConfirm(null)} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                                        Annuler
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showConfirm === 'appel_j2' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="bg-[#1a1f2e] border-gray-800 w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-white">Confirmer l'appel J+2</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">
                                    Tu as effectué le deuxième appel téléphonique (J+2) avec ce client ?
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={handleAppelJ2} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50">
                                        Oui, appel effectué
                                    </button>
                                    <button onClick={() => setShowConfirm(null)} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                                        Annuler
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showConfirm === 'contact' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="bg-[#1a1f2e] border-gray-800 w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-white">Confirmer le contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">
                                    Marquer ce client comme contacté ?
                                    <br />
                                    <span className="text-amber-500 text-sm">
                                        ⚠️ Les relances automatiques seront arrêtées.
                                    </span>
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={handleContactEtabli} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                        Oui, contact établi
                                    </button>
                                    <button onClick={() => setShowConfirm(null)} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                                        Annuler
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showConfirm === 'convertir' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="bg-[#1a1f2e] border-gray-800 w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-white">Confirmer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">Convertir ce devis en contrat ?</p>
                                <div className="flex gap-3">
                                    <button onClick={handleConvertir} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                        Oui
                                    </button>
                                    <button onClick={() => setShowConfirm(null)} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                                        Annuler
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showConfirm === 'perdu' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="bg-[#1a1f2e] border-gray-800 w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-white">Confirmer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">Marquer ce devis comme perdu ?</p>
                                <div className="flex gap-3">
                                    <button onClick={handleMarquerPerdu} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                                        Oui
                                    </button>
                                    <button onClick={() => setShowConfirm(null)} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                                        Annuler
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}