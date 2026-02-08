import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@ApiTags('標籤管理')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '取得標籤列表' })
  @ApiResponse({ status: 200, description: '成功取得標籤列表' })
  async findAll() {
    return this.tagsService.findAll();
  }

  @Get('popular')
  @Public()
  @ApiOperation({ summary: '取得熱門標籤' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '成功取得熱門標籤' })
  async getPopularTags(@Query('limit') limit?: number) {
    return this.tagsService.getPopularTags(limit || 10);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '取得單一標籤' })
  @ApiResponse({ status: 200, description: '成功取得標籤' })
  @ApiResponse({ status: 404, description: '標籤不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立標籤' })
  @ApiResponse({ status: 201, description: '標籤建立成功' })
  @ApiResponse({ status: 409, description: '標籤名稱已存在' })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新標籤' })
  @ApiResponse({ status: 200, description: '標籤更新成功' })
  @ApiResponse({ status: 404, description: '標籤不存在' })
  @ApiResponse({ status: 409, description: '標籤名稱已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除標籤' })
  @ApiResponse({ status: 200, description: '標籤刪除成功' })
  @ApiResponse({ status: 404, description: '標籤不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}
