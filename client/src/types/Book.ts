export interface Book {
  bookId: string
  createdAt: string
  name: string
  author: string
  favorite: boolean
  totalPages: number
  currentPage: number
  coverImageUrl?: string
}
