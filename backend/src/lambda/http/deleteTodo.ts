import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {
    decodeJWTFromAPIGatewayEvent,
    parseUserId
} from "../../../../../solution/Serverless-Todo-App/backend/src/auth/utils";
import {deleteTodo} from "../../helpers/todos";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        // TODO: Remove a TODO item by id - DONE

        const jwtToken = decodeJWTFromAPIGatewayEvent(event);
        const userId = parseUserId(jwtToken);

        await deleteTodo(todoId, userId);

        return {
            statusCode: 200,
            body: JSON.stringify({}),
        };
    }
)

handler.use(httpErrorHandler()).use(cors({credentials: true})).use(httpErrorHandler());
