import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AuthorizationModule} from './authorization/authorization.module';
import {AuthRepo} from "./repos/auth-repo.service";
import { DeedsModule } from './deeds/deeds.module';

@Module({
    imports: [AuthorizationModule, DeedsModule],
    providers: [AppService ,AuthRepo],
    exports: [AuthRepo]
})
export class AppModule {
}
