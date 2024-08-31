import { Module } from '@nestjs/common';
import { DeedsController } from './deeds.controller';
import { DeedsService } from './deeds.service';
import { AuthorizationService } from "../authorization/authorization.service";
import { AuthRepo } from "../repos/auth-repo.service";
import { AppModule } from "../app.module";
import { DeedsRepo } from "../repos/deeds-repo.service";

@Module({
  controllers: [DeedsController],
  providers: [DeedsService,AuthorizationService,AuthRepo,DeedsRepo],
})
export class DeedsModule {}
