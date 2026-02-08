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
import { ImagesService } from './images.service';
import { CreateImageDto, UpdateImageDto, QueryImageDto } from './dto';
import { AdminGuard, VipLevelGuard } from '../../common/guards';
import { RequireVipLevel, CurrentUser } from '../../common/decorators';
import { VIP_LEVELS } from '../../common/constants';
import { User } from '../../entities';

@ApiTags('圖片管理')
@ApiBearerAuth()
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @UseGuards(VipLevelGuard)
  @RequireVipLevel(VIP_LEVELS.PLATINUM)
  @ApiOperation({ summary: '取得圖片列表（VIP 5+）' })
  @ApiResponse({ status: 200, description: '成功取得圖片列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async findAll(@Query() query: QueryImageDto, @CurrentUser() user: User) {
    return this.imagesService.findAll(query, user.vipLevel);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '取得圖片列表（管理員）' })
  @ApiResponse({ status: 200, description: '成功取得圖片列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async findAllForAdmin(@Query() query: QueryImageDto) {
    return this.imagesService.findAllForAdmin(query);
  }

  @Get(':id')
  @UseGuards(VipLevelGuard)
  @RequireVipLevel(VIP_LEVELS.PLATINUM)
  @ApiOperation({ summary: '取得單一圖片（VIP 5+）' })
  @ApiResponse({ status: 200, description: '成功取得圖片' })
  @ApiResponse({ status: 403, description: '權限不足' })
  @ApiResponse({ status: 404, description: '圖片不存在' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.imagesService.findOne(id, user.vipLevel);
  }

  @Get('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '取得單一圖片（管理員）' })
  @ApiResponse({ status: 200, description: '成功取得圖片' })
  @ApiResponse({ status: 404, description: '圖片不存在' })
  async findOneForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.findOneForAdmin(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '建立圖片' })
  @ApiResponse({ status: 201, description: '圖片建立成功' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '更新圖片' })
  @ApiResponse({ status: 200, description: '圖片更新成功' })
  @ApiResponse({ status: 404, description: '圖片不存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '刪除圖片' })
  @ApiResponse({ status: 200, description: '圖片刪除成功' })
  @ApiResponse({ status: 404, description: '圖片不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.remove(id);
  }
}
