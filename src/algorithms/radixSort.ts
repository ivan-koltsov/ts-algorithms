import { SortMetrics, SortOptions, SortResult } from '../types';
import { 
  prepareArray, 
  validateArray, 
  measurePerformance
} from '../utils';

/**
 * RadixSort implementation for integer sorting
 * 
 * Time Complexity: O(d * (n + k)) where d is number of digits, k is base
 * Space Complexity: O(n + k)
 * 
 * Advantages:
 * - Linear time for integers with bounded digits
 * - Stable sort
 * - Good for integers and strings
 * 
 * Algorithm:
 * 1. Sort by least significant digit (LSD) or most significant digit (MSD)
 * 2. Use counting sort for each digit
 * 3. Repeat for all digits
 */
export class RadixSort {
  private static readonly DEFAULT_BASE = 10;

  /**
   * Sorts an array of integers using RadixSort (LSD)
   */
  static sort<T extends number>(
    arr: T[],
    options: SortOptions<T> & { base?: number } = {}
  ): SortResult<T> {
    validateArray(arr);
    
    if (arr.length <= 1) {
      return {
        result: prepareArray(arr, options),
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const base = options.base || this.DEFAULT_BASE;
    const array = prepareArray(arr, options);

    const result = measurePerformance(() => {
      this.lsdRadixSort(array, base, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Least Significant Digit (LSD) RadixSort implementation
   */
  private static lsdRadixSort<T extends number>(
    arr: T[],
    base: number,
    metrics: SortMetrics
  ): void {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    
    // Handle negative numbers by shifting
    const offset = min < 0 ? -min : 0;
    const adjustedArr = arr.map(x => x + offset);
    
    // Find the maximum number of digits
    const maxDigits = this.getDigitCount(Math.max(...adjustedArr), base);
    
    // Sort by each digit from least significant to most significant
    for (let digit = 0; digit < maxDigits; digit++) {
      this.countingSortByDigit(adjustedArr, digit, base, metrics);
    }
    
    // Restore original values
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (adjustedArr[i] - offset) as T;
    }
  }

  /**
   * Most Significant Digit (MSD) RadixSort implementation
   */
  static sortMSD<T extends number>(
    arr: T[],
    options: SortOptions<T> & { base?: number } = {}
  ): SortResult<T> {
    validateArray(arr);
    
    if (arr.length <= 1) {
      return {
        result: prepareArray(arr, options),
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const base = options.base || this.DEFAULT_BASE;
    const array = prepareArray(arr, options);

    const result = measurePerformance(() => {
      this.msdRadixSort(array, base, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Most Significant Digit (MSD) RadixSort implementation
   */
  private static msdRadixSort<T extends number>(
    arr: T[],
    base: number,
    metrics: SortMetrics,
    digit: number = 0
  ): void {
    if (arr.length <= 1) return;
    
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const offset = min < 0 ? -min : 0;
    const adjustedArr = arr.map(x => x + offset);
    
    const maxDigits = this.getDigitCount(Math.max(...adjustedArr), base);
    
    if (digit >= maxDigits) {
      // Restore original values
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (adjustedArr[i] - offset) as T;
      }
      return;
    }
    
    // Sort by current digit
    const buckets = this.createBuckets(adjustedArr, digit, base, metrics);
    
    // Recursively sort each bucket
    let index = 0;
    for (const bucket of buckets) {
      if (bucket.length > 0) {
        this.msdRadixSort(bucket, base, metrics, digit + 1);
        
        // Copy back to original array
        for (const value of bucket) {
          arr[index] = (value - offset) as T;
          metrics.swaps++;
          index++;
        }
      }
    }
  }

  /**
   * Counting sort for a specific digit
   */
  private static countingSortByDigit<T extends number>(
    arr: T[],
    digit: number,
    base: number,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(base).fill(0);
    
    // Count occurrences of each digit
    for (let i = 0; i < n; i++) {
      const digitValue = this.getDigit(arr[i], digit, base);
      count[digitValue]++;
    }
    
    // Calculate cumulative count
    for (let i = 1; i < base; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digitValue = this.getDigit(arr[i], digit, base);
      output[count[digitValue] - 1] = arr[i];
      count[digitValue]--;
      metrics.swaps++;
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      metrics.swaps++;
    }
  }

  /**
   * Creates buckets for MSD radix sort
   */
  private static createBuckets<T extends number>(
    arr: T[],
    digit: number,
    base: number,
    metrics: SortMetrics
  ): T[][] {
    const buckets: T[][] = Array.from({ length: base }, () => []);
    
    for (const value of arr) {
      const digitValue = this.getDigit(value, digit, base);
      buckets[digitValue].push(value);
      metrics.swaps++;
    }
    
    return buckets;
  }

  /**
   * Gets the digit at the specified position
   */
  private static getDigit(num: number, position: number, base: number): number {
    return Math.floor(num / Math.pow(base, position)) % base;
  }

  /**
   * Gets the number of digits in a number
   */
  private static getDigitCount(num: number, base: number): number {
    if (num === 0) return 1;
    return Math.floor(Math.log(num) / Math.log(base)) + 1;
  }

  /**
   * RadixSort for strings
   */
  static sortStrings(
    arr: string[],
    options: SortOptions<string> & { maxLength?: number } = {}
  ): SortResult<string> {
    validateArray(arr);
    
    if (arr.length <= 1) {
      return {
        result: prepareArray(arr, options),
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const maxLength = options.maxLength || Math.max(...arr.map(s => s.length));
    const array = prepareArray(arr, options);

    const result = measurePerformance(() => {
      this.lsdStringRadixSort(array, maxLength, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * LSD RadixSort for strings
   */
  private static lsdStringRadixSort(
    arr: string[],
    maxLength: number,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    
    // Sort by each character position from right to left
    for (let pos = maxLength - 1; pos >= 0; pos--) {
      const output = new Array(n);
      const count = new Array(256).fill(0); // ASCII characters
      
      // Count occurrences of each character
      for (let i = 0; i < n; i++) {
        const char = pos < arr[i].length ? arr[i].charCodeAt(pos) : 0;
        count[char]++;
      }
      
      // Calculate cumulative count
      for (let i = 1; i < 256; i++) {
        count[i] += count[i - 1];
      }
      
      // Build output array
      for (let i = n - 1; i >= 0; i--) {
        const char = pos < arr[i].length ? arr[i].charCodeAt(pos) : 0;
        output[count[char] - 1] = arr[i];
        count[char]--;
        metrics.swaps++;
      }
      
      // Copy back to original array
      for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        metrics.swaps++;
      }
    }
  }

  /**
   * RadixSort for floating point numbers
   */
  static sortFloats(
    arr: number[],
    options: SortOptions<number> & { precision?: number } = {}
  ): SortResult<number> {
    validateArray(arr);
    
    if (arr.length <= 1) {
      return {
        result: prepareArray(arr, options),
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const precision = options.precision || 6;
    const array = prepareArray(arr, options);

    const result = measurePerformance(() => {
      this.lsdFloatRadixSort(array, precision, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * LSD RadixSort for floating point numbers
   */
  private static lsdFloatRadixSort(
    arr: number[],
    precision: number,
    metrics: SortMetrics
  ): void {
    const multiplier = Math.pow(10, precision);
    
    // Convert floats to integers by multiplying by precision
    const integerArr = arr.map(x => Math.round(x * multiplier));
    
    // Sort integers using radix sort
    this.lsdRadixSort(integerArr, 10, metrics);
    
    // Convert back to floats
    for (let i = 0; i < arr.length; i++) {
      arr[i] = integerArr[i] / multiplier;
    }
  }
} 