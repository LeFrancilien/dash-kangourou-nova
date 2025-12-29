'use client'

import { useState } from 'react'
import { supabase, Agence } from '@/lib/supabase' // Assurez-vous que le chemin est correct
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface NouveauDevisDialogProps {
    children: React.ReactNode
    agences: Agence[]
    onSuccess?: () => void
}

export function NouveauDevisDialog({ children, agences, onSuccess }: NouveauDevisDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form states
    const [numeroDevis, setNumeroDevis] = useState('')
    const [nomClient, setNomClient] = useState('')
    const [emailClient, setEmailClient] = useState('')
    const [telephoneClient, setTelephoneClient] = useState('')
    const [montant, setMontant] = useState('')
    const [agenceId, setAgenceId] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!agenceId) {
                toast.error("Veuillez sélectionner une agence")
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('devis')
                .insert([
                    {
                        numero_devis: numeroDevis,
                        nom_client: nomClient,
                        email_client: emailClient,
                        telephone_client: telephoneClient || null,
                        montant: montant ? parseFloat(montant) : null,
                        agence_id: parseInt(agenceId),
                        date_reception: new Date().toISOString(),
                        statut: 'recu',
                        relance_j2_envoyee: false,
                        email_j4_envoye: false,
                        converti: false
                    }
                ])
                .select()

            if (error) {
                console.error(error)
                toast.error("Erreur lors de la création du devis")
                throw error
            }

            toast.success("Devis créé avec succès")
            setOpen(false)
            resetForm()
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setNumeroDevis('')
        setNomClient('')
        setEmailClient('')
        setTelephoneClient('')
        setMontant('')
        setAgenceId('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1f2e] border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Nouveau devis</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Remplissez les informations ci-dessous pour créer un nouveau devis.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numero" className="text-right text-gray-300">
                            N° Devis
                        </Label>
                        <Input
                            id="numero"
                            value={numeroDevis}
                            onChange={(e) => setNumeroDevis(e.target.value)}
                            className="col-span-3 bg-[#0a0e1a] border-gray-700 text-white"
                            placeholder="DEV-2024-001"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nom" className="text-right text-gray-300">
                            Nom Client
                        </Label>
                        <Input
                            id="nom"
                            value={nomClient}
                            onChange={(e) => setNomClient(e.target.value)}
                            className="col-span-3 bg-[#0a0e1a] border-gray-700 text-white"
                            placeholder="Jean Dupont"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right text-gray-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={emailClient}
                            onChange={(e) => setEmailClient(e.target.value)}
                            className="col-span-3 bg-[#0a0e1a] border-gray-700 text-white"
                            placeholder="jean@exemple.com"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tel" className="text-right text-gray-300">
                            Téléphone
                        </Label>
                        <Input
                            id="tel"
                            type="tel"
                            value={telephoneClient}
                            onChange={(e) => setTelephoneClient(e.target.value)}
                            className="col-span-3 bg-[#0a0e1a] border-gray-700 text-white"
                            placeholder="06 12 34 56 78"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="montant" className="text-right text-gray-300">
                            Montant
                        </Label>
                        <Input
                            id="montant"
                            type="number"
                            step="0.01"
                            value={montant}
                            onChange={(e) => setMontant(e.target.value)}
                            className="col-span-3 bg-[#0a0e1a] border-gray-700 text-white"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="agence" className="text-right text-gray-300">
                            Agence
                        </Label>
                        <div className="col-span-3">
                            <Select value={agenceId} onValueChange={setAgenceId}>
                                <SelectTrigger className="w-full bg-[#0a0e1a] border-gray-700 text-white">
                                    <SelectValue placeholder="Sélectionner une agence" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1f2e] border-gray-700 text-white">
                                    {agences.map((a) => (
                                        <SelectItem key={a.id} value={a.id.toString()}>
                                            {a.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Créer le devis
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
