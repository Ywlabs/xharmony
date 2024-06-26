import { ApiProperty } from '@nestjs/swagger';
import { PaginationBuilder } from './paginationBuilder.response';

export class PaginationResponse<T> {
  data: T[];

  @ApiProperty({
    example: {
      page: 1,
      take: 10,
      totalCount: 100,
      totalPage: 10,
      hasNextPage: true,
      search : {type:'',text:''}
    },
    description: 'ywlabs Pagging response',
  })
  meta: {
    page: number;
    take: number;
    totalCount: number;
    totalPage: number;
    hasNextPage: boolean;
    search : object;
  };

  constructor(pagenationBuilder: PaginationBuilder<T>) {
    this.data = pagenationBuilder._data;
    this.meta = {
      page: pagenationBuilder._page,
      take: pagenationBuilder._take,
      totalCount: pagenationBuilder._totalCount,
      totalPage: this.getTotalPage(
        pagenationBuilder._totalCount,
        pagenationBuilder._take,
      ),
      hasNextPage: this.getHasNextPage(
        pagenationBuilder._page,
        this.getTotalPage(
          pagenationBuilder._totalCount,
          pagenationBuilder._take,
        ),
      ),
      search : pagenationBuilder._search,
    };
  }

  private getTotalPage(totalCount: number, take: number): number {
    return Math.ceil(totalCount / take);
  }

  private getHasNextPage(page: number, totalPage: number): boolean {
    return page < totalPage;
  }
}