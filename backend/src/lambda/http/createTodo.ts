import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import * as uuid from "uuid";
import {CreateTodoRequest} from '../../requests/CreateTodoRequest'

import {createTodo} from "../../helpers/todos";
import {decodeJWTFromAPIGatewayEvent, parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";
const logger = createLogger("todo");

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Implement creating a new TODO item - DONE
        const todoRequest: CreateTodoRequest = JSON.parse(event.body);

        const todoId = uuid.v4();
        const jwtToken = decodeJWTFromAPIGatewayEvent(event);
        const userId = parseUserId(jwtToken);

        const content = await createTodo(todoId, todoRequest, userId);

        logger.info("Successfully created TODO item", {
            key: todoId,
            userId: userId,
            date: new Date().toISOString,
        });

        return {
            statusCode: 201,
            body: JSON.stringify({item: content}),
        };
    }
)

handler.use(cors({credentials: true})).use(httpErrorHandler());
