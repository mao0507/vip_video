import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@ApiTags('分類管理')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '取得分類列表' })
  @ApiResponse({ status: 200, description: '成功取得分類列表' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get('with-count')
  @Public()
  @ApiOperation({ summary: '取得分類列表（含影片數量）' })
  @ApiResponse({ status: 200, description: '成功取得分類列表' })
  async findAllWithVideoCount() {
    return this.categoriesService.findAllWithVideoCount();
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得分類列表（管理員，含未啟用）' })
  @ApiResponse({ status: 200, description: '成功取得分類列表' })
  async findAllForAdmin() {
    return this.categoriesService.findAll(true);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '取得單一分類' })
  @ApiResponse({ status: 200, description: '成功取得分類' })
  @ApiResponse({ status: 404, description: '分類不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/videos')
  @Public()
  @ApiOperation({ summary: '取得分類下的影片' })
  @ApiResponse({ status: 200, description: '成功取得分類下的影片' })
  @ApiResponse({ status: 404, description: '分類不存在' })
  async findOneWithVideos(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOneWithVideos(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立分類' })
  @ApiResponse({ status: 201, description: '分類建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('reorder')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '重新排序分類' })
  @ApiResponse({ status: 200, description: '分類排序成功' })
  async reorder(@Body() body: { ids: string[] }) {
    return this.categoriesService.reorder(body.ids);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新分類' })
  @ApiResponse({ status: 200, description: '分類更新成功' })
  @ApiResponse({ status: 404, description: '分類不存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除分類' })
  @ApiResponse({ status: 200, description: '分類刪除成功' })
  @ApiResponse({ status: 404, description: '分類不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
