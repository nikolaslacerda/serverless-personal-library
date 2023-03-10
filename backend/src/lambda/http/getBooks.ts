import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getBooksForUser } from '../../businessLogic/books'
import { getUserId } from '../utils';
import { Book } from '../../models/Book'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event)
    const books: Book[] = await getBooksForUser(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: books
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
