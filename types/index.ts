export type UserRole = 'guest' | 'member' | 'verified_business' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  line_id?: string
  role: UserRole
  created_at: string
}

export type ServiceCategory =
  | 'accommodation'
  | 'jobs'
  | 'visa'
  | 'restaurant'
  | 'massage'
  | 'transport'
  | 'tradesperson'
  | 'photography'
  | 'other'

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export interface ServiceProvider {
  id: string
  profile_id: string
  business_name: string
  category: ServiceCategory
  description: string
  address: string
  suburb: string
  state: AustralianState
  phone?: string
  line_id?: string
  website?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  whatsapp?: string
  portfolio_url?: string
  youtube_url?: string
  cover_image_url?: string
  gallery_images?: string[]
  abn_number: string
  is_verified: boolean
  verified_at?: string
  verification_status: 'pending' | 'approved' | 'rejected'
  subscription_status: 'free' | 'premium'
  subscription_grace_until?: string
  terms_accepted?: boolean
  terms_accepted_at?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  rating: number
  review_count: number
  created_at: string
}

export interface Review {
  id: string
  provider_id: string
  reviewer_id: string
  reviewer_name: string
  rating: number
  comment: string
  created_at: string
}

export interface ScamAlert {
  id: string
  title: string
  description: string
  category?: string
  alert_type?: string
  severity?: string
  evidence_url?: string
  state?: string
  is_published?: boolean
  created_at: string
}

export type KycDocumentType =
  | 'abn_certificate'
  | 'id_document'
  | 'business_license'
  | 'insurance'

export interface KycDocument {
  id: string
  provider_id: string
  document_type: KycDocumentType
  file_url: string
  status: 'pending' | 'approved' | 'rejected'
  uploaded_at: string
}
