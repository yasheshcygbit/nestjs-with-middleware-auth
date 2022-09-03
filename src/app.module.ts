import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { UserEntity } from './users/user.entity';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(<string>process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [UserEntity],
      synchronize: true
    }),
    UsersModule,
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/users/login', method: RequestMethod.POST },
        { path: '/users/register', method: RequestMethod.POST },
        { path: '/users/getAccessToken', method: RequestMethod.POST }
      )
      .forRoutes(
        'users'
      )
  }
}
