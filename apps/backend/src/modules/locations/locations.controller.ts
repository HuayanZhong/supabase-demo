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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import {
  ApiDataResponse,
  ApiErrorResponse,
} from "../../common/decorators/api-data-response.decorator";
import { LocationsService } from "./locations.service";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { CreateLocationInputDto } from "./dto/create-location-input.dto";
import { Location } from "./entities/location.entity";

/**
 * 位置控制器
 *
 * 提供位置信息的 CRUD 接口和城市搜索接口。
 * 搜索接口转发到和风天气 GeoAPI，其余操作基于本地数据库缓存。
 */
@ApiTags("位置")
@Controller({ path: "locations", version: "1" })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get("search")
  @ApiOperation({ summary: "搜索城市" })
  @ApiQuery({ name: "keyword", description: "城市名/关键词", example: "北京", required: true })
  @ApiDataResponse(Location, { description: "搜索成功", isArray: true })
  search(@Query("keyword") keyword?: string): Promise<Location[]> {
    if (!keyword) {
      return Promise.resolve([]);
    }
    return this.locationsService.search(keyword);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "创建位置（经纬度 + 逆地理编码）" })
  @ApiDataResponse(Location, { status: HttpStatus.CREATED, description: "创建成功" })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, "经纬度未找到对应城市")
  @ApiErrorResponse(HttpStatus.BAD_GATEWAY, "逆地理编码服务错误")
  create(@Body() input: CreateLocationInputDto): Promise<Location> {
    return this.locationsService.createFromLatLon(input);
  }

  @Get()
  @ApiOperation({ summary: "获取所有位置" })
  @ApiDataResponse(Location, { description: "获取成功", isArray: true })
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单个位置" })
  @ApiDataResponse(Location, { description: "获取成功" })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, "位置不存在")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Location> {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新位置" })
  @ApiDataResponse(Location, { description: "更新成功" })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, "位置不存在")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除位置" })
  @ApiResponse({ status: HttpStatus.OK, description: "删除成功" })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, "位置不存在")
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.locationsService.remove(id);
  }
}
