import { Injectable, Scope } from '@nestjs/common';
import { Client } from 'pg';
import { User } from '../../models/User';
import { AuthToken } from '../../models/AuthToken';
import { getPgClient } from "../dbClientFactory";

@Injectable({ scope: Scope.DEFAULT })
export class AuthRepo {
  private client: Client;

  constructor() {
    this.client = getPgClient();

    this.client
      .connect()
      .catch((err) => console.error('Connection error', err.stack));
  }

  async createUser({ name, password }: { name: string; password: string }) {
    await this.client.query(
      `INSERT INTO users VALUES (gen_random_uuid(), $1, $2)`,
      [name, password],
    );
  }

  async getUser({
    name,
    password,
  }: {
    password: string;
    name: string;
  }): Promise<User | null> {
    const found = await this.client.query(
      `SELECT * FROM users WHERE name = $1 AND password = $2 LIMIT 1`,
      [name, password],
    );

    if (found.rowCount == 1) return found.rows[0];

    return null;
  }

  async createToken(user: User): Promise<AuthToken> {
    const token = AuthRepo.genToken();
    const result = await this.client.query(
      `
            INSERT INTO auth_tokens 
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING tokenId,userId,token `,
      [user.userid, token],
    );

    return result.rows[0];
  }

  async getUserByToken(token: string) {
    const found = await this.client.query(
      `
            SELECT t.userid, u.name, u.password 
            FROM auth_tokens as t 
            LEFT JOIN users as u 
            ON t.userid = u.userid 
            WHERE token= $1`,
      [token],
    );

    if (found.rowCount == 1) return found.rows[0];

    return null;
  }

  async updateUser(user: User) {
    await this.client.query(
      `
            UPDATE users 
            SET name = $1, password = $2
            WHERE userid= $3`,
      [user.name, user.password, user.userid],
    );
  }

  async deleteUser(userid: string) {
    await this.client.query(`
           DELETE FROM auth_tokens WHERE userId = $1;
    `,[userid]
    );
    await this.client.query(`
           DELETE FROM deeds WHERE userId = $1;
    `,[userid]
    );
    await this.client.query(
      `
            DELETE FROM users WHERE userid= $1`,
      [userid],
    );
  }
  private static genToken() {
    return require('crypto').randomBytes(16).toString('hex');
  }

}
