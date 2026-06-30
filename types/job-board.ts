export type JobBoardBusinessType = 'restaurant' | 'massage'

export interface JobBoardBusiness {
  id: string
  owner_id: string
  business_name: string
  business_type: JobBoardBusinessType
  contact_phone?: string | null
  line_id?: string | null
  suburb?: string | null
  state?: string | null
  is_verified: boolean
  created_at: string
}

export interface JobPosting {
  id: string
  business_id: string
  job_title: string
  description: string
  contact_info: string
  is_active: boolean
  created_at: string
}

export interface JobPostingWithBusiness extends JobPosting {
  businesses: JobBoardBusiness
}
