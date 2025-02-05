import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'alphabet' })
  number: string;

  @ApiProperty({ example: true })
  error: boolean;
}
