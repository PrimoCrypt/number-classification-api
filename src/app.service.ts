import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async classifyNumber(number: number) {
    const properties = [];

    // Check if number is Armstrong
    if (this.isArmstrong(number)) {
      properties.push('armstrong');
    }

    // Check if number is odd/even
    properties.push(number % 2 === 0 ? 'even' : 'odd');

    // Get fun fact from Numbers API
    const funFact = await this.getFunFact(number);

    return JSON.stringify({
      number,
      is_prime: this.isPrime(number),
      is_perfect: this.isPerfect(number),
      properties,
      digit_sum: this.getDigitSum(number),
      fun_fact: funFact,
    });
  }

  private isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  private isPerfect(num: number): boolean {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        sum += i;
        if (i !== num / i) sum += num / i;
      }
    }
    return sum === num;
  }

  private isArmstrong(num: number): boolean {
    const newNum = Number(num);
    const absNum = Math.abs(newNum);
    // Convert to string once
    const numStr = absNum.toString();
    // Get the number of digits
    const power = numStr.length;
    // Calculate sum of each digit raised to power
    const sum = numStr
      .split('')
      .reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    console.log({ sum });
    console.log({ newNum });
    // Compare with original number
    return sum === absNum;
  }

  private getDigitSum(num: number): number {
    const newNum = Number(num);
    const absNum = Math.abs(newNum);
    return absNum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, digit) => acc + digit, 0);
  }

  private async getFunFact(num: number): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://numbersapi.com/${num}/math`),
      );
      return response.data;
    } catch {
      return `${num} is a number.`;
    }
  }
}
