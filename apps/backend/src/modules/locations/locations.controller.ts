import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

/**
 * 位置控制器
 *
 * 提供位置信息的 CRUD 接口和城市搜索接口。
 * 搜索接口转发到和风天气 GeoAPI，其余操作基于本地数据库缓存。
 */
@ApiTags("位置")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get("search")
  @ApiOperation({ summary: "搜索城市" })
  @ApiQuery({ name: "keyword", description: "城市名/关键词", example: "北京", required: true })
  @ApiResponse({ status: 200, description: "搜索成功", type: [Location] })
  search(@Query("keyword") keyword?: string) {
    if (!keyword) {
      return [];
    }
    return this.locationsService.search(keyword);
  }

  @Post()
  @ApiOperation({ summary: "创建位置" })
  @ApiResponse({ status: 201, description: "创建成功", type: Location })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: "获取所有位置" })
  @ApiResponse({ status: 200, description: "获取成功", type: [Location] })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单个位置" })
  @ApiResponse({ status: 200, description: "获取成功", type: Location })
  @ApiResponse({ status: 404, description: "位置不存在" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新位置" })
  @ApiResponse({ status: 200, description: "更新成功", type: Location })
  @ApiResponse({ status: 404, description: "位置不存在" })
  update(@Param("id", ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除位置" })
  @ApiResponse({ status: 200, description: "删除成功" })
  @ApiResponse({ status: 404, description: "位置不存在" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }
}
