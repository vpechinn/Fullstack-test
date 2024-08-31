import { Injectable } from '@nestjs/common';
import { AuthRepo } from '../repos/auth-repo.service';
import { AuthToken } from '../../models/AuthToken';
import { User } from '../../models/User';

@Injectable()
export class AuthorizationService {
  constructor(private readonly repo: AuthRepo) {}

  async createUser({ name, password }: { name: string; password: string }) {
    await this.repo.createUser({ name, password });
  }

  async signIn({
    name,
    password,
  }: {
    password: string;
    name: string;
  }): Promise<AuthToken | null> {
    const user = await this.repo.getUser({ name, password });

    if (user === null) return null;

    return await this.repo.createToken(user);
  }

  async getUserByAuthToken(token: any) {
    return await this.repo.getUserByToken(token);
  }

  async updateUser(user: User) {
    return await this.repo.updateUser(user);
  }

  async deleteUser(userid: string) {
    return await this.repo.deleteUser(userid);
  }
}
