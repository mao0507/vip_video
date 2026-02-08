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
} from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto, QueryVideoDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public, CurrentUser } from '../../common/decorators';
import { User } from '../../entities';

@ApiTags('影片管理')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '取得影片列表（公開）' })
  @ApiResponse({ status: 200, description: '成功取得影片列表' })
  async findAll(
    @Query() query: QueryVideoDto,
    @CurrentUser() user?: User,
  ) {
    return this.videosService.findAll(query, user?.vipLevel);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得影片列表（管理員）' })
  @ApiResponse({ status: 200, description: '成功取得影片列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async findAllForAdmin(@Query() query: QueryVideoDto) {
    return this.videosService.findAllForAdmin(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '取得單一影片' })
  @ApiResponse({ status: 200, description: '成功取得影片' })
  @ApiResponse({ status: 404, description: '影片不存在' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user?: User,
  ) {
    const video = await this.videosService.findOne(id, user?.vipLevel);
    await this.videosService.incrementViewCount(id);
    return video;
  }

  @Get('admin/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得單一影片（管理員）' })
  @ApiResponse({ status: 200, description: '成功取得影片' })
  @ApiResponse({ status: 404, description: '影片不存在' })
  async findOneForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.findOneForAdmin(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立影片' })
  @ApiResponse({ status: 201, description: '影片建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新影片' })
  @ApiResponse({ status: 200, description: '影片更新成功' })
  @ApiResponse({ status: 404, description: '影片不存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除影片' })
  @ApiResponse({ status: 200, description: '影片刪除成功' })
  @ApiResponse({ status: 404, description: '影片不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.remove(id);
  }
}
