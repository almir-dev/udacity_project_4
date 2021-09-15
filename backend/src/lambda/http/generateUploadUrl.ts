import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import * as uuid from "uuid";
import {cors, httpErrorHandler} from 'middy/middlewares'
import {decodeJWTFromAPIGatewayEvent, parseUserId} from "../../auth/utils";
import {getPresignedImageUrl} from "../../helpers/todos";


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id - DONE

        const jwtToken = decodeJWTFromAPIGatewayEvent(event);
        const userId = parseUserId(jwtToken);

        const imageId = uuid.v4();

        const signedUrl: String = await getPresignedImageUrl(
            todoId,
            imageId,
            userId
        );

        return {
            statusCode: 201,
            body: JSON.stringify({uploadUrl: signedUrl}),
        };
    }
)

handler.use(cors({credentials: true})).use(httpErrorHandler());
