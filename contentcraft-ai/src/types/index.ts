// ContentCraft AI Types

export interface Blog {
  id: string
  userId: string
  title: string
  topic: string
  tone: BlogTone
  style: BlogStyle
  length: BlogLength
  content: string
  outline: string[]
  status: BlogStatus
  heroImageUrl?: string
  heroImagePrompt?: string
  heroImageCaption?: string
  heroImageAlt?: string
  seoScore?: SEOScore
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  userId: string
  filename: string
  url: string
  publicId: string
  type: string
  size?: number
  width?: number
  height?: number
  createdAt: string
}

export interface UsageEvent {
  id: string
  userId: string
  eventType: 'ai_text' | 'ai_image' | 'export'
  quantity: number
  metadata: Record<string, any>
  createdAt: string
}

// Blog configuration types
export type BlogTone = 
  | 'professional' 
  | 'casual' 
  | 'friendly' 
  | 'authoritative' 
  | 'conversational'
  | 'humorous'
  | 'inspirational'

export type BlogStyle = 
  | 'informative' 
  | 'persuasive' 
  | 'narrative' 
  | 'how-to' 
  | 'listicle'
  | 'comparison'
  | 'review'

export type BlogLength = 
  | 'short' 
  | 'medium' 
  | 'long'

export type BlogStatus = 
  | 'draft' 
  | 'published' 
  | 'archived'

// SEO Score interface
export interface SEOScore {
  overall: number
  title: {
    score: number
    issues: string[]
  }
  content: {
    score: number
    issues: string[]
  }
  keywords: {
    score: number
    issues: string[]
  }
  readability: {
    score: number
    issues: string[]
  }
}

// AI Generation interfaces
export interface BlogGenerationRequest {
  topic: string
  tone: BlogTone
  style: BlogStyle
  length: BlogLength
  keywords?: string[]
  targetAudience?: string
  customInstructions?: string
}

export interface BlogOutline {
  title: string
  sections: {
    heading: string
    subheadings?: string[]
    keyPoints: string[]
  }[]
  estimatedWordCount: number
}

export interface ImageGenerationRequest {
  prompt: string
  style?: 'realistic' | 'artistic' | 'minimalist' | 'corporate'
  aspectRatio?: '16:9' | '1:1' | '4:3'
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// User preferences (stored in local storage or database)
export interface UserPreferences {
  defaultTone: BlogTone
  defaultStyle: BlogStyle
  defaultLength: BlogLength
  preferredKeywords: string[]
  autoSave: boolean
  darkMode: boolean
}