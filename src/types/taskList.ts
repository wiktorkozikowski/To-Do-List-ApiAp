// Typy dla listy zadań (TaskList)
export interface TaskList {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

// Typ dla tworzenia nowej listy
export interface CreateTaskListDTO {
  name: string;
  description?: string;
}

// Typ dla aktualizacji listy
export interface UpdateTaskListDTO {
  name?: string;
  description?: string;
}

// Typ dla surowych danych z bazy
export interface TaskListRow {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}
