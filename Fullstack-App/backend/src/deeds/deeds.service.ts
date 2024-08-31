import { Injectable } from '@nestjs/common';
import { AuthRepo } from 'src/repos/auth-repo.service';
import { Deed } from '../../models/Deed';
import { DeedsRepo } from '../repos/deeds-repo.service';

@Injectable()
export class DeedsService {
  constructor(
    private readonly repo: DeedsRepo,
    private readonly authRepo: AuthRepo,
  ) {}

  async createDeed({
    title,
    description,
    userId,
  }: {
    title: string;
    description: string;
    userId: string;
  }) {
    await this.repo.createDeed({ title, description, userId });
  }

  async getDeedByUserId(userId: string): Promise<Deed[]> {
    return await this.repo.listDeedsOfUser(userId);
  }

  async updateDeed(deed: Deed) {
    await this.repo.updateDeed(deed);
  }

  async deleteDeed(deedId: string) {
    await this.repo.deleteDeed(deedId);
  }

  async getUserByAuthToken(token: any) {
    return await this.authRepo.getUserByToken(token);
  }

  async getFriendDeeds(userId: string, friendId: string) {
    return await this.repo.getFriendDeeds(userId, friendId);
  }

  async isFriend(userId: string, friendUserId: string): Promise<boolean> {
    return await this.repo.isFriend(userId, friendUserId);
  }

  async addFriend(userId: string, friendId: string): Promise<void> {
    const isAlreadyFriend = await this.isFriend(userId, friendId);
    if (isAlreadyFriend) {
      throw new Error('Users are already friends');
    }

    await this.repo.addFriend(userId, friendId);
  }
}
