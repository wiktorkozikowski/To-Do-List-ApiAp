import { Request, Response } from 'express';
import taskModel from '../models/taskModel';
import { CreateTaskDTO, UpdateTaskDTO } from '../types/task';

class TaskController {
  getAllTasks(req: Request, res: Response): void {
    try {
      const listId = req.query.list_id ? parseInt(req.query.list_id as string) : undefined;

      if (listId !== undefined && isNaN(listId)) {
        res.status(400).json({ success: false, error: 'Invalid list ID' });
        return;
      }

      const tasks = taskModel.getAllTasks(listId);
      res.json({ success: true, data: tasks, count: tasks.length });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  getTaskById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ success: false, error: 'Invalid ID' });
        return;
      }

      const task = taskModel.getTaskById(id);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  createTask(req: Request, res: Response): void {
    try {
      const { title, description, list_id, deadline, estimated_time } = req.body as CreateTaskDTO;

      if (!title || title.trim() === '') {
        res.status(400).json({ success: false, error: 'Title required' });
        return;
      }

      if (title.length > 200) {
        res.status(400).json({ success: false, error: 'Title too long' });
        return;
      }

      const taskData: CreateTaskDTO = {
        title: title.trim(),
        description: description?.trim() || undefined,
        list_id: list_id || undefined,
        deadline: deadline?.trim() || undefined,
        estimated_time: estimated_time ?? undefined
      };

      const newTask = taskModel.createTask(taskData);
      res.status(201).json({ success: true, data: newTask });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  /**
   * PUT /api/tasks/:id
   * Aktualizuje istniejące zadanie
   */
  updateTask(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      // Walidacja ID
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID zadania'
        });
        return;
      }

      const { title, description, status } = req.body as UpdateTaskDTO;

      // Walidacja - przynajmniej jedno pole musi być podane
      if (title === undefined && description === undefined && status === undefined) {
        res.status(400).json({
          success: false,
          error: 'Należy podać przynajmniej jedno pole do aktualizacji'
        });
        return;
      }

      // Walidacja tytułu jeśli jest podany
      if (title !== undefined && title.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Tytuł nie może być pusty'
        });
        return;
      }

      if (title !== undefined && title.length > 200) {
        res.status(400).json({
          success: false,
          error: 'Tytuł nie może być dłuższy niż 200 znaków'
        });
        return;
      }

      const taskData: UpdateTaskDTO = {};
      if (title !== undefined) taskData.title = title.trim();
      if (description !== undefined) taskData.description = description.trim();
      if (status !== undefined) taskData.status = status;

      const updatedTask = taskModel.updateTask(id, taskData);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Zadanie nie zostało znalezione'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Zadanie zostało zaktualizowane'
      });
    } catch (error) {
      console.error('Błąd aktualizacji zadania:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas aktualizacji zadania'
      });
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Usuwa zadanie
   */
  deleteTask(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      // Walidacja ID
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID zadania'
        });
        return;
      }

      const success = taskModel.deleteTask(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Zadanie nie zostało znalezione'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Zadanie zostało usunięte'
      });
    } catch (error) {
      console.error('Błąd usuwania zadania:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas usuwania zadania'
      });
    }
  }

  /**
   * PATCH /api/tasks/:id/status
   * Zmienia status zadania
   */
  changeTaskStatus(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      // Walidacja ID
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe ID zadania'
        });
        return;
      }

      // Walidacja statusu
      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Status musi być: pending, completed lub cancelled'
        });
        return;
      }

      const updatedTask = taskModel.updateTaskStatus(id, status);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Zadanie nie zostało znalezione'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Status zadania został zmieniony'
      });
    } catch (error) {
      console.error('Błąd zmiany statusu zadania:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd serwera podczas zmiany statusu zadania'
      });
    }
  }
}

// Eksport pojedynczej instancji
export default new TaskController();
