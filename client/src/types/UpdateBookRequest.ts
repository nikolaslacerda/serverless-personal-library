export interface UpdateBookRequest {
  name: string
  author: string
  totalPages: number
  currentPage: number
  favorite: boolean
}