import {TodoAccessService} from "../dataLayer/todosAcess";
import {CreateTodoRequest} from "../../../../solution/Serverless-Todo-App/backend/src/requests/CreateTodoRequest";
import {Todo} from "../../../../solution/Serverless-Todo-App/backend/src/models/Todo";
import {UpdateTodoRequest} from "../../../../solution/Serverless-Todo-App/backend/src/requests/UpdateTodoRequest";

// TODO: Implement businessLogic

export async function getTodosForUser(userId: string): Promise<any> {
    return TodoAccessService.getAllTodosForUser(userId);
}

export async function createTodo(todoId: String, createTodoRequest: CreateTodoRequest, userId: string): Promise<Todo> {
    const todo = TodoAccessService.createTodo({
        userId: userId,
        todoId: todoId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: undefined,
    } as Todo);

    return todo;
}

export async function updateTodo(
    todoId: String,
    updatedTodo: UpdateTodoRequest,
    userId: String
): Promise<void> {
    TodoAccessService.updateTodo(todoId, updatedTodo, userId);
}

export async function deleteTodo(
    todoId: String,
    userId: String
): Promise<void> {
    TodoAccessService.deleteTodo(todoId, userId);
}

export async function getPresignedImageUrl(
    todoId: String,
    imageId: String,
    userId: String
): Promise<string> {
    return TodoAccessService.getPresignedImageUrl(todoId, imageId, userId);
}
