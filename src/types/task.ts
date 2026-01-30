// Typy dla zadania (Task)
export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export interface Task {
  id: number;
  list_id: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  estimated_time: number | null;
  created_at: string;
}

// Typ dla tworzenia nowego zadania (bez id i created_at)
export interface CreateTaskDTO {
  list_id?: number;
  title: string;
  description?: string;
  deadline?: string;
  estimated_time?: number | null;
}

// Typ dla aktualizacji zadania (wszystkie pola opcjonalne)
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  deadline?: string | null;
  estimated_time?: number | null;
}

// Typ dla surowych danych z bazy
export interface TaskRow {
  id: number;
  list_id: number | null;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  estimated_time: number | null;
  created_at: string;
}
