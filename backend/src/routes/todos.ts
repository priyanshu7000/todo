import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { authMiddleware, validationMiddleware } from '../middlewares/auth';
import { CreateTodoSchema, UpdateTodoSchema } from '../utils/validation';

const router = Router();
const todoController = new TodoController();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Create a new todo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created
 */
router.post('/', validationMiddleware(CreateTodoSchema), (req, res) =>
  todoController.createTodo(req, res)
);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get all todos for user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todos retrieved
 */
router.get('/', (req, res) => todoController.getTodos(req, res));

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get a specific todo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo retrieved
 */
router.get('/:id', (req, res) => todoController.getTodoById(req, res));

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     tags:
 *       - Todos
 *     summary: Update a todo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated
 */
router.put('/:id', validationMiddleware(UpdateTodoSchema), (req, res) =>
  todoController.updateTodo(req, res)
);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     tags:
 *       - Todos
 *     summary: Delete a todo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted
 */
router.delete('/:id', (req, res) => todoController.deleteTodo(req, res));

export default router;
