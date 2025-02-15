import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NumberResponseDto } from './dto/number-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';

ApiTags('numbers');
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('classify-number')
  @ApiOperation({ summary: 'Classify a number and get its properties' })
  @ApiQuery({ name: 'number', type: Number, description: 'Number to classify' })
  @ApiResponse({ status: 200, type: NumberResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  async classifyNumber(@Query('number') numberStr: string) {
    if (!/^-?\d+$/.test(numberStr)) {
      throw new BadRequestException({
        number: numberStr,
        error: true,
      });
    }
    const number = parseInt(numberStr);

    return this.appService.classifyNumber(number);
  }
}
