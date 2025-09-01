import { MySQLAdapter } from '@adapters/MySQLAdapter';

export interface User {
  id: number;
  username: string;
  email: string;
}

export class UserRepository {
  constructor(private dbAdapter: MySQLAdapter) {}

  async getUserById(id: number): Promise<User | null> {
    const rows = await this.dbAdapter.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async insertUser(username: string, email: string): Promise<void> {
    await this.dbAdapter.execute('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
  }

  async updateUserEmail(id: number, newEmail: string): Promise<void> {
    await this.dbAdapter.execute('UPDATE users SET email = ? WHERE id = ?', [newEmail, id]);
  }

  async deleteUser(id: number): Promise<void> {
    await this.dbAdapter.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}
