import db from '../database/database';
import { TaskList, CreateTaskListDTO, UpdateTaskListDTO, TaskListRow } from '../types/taskList';

/**
 * Model TaskList - warstwa dostępu do danych dla list zadań
 */
class TaskListModel {
  /**
   * Pobiera wszystkie listy zadań
   */
  getAllLists(userId: number): TaskList[] {
    const sql = 'SELECT * FROM task_lists WHERE user_id = ? ORDER BY created_at DESC';
    const rows = db.prepare(sql).all(userId) as TaskListRow[];
    return rows;
  }

  /**
   * Pobiera pojedynczą listę po ID
   */
  getListById(id: number, userId: number): TaskList | null {
    const sql = 'SELECT * FROM task_lists WHERE id = ? AND user_id = ?';
    const row = db.prepare(sql).get(id, userId) as TaskListRow | undefined;
    return row || null;
  }

  /**
   * Tworzy nową listę zadań
   */
  createList(listData: CreateTaskListDTO, userId: number): TaskList {
    const sql = `
      INSERT INTO task_lists (name, description, created_at, user_id)
      VALUES (?, ?, ?, ?)
    `;
    
    const createdAt = new Date().toISOString();
    const info = db.prepare(sql).run(
      listData.name,
      listData.description || null,
      createdAt,
      userId
    );

    const newList = this.getListById(info.lastInsertRowid as number, userId);
    if (!newList) {
      throw new Error('Błąd tworzenia listy');
    }

    return newList;
  }

  /**
   * Aktualizuje istniejącą listę
   */
  updateList(id: number, userId: number, listData: UpdateTaskListDTO): TaskList | null {
    const existingList = this.getListById(id, userId);
    if (!existingList) {
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (listData.name !== undefined) {
      updates.push('name = ?');
      values.push(listData.name);
    }

    if (listData.description !== undefined) {
      updates.push('description = ?');
      values.push(listData.description);
    }

    if (updates.length === 0) {
      return existingList;
    }

    values.push(id, userId);
    const sql = `UPDATE task_lists SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
    
    db.prepare(sql).run(...values);
    return this.getListById(id, userId);
  }

  /**
   * Usuwa listę 
   */
  deleteList(id: number, userId: number): boolean {
    const sql = 'DELETE FROM task_lists WHERE id = ? AND user_id = ?';
    const info = db.prepare(sql).run(id, userId);
    return info.changes > 0;
  }

  /**
   * Liczy zadania w liście
   */
  getTaskCount(listId: number): number {
    const sql = 'SELECT COUNT(*) as count FROM tasks WHERE list_id = ?';
    const result = db.prepare(sql).get(listId) as { count: number };
    return result.count;
  }

  /**
   * Liczy zakończone zadania w liście
   */
  getCompletedTaskCount(listId: number): number {
    const sql = 'SELECT COUNT(*) as count FROM tasks WHERE list_id = ? AND status = ?';
    const result = db.prepare(sql).get(listId, 'completed') as { count: number };
    return result.count;
  }

  /**
   * Liczy anulowane zadania w liście
   */
  getCancelledTaskCount(listId: number): number {
    const sql = 'SELECT COUNT(*) as count FROM tasks WHERE list_id = ? AND status = ?';
    const result = db.prepare(sql).get(listId, 'cancelled') as { count: number };
    return result.count;
  }
}

export default new TaskListModel();
