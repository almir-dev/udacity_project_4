import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {getTodosForUser} from "../../helpers/todos";
import {decodeJWTFromAPIGatewayEvent, parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";

const logger = createLogger("todo");

// TODO: Get all TODO items for a current user - DONE
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const jwtToken = decodeJWTFromAPIGatewayEvent(event);
        const userId = parseUserId(jwtToken);

        const result = await getTodosForUser(userId);

        const statusCode = result.count !== 0 ? 200 : 404;
        const content = result.count !== 0 ? {items: result.Items} : 'No todos found';

        logger.info("Successfully retrieved TODO items", {
            userId: userId,
            date: new Date().toISOString,
        });

        return {
            statusCode,
            body: JSON.stringify(content),
        };
    });

handler.use(cors({credentials: true})).use(httpErrorHandler());
