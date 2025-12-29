import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION SUPABASE
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// TYPES TYPESCRIPT
// ============================================

export interface Agence {
  id: number
  nom: string
  ville: string | null
  adresse: string | null
  email: string | null
  telephone: string | null
  responsable: string | null
  created_at: string
  updated_at: string
}

export interface Devis {
  id: number
  numero_devis: string
  nom_client: string
  prenom_client: string
  email_client: string
  telephone_client?: string | null
  montant?: number | null
  agence_id: number
  agence_nom?: string // Ajouté pour le JOIN
  date_reception: string
  statut: string
  relance_j2_envoyee: boolean
  date_relance_j2?: string | null
  email_j4_envoye: boolean
  date_email_j4?: string | null
  converti: boolean
  date_conversion?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface ContratFantome {
  id: string

  // Salarié
  salarie_nom: string
  salarie_prenom: string
  salarie_email: string | null
  salarie_telephone: string | null
  salarie_adresse: string | null
  agence_id: number | null

  // Contexte
  derniere_activite: string | null
  jours_inactivite: number | null

  // Workflow
  etape_actuelle: number
  statut: string

  // Étape 1
  etape1_date_lancement: string | null
  etape1_appel_fait: boolean
  etape1_appel_date: string | null
  etape1_email_envoye: boolean
  etape1_email_date: string | null
  etape1_lrar_envoye: boolean
  etape1_lrar_numero: string | null
  etape1_lrar_date: string | null

  // Étape 2
  etape2_date_prevue: string | null
  etape2_lrar_envoye: boolean
  etape2_lrar_numero: string | null
  etape2_lrar_date: string | null
  etape2_date_entretien: string | null

  // Étape 3
  etape3_date_entretien: string | null
  etape3_presente: boolean | null
  etape3_compte_rendu: string | null
  etape3_pointage_verifie: boolean
  etape3_pointage_date: string | null

  // Étape 4
  etape4_lrar_envoye: boolean
  etape4_lrar_numero: string | null
  etape4_lrar_date: string | null
  etape4_date_fin_contrat: string | null

  // Documents
  documents: any
  preuves: any

  // Metadata
  created_at: string
  updated_at: string
  cloture_date: string | null
  excel_raw: any
}

export interface Alerte {
  id: string
  type: string
  priorite: string
  titre: string
  message: string
  entite_type: string | null
  entite_id: string | null
  vue: boolean
  vue_date: string | null
  traitee: boolean
  traitee_date: string | null
  created_at: string
}

// ============================================
// FONCTIONS HELPER
// ============================================

/**
 * Récupère tous les devis avec filtres optionnels
 */
export async function getDevis(filters?: {
  statut?: string
  agence_id?: number
  limit?: number
}): Promise<Devis[]> {
  let query = supabase
    .from('devis')
    .select(`
      *,
      agence:agences(nom)
    `)
    .order('date_reception', { ascending: false })

  if (filters?.statut) {
    query = query.eq('statut', filters.statut)
  }

  if (filters?.agence_id) {
    query = query.eq('agence_id', filters.agence_id)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erreur lors de la récupération des devis:', error)
    throw error
  }

  // Ajouter le nom d'agence dans chaque devis
  return (data || []).map((d: any) => ({
    ...d,
    agence_nom: d.agence?.nom || 'N/A'
  }))
}

/**
 * Récupère un devis par ID
 */
export async function getDevisById(id: number): Promise<Devis> {
  const { data, error } = await supabase
    .from('devis')
    .select(`
      *,
      agence:agences(nom)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération du devis:', error)
    throw error
  }

  return {
    ...data,
    agence_nom: data.agence?.nom || 'N/A'
  }
}

/**
 * Met à jour un devis
 */
export async function updateDevis(id: number, updates: Partial<Devis>): Promise<Devis> {
  const { data, error } = await supabase
    .from('devis')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      agence:agences(nom)
    `)
    .single()

  if (error) {
    console.error('Erreur lors de la mise à jour du devis:', error)
    throw error
  }

  return {
    ...data,
    agence_nom: data.agence?.nom || 'N/A'
  }
}

/**
 * Récupère tous les contrats fantômes
 */
export async function getContrats(filters?: {
  statut?: string
  etape_actuelle?: number
  agence_id?: number
}) {
  let query = supabase
    .from('contrats_fantomes')
    .select('*, agences(*)')
    .order('created_at', { ascending: false })

  if (filters?.statut) {
    query = query.eq('statut', filters.statut)
  }

  if (filters?.etape_actuelle) {
    query = query.eq('etape_actuelle', filters.etape_actuelle)
  }

  if (filters?.agence_id) {
    query = query.eq('agence_id', filters.agence_id)
  }

  const { data, error } = await query

  if (error) throw error
  return data as (ContratFantome & { agences: Agence | null })[]
}

/**
 * Récupère les statistiques du dashboard
 */
export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // Devis aujourd'hui
  const { count: devisAujourdhui } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .gte('date_reception', todayISO)

  // Devis J+2 en attente (reçus il y a 2 jours ou plus, pas encore relancés)
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  twoDaysAgo.setHours(23, 59, 59, 999)

  const { count: devisJ2 } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .eq('relance_j2_envoyee', false)
    .lte('date_reception', twoDaysAgo.toISOString())
    .neq('statut', 'converti')
    .neq('statut', 'perdu')

  // Email J+4 à envoyer (reçus il y a 4 jours ou plus, pas encore envoyés)
  const fourDaysAgo = new Date()
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
  fourDaysAgo.setHours(23, 59, 59, 999)

  const { count: emailsJ4 } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .eq('email_j4_envoye', false)
    .lte('date_reception', fourDaysAgo.toISOString())
    .neq('statut', 'converti')
    .neq('statut', 'perdu')

  // Taux de conversion (30 derniers jours)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: totalDevis } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .gte('date_reception', thirtyDaysAgo.toISOString())

  const { count: devisConvertis } = await supabase
    .from('devis')
    .select('*', { count: 'exact', head: true })
    .eq('converti', true)
    .gte('date_reception', thirtyDaysAgo.toISOString())

  const tauxConversion = totalDevis && totalDevis > 0
    ? Math.round((devisConvertis || 0) / totalDevis * 100)
    : 0

  // Contrats en cours
  const { count: contratsActifs } = await supabase
    .from('contrats_fantomes')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'en_cours')

  // Alertes non traitées
  const { count: alertesNonTraitees } = await supabase
    .from('alertes')
    .select('*', { count: 'exact', head: true })
    .eq('traitee', false)

  return {
    devisAujourdhui: devisAujourdhui || 0,
    devisJ2: devisJ2 || 0,
    emailsJ4: emailsJ4 || 0,
    tauxConversion,
    contratsActifs: contratsActifs || 0,
    alertesNonTraitees: alertesNonTraitees || 0,
  }
}

/**
 * Récupère les alertes non traitées
 */
export async function getAlertes(limit = 10) {
  const { data, error } = await supabase
    .from('alertes')
    .select('*')
    .eq('traitee', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Alerte[]
}

/**
 * Marque une alerte comme traitée
 */
export async function marquerAlerteTraitee(id: string) {
  const { data, error } = await supabase
    .from('alertes')
    .update({
      traitee: true,
      traitee_date: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Alerte
}