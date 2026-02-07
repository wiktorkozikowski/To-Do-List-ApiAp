import db from '../database/database';
import { User, UserRow } from '../types/user';

interface CreateUserData {
  email: string;
  login: string;
  password_hash: string;
}

class UserModel {
  getById(id: number): User | null {
    const sql = 'SELECT id, email, login, created_at FROM users WHERE id = ?';
    const row = db.prepare(sql).get(id) as User | undefined;
    return row || null;
  }

  getByEmail(email: string): UserRow | null {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const row = db.prepare(sql).get(email) as UserRow | undefined;
    return row || null;
  }

  getByLogin(login: string): UserRow | null {
    const sql = 'SELECT * FROM users WHERE login = ?';
    const row = db.prepare(sql).get(login) as UserRow | undefined;
    return row || null;
  }

  getByEmailOrLogin(identifier: string): UserRow | null {
    const sql = 'SELECT * FROM users WHERE email = ? OR login = ?';
    const row = db.prepare(sql).get(identifier, identifier) as UserRow | undefined;
    return row || null;
  }

  createUser(data: CreateUserData): User {
    const sql = `
      INSERT INTO users (email, login, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `;

    const createdAt = new Date().toISOString();
    const info = db.prepare(sql).run(
      data.email,
      data.login,
      data.password_hash,
      createdAt
    );

    const newUser = this.getById(info.lastInsertRowid as number);
    if (!newUser) {
      throw new Error('Create user error');
    }

    return newUser;
  }
}

export default new UserModel();
