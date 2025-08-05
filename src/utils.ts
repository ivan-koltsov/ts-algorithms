import { CompareFunction, SortMetrics, SortOptions } from './types';

/**
 * Default comparison function for numbers
 */
export const defaultCompare: CompareFunction<number> = (a, b) => a - b;

/**
 * Creates a comparison function for strings
 */
export const stringCompare: CompareFunction<string> = (a, b) => a.localeCompare(b);

/**
 * Creates a comparison function for dates
 */
export const dateCompare: CompareFunction<Date> = (a, b) => a.getTime() - b.getTime();

/**
 * Creates a comparison function for objects by a specific key
 */
export function objectCompare<T, K extends keyof T>(key: K): CompareFunction<T> {
  return (a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

/**
 * Swaps two elements in an array
 */
export function swap<T>(arr: T[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Creates a performance measurement wrapper
 */
export function measurePerformance<T>(
  fn: () => T,
  metrics: SortMetrics
): T {
  const startTime = performance.now();
  const startMemory = process.memoryUsage?.()?.heapUsed;
  
  const result = fn();
  
  const endTime = performance.now();
  const endMemory = process.memoryUsage?.()?.heapUsed;
  
  metrics.executionTime = endTime - startTime;
  if (startMemory && endMemory) {
    metrics.memoryUsage = endMemory - startMemory;
  }
  
  return result;
}

/**
 * Applies sort options to create the final comparison function
 */
export function createCompareFunction<T>(
  options: SortOptions<T> = {}
): CompareFunction<T> {
  const { compare = defaultCompare as CompareFunction<T>, descending = false } = options;
  
  if (descending) {
    return (a, b) => -compare(a, b);
  }
  
  return compare;
}

/**
 * Prepares array for sorting based on options
 */
export function prepareArray<T>(arr: T[], options: SortOptions<T> = {}): T[] {
  if (options.inPlace) {
    return arr;
  }
  return [...arr];
}

/**
 * Validates array input
 */
export function validateArray<T>(arr: T[]): void {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
}

/**
 * Checks if array is already sorted
 */
export function isSorted<T>(arr: T[], compare: CompareFunction<T>): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (compare(arr[i - 1], arr[i]) > 0) {
      return false;
    }
  }
  return true;
}

/**
 * Finds the median of three values for pivot selection
 */
export function medianOfThree<T>(
  arr: T[],
  left: number,
  right: number,
  compare: CompareFunction<T>
): number {
  const mid = Math.floor((left + right) / 2);
  
  // Sort the three elements
  if (compare(arr[left], arr[mid]) > 0) {
    swap(arr, left, mid);
  }
  if (compare(arr[left], arr[right]) > 0) {
    swap(arr, left, right);
  }
  if (compare(arr[mid], arr[right]) > 0) {
    swap(arr, mid, right);
  }
  
  // Place pivot at right - 1
  swap(arr, mid, right - 1);
  return right - 1;
}

/**
 * Partitions array around a pivot (for QuickSort)
 */
export function partition<T>(
  arr: T[],
  left: number,
  right: number,
  compare: CompareFunction<T>,
  metrics: SortMetrics
): number {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    metrics.comparisons++;
    if (compare(arr[j], pivot) <= 0) {
      i++;
      if (i !== j) {
        swap(arr, i, j);
        metrics.swaps++;
      }
    }
  }
  
  swap(arr, i + 1, right);
  metrics.swaps++;
  return i + 1;
}

/**
 * Generates a random array for testing
 */
export function generateRandomArray(size: number, min = 0, max = 1000): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Generates a sorted array
 */
export function generateSortedArray(size: number, start = 0): number[] {
  return Array.from({ length: size }, (_, i) => start + i);
}

/**
 * Generates a reverse sorted array
 */
export function generateReverseSortedArray(size: number, start = 0): number[] {
  return Array.from({ length: size }, (_, i) => start + size - 1 - i);
}

/**
 * Generates an array with many duplicates
 */
export function generateDuplicateArray(size: number, uniqueValues = 10): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * uniqueValues));
} 