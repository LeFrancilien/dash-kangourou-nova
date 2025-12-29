'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ArrowLeft,
    Share2,
    Calendar,
    Mail,
    Phone,
    MapPin,
    PenTool,
    CheckCircle2,
    XCircle,
    User,
    Euro,
    FileText,
    Clock,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// Type definitions (copied from original file)
interface Devis {
    id: number;
    numero_devis: string;
    nom_client: string;
    prenom_client: string;
    email_client: string;
    telephone_client?: string;
    montant?: number;
    agence_id: number;
    agence_nom?: string;
    date_reception: string;
    statut: string;
    relance_j2_envoyee: boolean;
    date_relance_j2?: string;
    email_j4_envoye: boolean;
    date_email_j4?: string;
    converti: boolean;
    date_conversion?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    adresse_client?: string;
    ville_client?: string;
    code_postal_client?: string;
    type_prestation?: string;
    source_contact?: string;
}

function DevisDetailsContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter()
    const [devis, setDevis] = useState<Devis | null>(null)
    const [loading, setLoading] = useState(true)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (id) {
            fetchDevis(id)
        }
    }, [id])

    async function fetchDevis(devisId: string) {
        try {
            const { data, error } = await supabase
                .from('devis')
                .select('*')
                .eq('id', devisId)
                .single()

            if (error) throw error
            setDevis(data)
            setNewStatus(data.statut)
            setNotes(data.notes || '')
        } catch (error) {
            console.error('Erreur chargement devis:', error)
            toast.error("Impossible de charger le devis")
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus() {
        if (!devis) return

        try {
            const updates: any = {
                statut: newStatus,
                notes: notes,
                updated_at: new Date().toISOString()
            }

            // Si converti, on met à jour le flag et la date
            if (newStatus === 'converti' && !devis.converti) {
                updates.converti = true
                updates.date_conversion = new Date().toISOString()
            }

            const { error } = await supabase
                .from('devis')
                .update(updates)
                .eq('id', devis.id)

            if (error) throw error

            setDevis({ ...devis, ...updates })
            setIsStatusDialogOpen(false)
            toast.success("Statut mis à jour avec succès")
        } catch (error) {
            console.error('Erreur mise à jour:', error)
            toast.error("Erreur lors de la mise à jour")
        }
    }

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-slate-500 animate-pulse">Chargement des détails...</div>
        </div>
    )

    if (!devis) return (
        <div className="flex flex-col h-screen items-center justify-center gap-4">
            <div className="text-slate-500">Devis introuvable</div>
            <Button variant="outline" onClick={() => router.back()}>Retour</Button>
        </div>
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'nouveau': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'en_attente': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            case 'converti': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'perdu': return 'bg-red-500/10 text-red-500 border-red-500/20'
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'nouveau': return 'Nouveau'
            case 'en_attente': return 'En attente'
            case 'converti': return 'Converti'
            case 'perdu': return 'Perdu'
            default: return status
        }
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-800">
                        <Share2 className="h-4 w-4" />
                        Partager
                    </Button>
                    <Button
                        className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setIsStatusDialogOpen(true)}
                    >
                        <PenTool className="h-4 w-4" />
                        Modifier
                    </Button>
                </div>
            </div>

            {/* Titre et Statut */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        Devis #{devis.numero_devis}
                        <Badge variant="outline" className={getStatusColor(devis.statut)}>
                            {getStatusLabel(devis.statut)}
                        </Badge>
                    </h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Reçu le {format(new Date(devis.date_reception), 'dd MMMM yyyy', { locale: fr })}
                        {devis.agence_nom && (
                            <>
                                <span>•</span>
                                <span>Agence {devis.agence_nom}</span>
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne Gauche - Info Client */}
                <div className="space-y-6 lg:col-span-2">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <User className="h-5 w-5 text-orange-500" />
                                Informations Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-slate-500 text-xs uppercase">Nom complet</Label>
                                    <p className="text-white font-medium text-lg">{devis.prenom_client} {devis.nom_client}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-slate-500 text-xs uppercase">Email</Label>
                                    <div className="flex items-center gap-2 text-white">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        <a href={`mailto:${devis.email_client}`} className="hover:text-orange-500 transition-colors">
                                            {devis.email_client}
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-slate-500 text-xs uppercase">Téléphone</Label>
                                    <div className="flex items-center gap-2 text-white">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        {devis.telephone_client ? (
                                            <a href={`tel:${devis.telephone_client}`} className="hover:text-orange-500 transition-colors">
                                                {devis.telephone_client}
                                            </a>
                                        ) : (
                                            <span className="text-slate-600 italic">Non renseigné</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-slate-500 text-xs uppercase">Adresse</Label>
                                    <div className="flex items-start gap-2 text-white">
                                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                                        <span>
                                            {devis.adresse_client || 'Adresse non renseignée'}
                                            {(devis.ville_client || devis.code_postal_client) && (
                                                <div className="text-slate-400">
                                                    {devis.code_postal_client} {devis.ville_client}
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <FileText className="h-5 w-5 text-purple-500" />
                                Détails de la demande
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="text-slate-500 text-xs uppercase">Type de prestation</Label>
                                    <p className="text-white mt-1">{devis.type_prestation || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-500 text-xs uppercase">Source</Label>
                                    <p className="text-white mt-1">{devis.source_contact || 'Non spécifiée'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-slate-500 text-xs uppercase">Notes internes</Label>
                                    <div className="mt-2 p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 min-h-[100px]">
                                        {devis.notes || <span className="italic text-slate-600">Aucune note pour ce dossier...</span>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne Droite - Actions & KPIs */}
                <div className="space-y-6">
                    {/* Carte Montant */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-900 border-slate-800 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Euro className="h-24 w-24 text-white" />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <Label className="text-slate-400 text-xs uppercase font-semibold">Montant Estimé</Label>
                            <div className="mt-2 text-4xl font-bold text-white flex items-baseline gap-1">
                                {devis.montant ? devis.montant.toLocaleString('fr-FR') : '0'}
                                <span className="text-lg text-slate-500 font-normal">€</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline / Suivi Automatisé */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white text-base">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Suivi Automatisé
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Étape 1 : Réception */}
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                                    <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-medium text-white">Demande reçue</p>
                                    <p className="text-xs text-slate-500">{format(new Date(devis.date_reception), 'dd MMM yyyy HH:mm', { locale: fr })}</p>
                                </div>
                            </div>

                            {/* Étape 2 : Relance J+2 */}
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    {devis.relance_j2_envoyee ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                    ) : (
                                        <div className="h-2 w-2 rounded-full bg-slate-700 mt-2"></div>
                                    )}
                                    <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <p className={`text-sm font-medium ${devis.relance_j2_envoyee ? 'text-white' : 'text-slate-500'}`}>
                                        Relance J+2
                                    </p>
                                    {devis.relance_j2_envoyee ? (
                                        <p className="text-xs text-green-500/80">Envoyée le {devis.date_relance_j2 && format(new Date(devis.date_relance_j2), 'dd MMM', { locale: fr })}</p>
                                    ) : (
                                        <p className="text-xs text-slate-600">Prévue le {devis.date_reception && format(new Date(new Date(devis.date_reception).setDate(new Date(devis.date_reception).getDate() + 2)), 'dd MMM', { locale: fr })}</p>
                                    )}
                                </div>
                            </div>

                            {/* Étape 3 : Email J+4 */}
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    {devis.email_j4_envoye ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                    ) : (
                                        <div className="h-2 w-2 rounded-full bg-slate-700 mt-2"></div>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${devis.email_j4_envoye ? 'text-white' : 'text-slate-500'}`}>
                                        Email Marketing J+4
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        {devis.email_j4_envoye ? 'Envoyé' : 'En attente'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carte Conversion */}
                    {devis.converti && (
                        <Card className="bg-green-500/10 border-green-500/20">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-full text-white">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-green-500">Client Converti !</p>
                                    <p className="text-xs text-green-500/70">
                                        le {devis.date_conversion && format(new Date(devis.date_conversion), 'dd MMMM yyyy', { locale: fr })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Dialog Edit Status */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Modifier le devis</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white"
                            >
                                <option value="nouveau">Nouveau</option>
                                <option value="en_attente">En attente</option>
                                <option value="converti">Converti (Gagné)</option>
                                <option value="perdu">Perdu</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white h-24"
                                placeholder="Ajouter une note..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Annuler</Button>
                        <Button onClick={updateStatus} className="bg-orange-500 hover:bg-orange-600 text-white">Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Main page component wrapped in Suspense for searchParams support
export default function DevisDetailsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="text-slate-500 animate-pulse">Chargement...</div>
            </div>
        }>
            <DevisDetailsContent />
        </Suspense>
    )
}
