import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { CreateOrganizationService } from '../services/create-organization.service';
import { GetOrganizationService } from '../services/get-organization.service';
import { UpdateOrganizationService } from '../services/update-organization.service';
import { DeleteOrganizationService } from '../services/delete-organization.service';
import { OrganizationLogoService } from '../services/organization-logo.service';
import { CreateOrganizationDto } from '../dto/request/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/request/update-organization.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrgService: CreateOrganizationService,
    private readonly getOrgService: GetOrganizationService,
    private readonly updateOrgService: UpdateOrganizationService,
    private readonly deleteOrgService: DeleteOrganizationService,
    private readonly logoService: OrganizationLogoService,
  ) {}

  @ApiOperation({ summary: 'Create a new organization page' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrganizationDto,
  ) {
    const org = await this.createOrgService.execute(req.user.sub, dto);
    return {
      status: 'success',
      message: 'Organization created successfully',
      organization: org,
    };
  }

  @ApiOperation({ summary: 'List all organizations' })
  @Get()
  async findAll() {
    const organizations = await this.getOrgService.findAll();
    return { status: 'success', organizations };
  }

  @ApiOperation({ summary: 'Get organization by slug' })
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const organization = await this.getOrgService.findBySlug(slug);
    return { status: 'success', organization };
  }

  @ApiOperation({ summary: 'Get organization by ID' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const organization = await this.getOrgService.findById(id);
    return { status: 'success', organization };
  }

  @ApiOperation({ summary: 'Update organization details' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const organization = await this.updateOrgService.execute(
      id,
      req.user.sub,
      dto,
    );
    return {
      status: 'success',
      message: 'Organization updated successfully',
      organization,
    };
  }

  @ApiOperation({ summary: 'Delete organization' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.deleteOrgService.execute(id, req.user.sub);
    return {
      status: 'success',
      message: 'Organization deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Upload organization logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/logo')
  async uploadLogo(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const organization = await this.logoService.uploadLogo(
      id,
      req.user.sub,
      file,
    );
    return {
      status: 'success',
      message: 'Organization logo uploaded successfully',
      logo: organization.logo,
      organization,
    };
  }

  @ApiOperation({ summary: 'Upload organization cover picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/cover')
  async uploadCover(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const organization = await this.logoService.uploadCover(
      id,
      req.user.sub,
      file,
    );
    return {
      status: 'success',
      message: 'Organization cover uploaded successfully',
      cover: organization.cover,
      organization,
    };
  }
}
