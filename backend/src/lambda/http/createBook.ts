import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { getUserId } from '../utils';
import { createBook } from '../../businessLogic/books'
import { Book } from '../../models/Book'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookToCreate: CreateBookRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)
    const createdBook: Book = await createBook(bookToCreate, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createdBook
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
