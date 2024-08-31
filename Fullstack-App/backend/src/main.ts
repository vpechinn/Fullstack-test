import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getPgClient } from './dbClientFactory';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function migrateDb() {
  const client = getPgClient();

  await client.connect();

  await client.query(`
            create table if not exists users 
            (
                userId   uuid primary key,
                name     text not null unique,
                password text not null
            );
        
            
            create table if not exists auth_tokens 
            (
                tokenId  uuid primary key,
                userId   uuid not null REFERENCES users,
                token    text not null
            );

            create table if not exists deeds
            (
                deedId uuid primary key,
                userId uuid not null REFERENCES users,
                title text not null,
                description text not null
            );
            create table if not exists friends
            (
                userId1 uuid not null REFERENCES users,
                userId2 uuid not null REFERENCES users
            );`);
  await client.end();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Разрешить запросы с этого домена
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Если нужно передавать куки или авторизационные заголовки
  };

  app.enableCors(corsOptions);

  await app.listen(8081);
}

migrateDb().then(bootstrap);
