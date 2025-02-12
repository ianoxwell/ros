import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('reference')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('reference')
export class ReferenceController {
  constructor(private referenceService: ReferenceService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of reference items',
    type: [Reference]
  })
  async findAll(): Promise<Reference[]> {
    return this.referenceService.findAll();
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
