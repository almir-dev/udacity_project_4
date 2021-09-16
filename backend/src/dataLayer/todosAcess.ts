import * as AWS from 'aws-sdk'
import {AWSError} from 'aws-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {Todo} from "../../../../solution/Serverless-Todo-App/backend/src/models/Todo";
import {UpdateTodoRequest} from "../../../../solution/Serverless-Todo-App/backend/src/requests/UpdateTodoRequest";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
// TODO: Implement the dataLayer logic- DONE

class TodoAccessImpl {
    private readonly documentClient: DocumentClient = TodoAccessImpl.createDynamoDBClient();
    private readonly todoTable = process.env.TODOS_TABLE;
    // private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX;
    private readonly s3 = new XAWS.S3({signatureVersion: "v4"});
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET;
    private readonly urlExpiration = process.env.S3_URL_EXPIRATION;

    async getAllTodosForUser(userId: String): Promise<any> {
        const result = this.documentClient
            .query({
                TableName: this.todoTable,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            })
            .promise();

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

    async deleteTodo(todoId: String, userId: String): Promise<void> {
        const handleError = (error: AWSError) => {
            if (error) {
                throw new Error("Error " + error);
            }
        }

        this.documentClient.delete(
            {
                TableName: this.todoTable,
                Key: {
                    todoId,
                    userId,
                },
            }, handleError
        );
    }

    async getPresignedImageUrl(todoId: String, imageId: String, userId: String): Promise<string> {
        const handleError = (error: AWSError) => {
            if (error) {
                throw new Error("Error " + error);
            }
        }

        const attachmentUrl = await this.s3.getSignedUrl("putObject", {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: this.urlExpiration,
        });

        this.documentClient.update(
            {
                TableName: this.todoTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set attachmentUrl = :attachmentUrl",
                ExpressionAttributeValues: {
                    ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
                },
            }, handleError
        );
        return attachmentUrl;
    }

    private static createDynamoDBClient() {
        return new XAWS.DynamoDB.DocumentClient();
    }
}

export const TodoAccessService = new TodoAccessImpl();
