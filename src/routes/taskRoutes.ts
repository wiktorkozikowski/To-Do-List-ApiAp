import { Router } from 'express';
import taskController from '../controllers/taskController';

/**
 * Router dla endpointów /api/tasks
 * Definiuje wszystkie endpointy REST API dla zadań
 */
const router = Router();

/**
 * GET /api/tasks
 * Pobiera wszystkie zadania
 */
router.get('/', taskController.getAllTasks.bind(taskController));

/**
 * GET /api/tasks/:id
 * Pobiera pojedyncze zadanie
 */
router.get('/:id', taskController.getTaskById.bind(taskController));

/**
 * POST /api/tasks
 * Tworzy nowe zadanie
 */
router.post('/', taskController.createTask.bind(taskController));

/**
 * PUT /api/tasks/:id
 * Aktualizuje istniejące zadanie
 */
router.put('/:id', taskController.updateTask.bind(taskController));

/**
 * DELETE /api/tasks/:id
 * Usuwa zadanie
 */
router.delete('/:id', taskController.deleteTask.bind(taskController));

/**
 * PATCH /api/tasks/:id/status
 * Zmienia status zadania (completed, cancelled, pending)
 */
router.patch('/:id/status', taskController.changeTaskStatus.bind(taskController));

export default router;
