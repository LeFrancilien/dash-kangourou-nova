'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Devis } from '@/lib/supabase'
import { toast } from 'sonner'

interface ExportButtonProps {
    data: Devis[]
    filename?: string
}

export function ExportButton({ data, filename = 'export-devis' }: ExportButtonProps) {
    const handleExport = () => {
        try {
            if (!data || data.length === 0) {
                toast.error("Aucune donnée à exporter")
                return
            }

            // En-têtes CSV
            const headers = [
                'ID',
                'N° Devis',
                'Client',
                'Email',
                'Téléphone',
                'Montant',
                'Agence',
                'Date Réception',
                'Statut',
                'Converti'
            ]

            // Transformation des données
            const csvData = data.map(d => [
                d.id,
                d.numero_devis,
                d.nom_client,
                d.email_client,
                d.telephone_client || '',
                d.montant || '',
                d.agence_id, // Ou d.agence_nom si disponible
                new Date(d.date_reception).toLocaleDateString('fr-FR'),
                d.statut,
                d.converti ? 'Oui' : 'Non'
            ])

            // Création du contenu CSV
            const csvContent = [
                headers.join(';'),
                ...csvData.map(row => row.map(cell => `"${cell}"`).join(';'))
            ].join('\n')

            // Création du blob et lien de téléchargement
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)

            link.setAttribute('href', url)
            link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success("Export réussi")

        } catch (error) {
            console.error('Erreur export:', error)
            toast.error("Erreur lors de l'export")
        }
    }

    return (
        <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-[#0a0e1a] transition-colors"
        >
            <Download className="h-4 w-4" />
            Exporter
        </button>
    )
}
