import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';
import { AuthGuard } from '@nestjs/passport';
import { IAllReferences, IReference } from '@models/reference.dto';

@ApiTags('reference')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('JWT-auth')
@Controller('reference')
export class ReferenceController {
  constructor(private referenceService: ReferenceService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of reference items only',
    type: [Reference]
  })
  async findAll(): Promise<IReference[]> {
    return this.referenceService.findAll();
  }

  @Get('/all')
  @ApiOkResponse({ description: 'Gets references split to reference type and measurements as an object' })
  async getAllReferences(): Promise<IAllReferences> {
    return await this.referenceService.getAllReferences();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Single reference items',
    type: Reference
  })
  async find(@Param('id') id: string): Promise<Reference> {
    return this.referenceService.find(id);
  }
}
