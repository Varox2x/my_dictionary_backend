import { Exclude } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }
  limit: number;
  page_count: number;
  current_page: number;
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const [data, total] = await qb
    .limit(options.limit)
    .offset(offset)
    .getManyAndCount();

  return new PaginationResult({
    limit: options.limit,
    page_count: Math.ceil(total / options.limit),
    current_page: options.currentPage,
    data,
  });
}
