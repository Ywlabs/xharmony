import { Controller, Post, Body, Get, UseFilters, ParseIntPipe, UseGuards, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { GetPagination } from 'src/common/decorator/pagination.decorator';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { AccessGuard } from '../../common/guard/access.guard';

@Controller({ path: "board", version: "1" })
@UseGuards(AccessGuard)
export class BoardController {
  constructor(
    private readonly BoardService: BoardService
  ) {}

  @Post()
  async create(@Body() dto: CreateBoardDto) {
    return this.BoardService.create(dto);
  }

  @Get()
	async list(@GetPagination() pagenation: PaginationRequest) {
		return this.BoardService.list(pagenation);
	}

  @Get('read')
  async read(@Body('seq', ParseIntPipe) seq : number) {
    return this.BoardService.read(seq);
  }

  @Get('query')
	async listQuery(): Promise<Board[]> {
    return this.BoardService.listQuery();    
	}

  @Version(["2", VERSION_NEUTRAL])
  @Get()
  getHelloV2(): string {
    return "Hello Version 2!";
  }
}