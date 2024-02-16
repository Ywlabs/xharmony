import { EntityRepository } from 'nestjs-typeorm-custom-repository';
import { Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entities/board.entity';
import { classToPlain, instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {

    async findByBoardSeq(seq: number): Promise<Board> {
        const result = await this.createQueryBuilder('board')
          .where('board.seq = :seq', { seq: seq })
          .getOne();
        return result;
    }

    async findRawAll() : Promise<Board[]> {
        const result = await this.query("SELECT seq seq, title title , cont cont, create_date create_date , update_date update_date FROM board");
        return result;
    }
}

