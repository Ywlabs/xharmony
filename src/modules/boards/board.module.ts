import { Module } from '@nestjs/common';

import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { CustomRepositoryModule } from 'nestjs-typeorm-custom-repository';

@Module({
  imports: [
    CustomRepositoryModule.forFeature([BoardRepository])
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
