import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

@ApiTags("位置")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

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
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新位置" })
  @ApiResponse({ status: 200, description: "更新成功", type: Location })
  update(@Param("id", ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除位置" })
  @ApiResponse({ status: 200, description: "删除成功" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }
}
