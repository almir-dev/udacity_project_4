import {TodoAccessService} from "./todosAcess";
import {CreateTodoRequest} from "../../../../solution/Serverless-Todo-App/backend/src/requests/CreateTodoRequest";
import {Todo} from "../../../../solution/Serverless-Todo-App/backend/src/models/Todo";

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
