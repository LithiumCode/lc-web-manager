export interface Campaign {
  id: string
  name: string 
  description: string
  startDate: Date
  endDate: Date 
  status: 'active' | 'inactive' | 'completed' 
  createdAt: Date 
  updatedAt: Date 
  createdBy: string 
  updatedBy?: string 
  imageURL?: string 
  targetAudience?: string 
  budget?: number 
  metrics?: {
    impressions: number 
    clicks: number 
    conversions: number 
  }
  tags?: string[] 
  notes?: string 
  isFeatured?: boolean 
  priority?: 'low' | 'medium' | 'high'
  externalLinks?: {}
}
