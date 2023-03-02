import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Book } from '../models/Book'
import { BookUpdate } from '../models/BookUpdate';

var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('BooksAccess')

export class BooksAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly booksTable = process.env.BOOKS_TABLE
    ) {}

    async createBook(book: Book): Promise<Book> {
        logger.info('Create book item access initiate')
        const bookCreated = await this.docClient.put({
            TableName: this.booksTable,
            Item: book
        }).promise()
        logger.info('Book created: ', bookCreated)
        return book
    }

    async getAllBooks(userId: string): Promise<Book[]> {
        logger.info('Get all books initiate')
        const result = await this.docClient.query({
            TableName: this.booksTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        const items = result.Items
        logger.info('Get all books successfully')
        return items as Book[]
    }

    async getBookById(userId: string, bookId: string): Promise<Book> {
        logger.info('Get book by id initiate')
        const result = await this.docClient.query({
            TableName: this.booksTable,
            KeyConditionExpression: 'userId = :userId and bookId = :bookId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':bookId': bookId
            }
        }).promise()
        const items = result.Items as Book[]
        logger.info('Get book by id  successfully')
        return items[0]
    }

    async updateBook(bookId: string, userId: string, bookUpdate: BookUpdate): Promise<BookUpdate> {
        logger.info('Update book initiate')
        const bookUpdated = await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                bookId,
                userId
            }, 
            UpdateExpression: 'set #name = :name, author = :author, totalPages = :totalPages, currentPage = :currentPage, favorite = :favorite',
            ExpressionAttributeValues: {
                ':name': bookUpdate.name,
                ':author': bookUpdate.author,
                ':totalPages': bookUpdate.totalPages,
                ':currentPage': bookUpdate.currentPage,
                ':favorite': bookUpdate.favorite,
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        const BookItemUpdate = bookUpdated.Attributes
        logger.info('Book updated', bookId)
        return BookItemUpdate as BookUpdate
    }

    async updateBookAttachmentUrl(bookId: string, userId: string, attachmentUrl: string): Promise<void> {
        logger.info('Update book attachment url access initiate')
        await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                bookId,
                userId
            }, 
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise()
        logger.info('Book attachment url updated: ', bookId)
    }

    async deleteBook(bookId: string, userId: string): Promise<string> {
        logger.info('Delete book access initiate')
        await this.docClient.delete({
            TableName: this.booksTable,
            Key: {
                bookId,
                userId
            }
        }).promise()
        logger.info('Book deleted: ', bookId)
        return bookId as string
    }
}