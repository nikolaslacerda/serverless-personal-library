import { BooksAccess } from '../dataLayer/booksAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { Book } from '../models/Book'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { BookUpdate } from '../models/BookUpdate';

const logger = createLogger('BooksAccess')
const attachmentUtils = new AttachmentUtils()
const booksAccess = new BooksAccess()

export async function createBook(newBook: CreateBookRequest, userId: string): Promise<Book> {
    logger.info('Create book called for user', userId)
    const bookId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(bookId)
    const bookToCreate = {
        bookId,
        userId,
        createdAt,
        favorite: false,
        coverImageUrl: s3AttachmentUrl,
        ...newBook
    }
    return await booksAccess.createBook(bookToCreate)
}

export async function getBooksForUser(userId: string): Promise<Book[]> {
    logger.info('Get user book called for user', userId)
    return await booksAccess.getAllBooks(userId)
}

export async function getBooksForUserByBookId(userId: string, bookId: string): Promise<Book> {
    logger.info('Get user book by id called for user', userId)
    return await booksAccess.getBookById(userId, bookId)
}

export async function updateBook(userId: string, bookId: string, bookUpdate: UpdateBookRequest): Promise<BookUpdate> {
    logger.info('Update book called for user', userId)
    return booksAccess.updateBook(bookId, userId, bookUpdate)
}

export async function deleteBook(userId: string, bookId: string): Promise<string> {
    logger.info('Delete book called for user', userId)
    return booksAccess.deleteBook(bookId, userId)
}

export async function createAttachmentPresignedUrl(userId: string, bookId: string): Promise<string> {
    logger.info('Create presigned URL function called for user', userId)
    return attachmentUtils.getUploadUrl(bookId)
}