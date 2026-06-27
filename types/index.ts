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
  abn_number: string
  is_verified: boolean
  verified_at?: string
  verification_status: 'pending' | 'approved' | 'rejected'
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
  category: string
  reported_by: string
  created_at: string
}
