export interface User {
  id: number;
  email: string;
  login: string;
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  login: string;
  password: string;
}

export interface UserRow extends User {
  password_hash: string;
}
