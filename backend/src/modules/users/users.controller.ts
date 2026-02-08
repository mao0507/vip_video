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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdateVipLevelDto } from './dto';
import { AdminGuard } from '../../common/guards';

@ApiTags('使用者管理')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '取得使用者列表' })
  @ApiResponse({ status: 200, description: '成功取得使用者列表' })
  @ApiResponse({ status: 403, description: '權限不足' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '取得單一使用者' })
  @ApiResponse({ status: 200, description: '成功取得使用者' })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '建立使用者' })
  @ApiResponse({ status: 201, description: '使用者建立成功' })
  @ApiResponse({ status: 409, description: '使用者名稱已存在' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新使用者' })
  @ApiResponse({ status: 200, description: '使用者更新成功' })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/vip-level')
  @ApiOperation({ summary: '更新 VIP 等級' })
  @ApiResponse({ status: 200, description: 'VIP 等級更新成功' })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  async updateVipLevel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVipLevelDto: UpdateVipLevelDto,
  ) {
    return this.usersService.updateVipLevel(id, updateVipLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除使用者' })
  @ApiResponse({ status: 200, description: '使用者刪除成功' })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
