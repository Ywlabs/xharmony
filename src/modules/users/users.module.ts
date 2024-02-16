import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CustomUsersRepository } from './users.repository';
import { CustomRepositoryModule } from 'nestjs-typeorm-custom-repository';

@Module({
  imports: [
    CustomRepositoryModule.forFeature([CustomUsersRepository])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
