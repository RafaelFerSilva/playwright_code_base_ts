import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';

export interface User {
  id: number;
  username: string;
  email: string;
}

export class UserRepository {
  constructor(private dbAdapter: IDatabaseAdapter) {}

  async getUserById(id: number): Promise<User | null> {
    const rows = await this.dbAdapter.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async insertUser(username: string, email: string): Promise<void> {
    this.dbAdapter.execute('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
  }

  async updateUserEmail(id: number, newEmail: string): Promise<void> {
    this.dbAdapter.execute('UPDATE users SET email = ? WHERE id = ?', [newEmail, id]);
  }

  async deleteUser(id: number): Promise<void> {
    this.dbAdapter.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}
