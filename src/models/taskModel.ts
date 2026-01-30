import db from '../database/database';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskRow, TaskStatus } from '../types/task';

class TaskModel {
  getAllTasks(listId?: number): Task[] {
    let sql = 'SELECT * FROM tasks';
    const params: any[] = [];

    if (listId !== undefined) {
      sql += ' WHERE list_id = ?';
      params.push(listId);
    }

    sql += ' ORDER BY created_at DESC';
    const rows = db.prepare(sql).all(...params) as TaskRow[];
    return rows as Task[];
  }

  getTaskById(id: number): Task | null {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const row = db.prepare(sql).get(id) as TaskRow | undefined;
    return row ? (row as Task) : null;
  }

  createTask(taskData: CreateTaskDTO): Task {
    const sql = `
      INSERT INTO tasks (list_id, title, description, status, deadline, estimated_time, created_at)
      VALUES (?, ?, ?, 'pending', ?, ?, ?)
    `;
    
    const createdAt = new Date().toISOString();
    const info = db.prepare(sql).run(
      taskData.list_id || null,
      taskData.title,
      taskData.description || null,
      taskData.deadline || null,
      taskData.estimated_time ?? null,
      createdAt
    );

    const newTask = this.getTaskById(info.lastInsertRowid as number);
    if (!newTask) throw new Error('Create error');

    return newTask;
  }

  updateTask(id: number, taskData: UpdateTaskDTO): Task | null {
    const existingTask = this.getTaskById(id);
    if (!existingTask) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (taskData.title !== undefined) {
      updates.push('title = ?');
      values.push(taskData.title);
    }
    if (taskData.description !== undefined) {
      updates.push('description = ?');
      values.push(taskData.description);
    }
    if (taskData.status !== undefined) {
      updates.push('status = ?');
      values.push(taskData.status);
    }
    if (taskData.deadline !== undefined) {
      updates.push('deadline = ?');
      values.push(taskData.deadline);
    }

    if (taskData.estimated_time !== undefined) {
      updates.push('estimated_time = ?');
      values.push(taskData.estimated_time);
    }

    // Jeśli nie ma żadnych zmian, zwróć obecne zadanie
    if (updates.length === 0) return existingTask;

    values.push(id);
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return this.getTaskById(id);
  }

  deleteTask(id: number): boolean {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
  }

  updateTaskStatus(id: number, status: TaskStatus): Task | null {
    return this.updateTask(id, { status });
  }
}

export default new TaskModel();
