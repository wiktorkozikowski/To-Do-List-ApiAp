import { Request, Response } from 'express';
import taskListModel from '../models/taskListModel';
import { CreateTaskListDTO, UpdateTaskListDTO } from '../types/taskList';

/**
 * Controller TaskList - logika biznesowa dla list zadań
 */
class TaskListController {
  /**
   * GET /api/lists
   * Pobiera wszystkie listy zadań
   */
  getAllLists(req: Request, res: Response): void {
    try {
      const lists = taskListModel.getAllLists();
      
      // Dodaj licznik zadań dla każdej listy
      const listsWithCount = lists.map(list => ({
        ...list,
        taskCount: taskListModel.getTaskCount(list.id),
        completedCount: taskListModel.getCompletedTaskCount(list.id),
        cancelledCount: taskListModel.getCancelledTaskCount(list.id)
      }));

      res.status(200).json({
        success: true,
        data: listsWithCount,
        count: lists.length
      });
    } catch (error) {
      console.error('Błąd pobierania list:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas pobierania list'
      });
    }
  }

  /**
   * GET /api/lists/:id
   * Pobiera pojedynczą listę po ID
   */
  getListById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID listy'
        });
        return;
      }

      const list = taskListModel.getListById(id);

      if (!list) {
        res.status(404).json({
          success: false,
          error: 'Lista nie została znaleziona'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          ...list,
          taskCount: taskListModel.getTaskCount(list.id)
        }
      });
    } catch (error) {
      console.error('Błąd pobierania listy:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas pobierania listy'
      });
    }
  }

  /**
   * POST /api/lists
   * Tworzy nową listę zadań
   */
  createList(req: Request, res: Response): void {
    try {
      const { name, description } = req.body as CreateTaskListDTO;

      if (!name || name.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Nazwa listy jest wymagana'
        });
        return;
      }

      if (name.length > 100) {
        res.status(400).json({
          success: false,
          error: 'Nazwa listy nie może być dłuższa niż 100 znaków'
        });
        return;
      }

      const listData: CreateTaskListDTO = {
        name: name.trim(),
        description: description?.trim() || undefined
      };

      const newList = taskListModel.createList(listData);

      res.status(201).json({
        success: true,
        data: newList,
        message: 'Lista została utworzona'
      });
    } catch (error) {
      console.error('Błąd tworzenia listy:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas tworzenia listy'
      });
    }
  }

  /**
   * PUT /api/lists/:id
   * Aktualizuje istniejącą listę
   */
  updateList(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID listy'
        });
        return;
      }

      const { name, description } = req.body as UpdateTaskListDTO;

      if (name === undefined && description === undefined) {
        res.status(400).json({
          success: false,
          error: 'Należy podać przynajmniej jedno pole do aktualizacji'
        });
        return;
      }

      if (name !== undefined && name.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Nazwa nie może być pusta'
        });
        return;
      }

      if (name !== undefined && name.length > 100) {
        res.status(400).json({
          success: false,
          error: 'Nazwa nie może być dłuższa niż 100 znaków'
        });
        return;
      }

      const listData: UpdateTaskListDTO = {};
      if (name !== undefined) listData.name = name.trim();
      if (description !== undefined) listData.description = description.trim();

      const updatedList = taskListModel.updateList(id, listData);

      if (!updatedList) {
        res.status(404).json({
          success: false,
          error: 'Lista nie została znaleziona'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedList,
        message: 'Lista została zaktualizowana'
      });
    } catch (error) {
      console.error('Błąd aktualizacji listy:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas aktualizacji listy'
      });
    }
  }

  /**
   * DELETE /api/lists/:id
   * Usuwa listę (i wszystkie zadania w niej)
   */
  deleteList(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID listy'
        });
        return;
      }

      const deleted = taskListModel.deleteList(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Lista nie została znaleziona'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lista i wszystkie jej zadania zostały usunięte'
      });
    } catch (error) {
      console.error('Błąd usuwania listy:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas usuwania listy'
      });
    }
  }
}

export default new TaskListController();
