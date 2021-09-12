import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'
import {Todo} from "../../../../solution/Serverless-Todo-App/backend/src/models/Todo";

const XAWS = AWSXRay.captureAWS(AWS)

// @ts-ignore
const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

class TodoAccessImpl {
    private readonly documentClient: DocumentClient = TodoAccessImpl.createDynamoDBClient();
    private readonly todoTable = process.env.TODOS_TABLE;
    private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX;

    async getAllTodosForUser(userId: String): Promise<any> {
        const result = this.documentClient
            .query({
                TableName: this.todoTable,
                IndexName: this.createdAtIndex,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            }).promise();
        return result;
    }

    async createTodo(todo: Todo): Promise<Todo> {
        this.documentClient.put({
                TableName: this.todoTable,
                Item: todo,
            }).promise();

        return todo;
    }

    private static createDynamoDBClient() {
        return new XAWS.DynamoDB.DocumentClient();
    }
}

export const TodoAccessService = new TodoAccessImpl();
