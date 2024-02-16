import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  PaginationDefault,
  PaginationRequest,
} from '../pagination/pagination.request';

/*
 * @GetPagination() is a decorator that returns a PagenationRequest object.
 * @GetPagination() pagination: PaginationRequest
 */
export const GetPagination = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = request.body?.page || PaginationDefault.PAGE_DEFAULT;
    const take = request.body?.take || PaginationDefault.TAKE_DEFAULT;
    const search = request.body?.search || {type:'',text:''};

    const pagenationRequest: PaginationRequest = {
      page: page,
      take: take,
      search: search,
      getPage: () => {
        return page;
      },
      getSkip: () => {
        return (page - 1) * take;
      },
      getTake: () => {
        return take;
      },
      getSearch: () => {
        return search;
      },
    };
    return pagenationRequest;
  },
);