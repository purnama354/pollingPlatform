export interface Option {
  id?: number
  text: string
  votes: number
}

export interface Poll {
  id?: number
  title: string
  description: string
  endDate: string
  options: {
    text: string
    votes: number
  }[]
  createdAt?: string
  updatedAt?: string
}

export interface PollingListResponse {
  polls: Poll[]
  pagination: {
    current_page: number
    per_page: number
    total_items: number
    total_pages: number
  }
}
