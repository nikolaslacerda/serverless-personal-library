export interface Book {
  bookId: string
  userId: string
  name: string
  createdAt: string
  author: string
  totalPages: number
  currentPage: number
  favorite: boolean
  coverImageUrl?: string
}
