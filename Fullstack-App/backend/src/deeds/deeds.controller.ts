import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { DeedsService } from './deeds.service';
import { Deed } from '../../models/Deed';
import { AuthorizationService } from '../authorization/authorization.service';

@Controller('deeds')
export class DeedsController {
  constructor(
    private readonly deeds: DeedsService,
    private readonly auth: AuthorizationService,
  ) {}

  @Post()
  async postDeed(
    @Body() body: Deed,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let token = req.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');
    token = token.replace('Bearer ', '');
    const user = await this.auth.getUserByAuthToken(token);

    try {
      await this.deeds.createDeed({
        userId: user.userid,
        title: body.title,
        description: body.description,
      });
    } catch (error) {
      res.status(409).send();
      console.log(error)
      throw error;
    }
    res.status(201).send();
  }

  @Get()
  async getDeeds(@Req() req: Request, @Res() res: Response): Promise<void> {
    let token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('No token provided');

    token = token.replace('Bearer ', '');
    const user = await this.deeds.getUserByAuthToken(token);
    try {
      const deeds = await this.deeds.getDeedByUserId(user.userid);
      res.status(200).json(deeds).send();
    } catch (error) {
      res.status(404).send();
      throw error;
    }
  }

  @Put(':id')
  async putDeed(
    @Body() body: Deed,
    @Res() res: Response,
    @Param() params: { id: string },
  ): Promise<void> {
    body.deedId = params.id;

    try {
      await this.deeds.updateDeed(body);
    } catch (error) {
      res.status(404).send();
      throw error;
    }
    res.status(200).send();
  }

  @Delete(':id')
  async deleteDeed(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: { id: string },
  ): Promise<void> {
    let token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('No token provided');

    token = token.replace('Bearer ', '');

    const user = await this.deeds.getUserByAuthToken(token);
    if (user == null) throw new UnauthorizedException('Invalid token');

    await this.deeds.deleteDeed(params.id);

    res.status(200).send();
  }

  @Get(':friendId')
  async getFriendDeeds(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: { friendId: string },
  ): Promise<void> {
    let token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('No token provided');

    token = token.replace('Bearer ', '');
    const user = await this.deeds.getUserByAuthToken(token);
    try {
      const deeds = await this.deeds.getFriendDeeds(
        user.userid,
        param.friendId,
      );
      res.status(200).json(deeds);
    } catch (error) {
      res.status(404);
      throw error;
    }
  }

  @Post(':friendId')
  async addFriend(
    @Req() req: Request,
    @Res() res: Response,
    @Param('friendId') friendId: string,
  ): Promise<void> {

    let token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('No token provided');

    token = token.replace('Bearer ', '');
    const user = await this.deeds.getUserByAuthToken(token);

    if (user == null) throw new UnauthorizedException('Invalid token');

    try {

      await this.deeds.addFriend(user.userid, friendId);
      res.status(201).send({ message: 'Friend added successfully' });
    } catch (error) {
      res.status(400).send({ message: 'Failed to add friend' });
    }
  }

}
