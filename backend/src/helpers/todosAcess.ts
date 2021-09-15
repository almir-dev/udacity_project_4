import * as AWS from 'aws-sdk'
import {AWSError} from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'
import {Todo} from "../../../../solution/Serverless-Todo-App/backend/src/models/Todo";
import {UpdateTodoRequest} from "../../../../solution/Serverless-Todo-App/backend/src/requests/UpdateTodoRequest";

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

    async updateTodo(todoId: String, updatedTodo: UpdateTodoRequest, userId: String): Promise<void> {
        console.log("Updating todoId: ", todoId, " userId: ", userId);

        const handleError = (error: AWSError) => {
            if (error) {
                throw new Error("Error " + error);
            }
        }

        this.documentClient.update(
            {
                TableName: this.todoTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set #name = :n, #dueDate = :due, #done = :d",
                ExpressionAttributeValues: {
                    ":n": updatedTodo.name,
                    ":due": updatedTodo.dueDate,
                    ":d": updatedTodo.done,
                },
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#dueDate": "dueDate",
                    "#done": "done",
                },
            }, handleError
        );
    }

    private static createDynamoDBClient() {
        return new XAWS.DynamoDB.DocumentClient();
    }
}

export const TodoAccessService = new TodoAccessImpl();
