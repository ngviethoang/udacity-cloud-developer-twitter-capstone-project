import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../businessLogic/tweets'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('tweets')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const tweetId = event.pathParameters.tweetId
    // /TODO: Return a presigned URL to upload a file for a Tweet item with the provided id
    const userId = getUserId(event)
    logger.info(`user ${userId} create attachment url for tweet ${tweetId}`)
    const uploadUrl = await createAttachmentPresignedUrl(userId, tweetId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
