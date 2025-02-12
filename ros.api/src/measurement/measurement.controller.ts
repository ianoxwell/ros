import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Measurement } from './measurement.entity';
import { MeasurementService } from './measurement.service';

@ApiTags('reference')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('JWT-auth')
@Controller('measurement')
export class MeasurementController {
  constructor(private measurementService: MeasurementService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of possible measurements',
    type: [Measurement]
  })
  async findAll(): Promise<Measurement[]> {
    return this.measurementService.findAll();
  }
}
