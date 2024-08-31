import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import {AuthRepo} from "../repos/auth-repo.service";
import { AppModule } from "../app.module";

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, AuthRepo ],
})
export class AuthorizationModule {}
