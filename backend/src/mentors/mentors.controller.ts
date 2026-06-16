import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';

import { MentorsService } from './mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
  ) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('keyword')
    keyword?: string,

    @Query('stack')
    stack?: string,

    @Query('sort_by')
    sortBy?: string,
  ) {
    return this.mentorsService.findAll({
      page,
      limit,
      keyword,
      stack,
      sortBy,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorsService.findOne(id);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: string) {
    return this.mentorsService.getAvailability(id);
  }
}