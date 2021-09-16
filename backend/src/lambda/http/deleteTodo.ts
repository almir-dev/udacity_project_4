import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {deleteTodo} from "../../businessLogic/todos";
import {decodeJWTFromAPIGatewayEvent, parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";
const logger = createLogger("todo");

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        // TODO: Remove a TODO item by id - DONE

        const jwtToken = decodeJWTFromAPIGatewayEvent(event);
        const userId = parseUserId(jwtToken);

        await deleteTodo(todoId, userId);

        logger.info("Successfully deleted TODO item", {
            key: todoId,
            userId: userId,
            date: new Date().toISOString,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({}),
        };
    }
)

handler.use(httpErrorHandler()).use(cors({credentials: true})).use(httpErrorHandler());
