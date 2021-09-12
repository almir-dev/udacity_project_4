import {TodoAccessService} from "./todosAcess";

// TODO: Implement businessLogic

export function getTodosForUser(userId: string): Promise<any> {
    return TodoAccessService.getAllTodosForUser(userId);
}
