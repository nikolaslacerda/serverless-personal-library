import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getBooksForUserByBookId } from '../../businessLogic/books'
import { getUserId } from '../utils';
import { Book } from '../../models/Book'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId: string = event.pathParameters.bookId
    const userId: string = getUserId(event)
    const book: Book = await getBooksForUserByBookId(userId, bookId)
    if (book) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          book: book
        })
      }
    } else {
      return {
        statusCode: 404,
        body: ''
      }
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
