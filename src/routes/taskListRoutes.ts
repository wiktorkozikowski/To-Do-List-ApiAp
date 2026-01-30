import { Router } from 'express';
import taskListController from '../controllers/taskListController';

/**
 * Router dla endpointów /api/lists
 * Definiuje wszystkie endpointy REST API dla list zadań
 */
const router = Router();

/**
 * GET /api/lists
 * Pobiera wszystkie listy zadań
 */
router.get('/', taskListController.getAllLists.bind(taskListController));

/**
 * GET /api/lists/:id
 * Pobiera pojedynczą listę
 */
router.get('/:id', taskListController.getListById.bind(taskListController));

/**
 * POST /api/lists
 * Tworzy nową listę zadań
 */
router.post('/', taskListController.createList.bind(taskListController));

/**
 * PUT /api/lists/:id
 * Aktualizuje istniejącą listę
 */
router.put('/:id', taskListController.updateList.bind(taskListController));

/**
 * DELETE /api/lists/:id
 * Usuwa listę i wszystkie zadania w niej
 */
router.delete('/:id', taskListController.deleteList.bind(taskListController));

export default router;
