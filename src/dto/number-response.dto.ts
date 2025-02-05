import { ApiProperty } from '@nestjs/swagger';

export class NumberResponseDto {
  @ApiProperty({ example: 371 })
  number: number;

  @ApiProperty({ example: false })
  is_prime: boolean;

  @ApiProperty({ example: false })
  is_perfect: boolean;

  @ApiProperty({ example: ['armstrong', 'odd'] })
  properties: string[];

  @ApiProperty({ example: 11 })
  digit_sum: number;

  @ApiProperty({
    example: '371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371',
  })
  fun_fact: string;
}
