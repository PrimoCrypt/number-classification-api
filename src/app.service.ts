import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
@Injectable()
export class AppService {
  private readonly cache = new Map<number, string>();
  private readonly cacheTimeout = 3600000; // 1 hour in milliseconds

  constructor(private readonly httpService: HttpService) {}

  async classifyNumber(number: number) {
    const properties = [];

    const [isPrime, isPerfect, isArmstrongNum, funFact] = await Promise.all([
      this.isPrime(number),
      this.isPerfect(number),
      this.isArmstrong(number),
      this.getFunFact(number),
    ]);

    // Check if number is Armstrong
    if (isArmstrongNum) {
      properties.push('armstrong');
    }

    properties.push(number % 2 === 0 ? 'even' : 'odd');

    // Get fun fact from Numbers API

    return {
      number,
      is_prime: isPrime,
      is_perfect: isPerfect,
      properties,
      digit_sum: this.getDigitSum(number),
      fun_fact: funFact,
    };
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
    const cached = this.cache.get(num);
    if (cached) {
      return cached;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://numbersapi.com/${num}/math`).pipe(
          timeout(2000), // 2 second timeout
          catchError(() => {
            return Promise.resolve({ data: `${num} is a number.` });
          }),
        ),
      );

      const fact = response.data;
      // Cache the result
      this.cache.set(num, fact);

      // Clear cache after timeout
      setTimeout(() => {
        this.cache.delete(num);
      }, this.cacheTimeout);

      return fact;
    } catch {
      return `${num} is a number.`;
    }
  }
}
