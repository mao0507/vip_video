import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './dto';
import { Public, CurrentUser } from '../../common/decorators';
import { User } from '../../entities';

@ApiTags('搜尋')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '搜尋影片和圖片' })
  @ApiResponse({ status: 200, description: '成功取得搜尋結果' })
  async search(@Query() searchDto: SearchDto, @CurrentUser() user?: User) {
    return this.searchService.search(searchDto, user?.vipLevel);
  }

  @Get('suggestions')
  @Public()
  @ApiOperation({ summary: '取得搜尋建議' })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '成功取得搜尋建議' })
  async getSuggestions(
    @Query('keyword') keyword: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.getSuggestions(keyword, limit || 5);
  }
}
