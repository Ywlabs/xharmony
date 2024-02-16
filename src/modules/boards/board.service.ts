import { HttpException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { Board } from './entities/board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { PaginationResponse } from 'src/common/pagination/pagination.response';
import { PaginationBuilder } from 'src/common/pagination/paginationBuilder.response';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(
    private readonly dao: BoardRepository,
  ){}
  
  async create(dto: CreateBoardDto) : Promise<Board> {         
    const board = plainToInstance(Board, instanceToPlain(dto));
    return this.dao.save(board);
  }

  //SEQ기반으로 게시물 찿기
  async read(seq: number): Promise<Board> {
    return this.dao.findByBoardSeq(seq);
  }
  //전체검색 
  async list(page: PaginationRequest): Promise<PaginationResponse<any>> {
    const [data, count] = await this.dao.findAndCount({
      skip: page.getSkip(),
      take: page.getTake(),
    });
    return new PaginationBuilder()
      .setData(data)
      .setPage(page.page)
      .setTake(page.take)
      .setSearch(page.search)
      .setTotalCount(count)
      .build();
  }

  async listQuery() : Promise<Board[]> {
    this.logger.debug("Call findRawAll")
    return this.dao.findRawAll();
  }
}
