import { Response } from 'express';
import { CustomRequest, AppError } from '../utils/errors';
import { ApiResponseUtil } from '../utils/response';
import { TodoService } from '../services/todo.service';
import { CreateTodoInput, UpdateTodoInput } from '../utils/validation';

export class TodoController {
  private todoService = new TodoService();

  async createTodo(req: any, res: Response) {
    try {
      const userId = req.userId;
      const { title, description, dueDate } = req.validatedBody as CreateTodoInput;

      const todo = await this.todoService.createTodo(userId, title, description, dueDate);
      res.status(201).json(ApiResponseUtil.success('Todo created', todo));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }

  async getTodos(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId!;
      const todos = await this.todoService.getTodos(userId);
      res.status(200).json(ApiResponseUtil.success('Todos retrieved', todos));
    } catch (error) {
      res.status(500).json(ApiResponseUtil.error('Internal server error'));
    }
  }

  async getTodoById(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const todo = await this.todoService.getTodoById(id, userId);
      res.status(200).json(ApiResponseUtil.success('Todo retrieved', todo));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }

  async updateTodo(req: any, res: Response) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { title, description, status, dueDate } = req.validatedBody as UpdateTodoInput;

      const todo = await this.todoService.updateTodo(
        id,
        userId,
        title,
        description,
        status,
        dueDate
      );
      res.status(200).json(ApiResponseUtil.success('Todo updated', todo));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }

  async deleteTodo(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await this.todoService.deleteTodo(id, userId);
      res.status(200).json(ApiResponseUtil.success('Todo deleted'));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }
}
