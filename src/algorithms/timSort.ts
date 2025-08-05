import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  prepareArray, 
  validateArray, 
  measurePerformance,
  swap
} from '../utils';

/**
 * TimSort implementation - hybrid sorting algorithm
 * 
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(n)
 * 
 * Advantages:
 * - Optimized for real-world data
 * - Stable sort
 * - Good performance on partially sorted data
 * - Used by Python and Java
 * 
 * Algorithm:
 * 1. Find natural runs (ascending or descending sequences)
 * 2. Use insertion sort for small runs
 * 3. Merge runs using merge sort
 */
export class TimSort {
  private static readonly MIN_MERGE = 32;
  private static readonly MIN_GALLOP = 7;

  /**
   * Sorts an array using TimSort algorithm
   */
  static sort<T>(
    arr: T[],
    options: SortOptions<T> = {}
  ): SortResult<T> {
    validateArray(arr);
    
    if (arr.length <= 1) {
      return {
        result: prepareArray(arr, options),
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);
    const array = prepareArray(arr, options);

    const result = measurePerformance(() => {
      this.timSort(array, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * TimSort implementation
   */
  private static timSort<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    
    // If array is small, use insertion sort
    if (n < this.MIN_MERGE) {
      this.insertionSort(arr, 0, n - 1, compare, metrics);
      return;
    }

    // Calculate minimum run length
    const minRun = this.minRunLength(n);
    
    // Find and sort runs
    const runs: Run[] = [];
    let start = 0;
    
    while (start < n) {
      const runEnd = this.findRun(arr, start, n - 1, compare, metrics);
      
      // If run is too short, extend it
      if (runEnd - start + 1 < minRun) {
        const end = Math.min(start + minRun - 1, n - 1);
        this.insertionSort(arr, start, end, compare, metrics);
        runs.push({ start, end });
        start = end + 1;
      } else {
        runs.push({ start, end: runEnd });
        start = runEnd + 1;
      }
    }

    // Merge runs
    this.mergeRuns(arr, runs, compare, metrics);
  }

  /**
   * Calculates the minimum run length
   */
  private static minRunLength(n: number): number {
    let r = 0;
    while (n >= this.MIN_MERGE) {
      r |= n & 1;
      n >>= 1;
    }
    return n + r;
  }

  /**
   * Finds a natural run (ascending or descending sequence)
   */
  private static findRun<T>(
    arr: T[],
    start: number,
    end: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): number {
    let runEnd = start;
    
    // Find ascending run
    while (runEnd < end) {
      metrics.comparisons++;
      if (compare(arr[runEnd], arr[runEnd + 1]) > 0) {
        break;
      }
      runEnd++;
    }
    
    // If we found a descending run, reverse it
    if (runEnd < end) {
      this.reverseRun(arr, start, runEnd);
      while (runEnd < end) {
        metrics.comparisons++;
        if (compare(arr[runEnd], arr[runEnd + 1]) <= 0) {
          break;
        }
        runEnd++;
      }
    }
    
    return runEnd;
  }

  /**
   * Reverses a run in the array
   */
  private static reverseRun<T>(arr: T[], start: number, end: number): void {
    while (start < end) {
      swap(arr, start, end);
      start++;
      end--;
    }
  }

  /**
   * Merges runs using a stack-based approach
   */
  private static mergeRuns<T>(
    arr: T[],
    runs: Run[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const stack: Run[] = [];
    
    for (const run of runs) {
      stack.push(run);
      
      // Merge runs according to TimSort's merge conditions
      while (stack.length >= 3) {
        const n = stack.length;
        const run1 = stack[n - 3];
        const run2 = stack[n - 2];
        const run3 = stack[n - 1];
        
        if (run2.end - run2.start <= run3.end - run3.start) {
          // Merge run1 and run2
          this.mergeRunsOptimized(arr, run1, run2, compare, metrics);
          stack.splice(n - 3, 2, { start: run1.start, end: run2.end });
        } else if (run1.end - run1.start <= run2.end - run2.start + run3.end - run3.start) {
          // Merge run1 and run2
          this.mergeRunsOptimized(arr, run1, run2, compare, metrics);
          stack.splice(n - 3, 2, { start: run1.start, end: run2.end });
        } else {
          // Merge run2 and run3
          this.mergeRunsOptimized(arr, run2, run3, compare, metrics);
          stack.splice(n - 2, 2, { start: run2.start, end: run3.end });
        }
      }
    }
    
    // Merge remaining runs
    while (stack.length > 1) {
      const run1 = stack.shift()!;
      const run2 = stack.shift()!;
      this.mergeRunsOptimized(arr, run1, run2, compare, metrics);
      stack.unshift({ start: run1.start, end: run2.end });
    }
  }

  /**
   * Optimized merge of two runs
   */
  private static mergeRunsOptimized<T>(
    arr: T[],
    run1: Run,
    run2: Run,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const left = arr.slice(run1.start, run1.end + 1);
    const right = arr.slice(run2.start, run2.end + 1);
    
    let i = 0, j = 0, k = run1.start;
    let gallopLeft = 0, gallopRight = 0;
    
    while (i < left.length && j < right.length) {
      metrics.comparisons++;
      
      if (gallopLeft >= this.MIN_GALLOP || gallopRight >= this.MIN_GALLOP) {
        // Use galloping mode
        const gallopResult = this.gallopMerge(
          arr, left, right, i, j, k, compare, metrics
        );
        i = gallopResult.leftIndex;
        j = gallopResult.rightIndex;
        k = gallopResult.arrayIndex;
        gallopLeft = gallopRight = 0;
      } else {
        // Normal merge
        if (compare(left[i], right[j]) <= 0) {
          arr[k] = left[i];
          i++;
          gallopLeft++;
          gallopRight = 0;
        } else {
          arr[k] = right[j];
          j++;
          gallopRight++;
          gallopLeft = 0;
        }
        metrics.swaps++;
        k++;
      }
    }
    
    // Copy remaining elements
    while (i < left.length) {
      arr[k] = left[i];
      metrics.swaps++;
      i++;
      k++;
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      metrics.swaps++;
      j++;
      k++;
    }
  }

  /**
   * Galloping merge for better performance on large runs
   */
  private static gallopMerge<T>(
    arr: T[],
    left: T[],
    right: T[],
    leftIndex: number,
    rightIndex: number,
    arrayIndex: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): { leftIndex: number; rightIndex: number; arrayIndex: number } {
    // Find the position of right[rightIndex] in left array
    const gallopLeft = this.gallopSearch(left, right[rightIndex], leftIndex, compare, metrics);
    
    // Copy elements from left array
    for (let i = leftIndex; i < gallopLeft; i++) {
      arr[arrayIndex] = left[i];
      metrics.swaps++;
      arrayIndex++;
    }
    
    // Find the position of left[gallopLeft] in right array
    const gallopRight = this.gallopSearch(right, left[gallopLeft], rightIndex, compare, metrics);
    
    // Copy elements from right array
    for (let i = rightIndex; i < gallopRight; i++) {
      arr[arrayIndex] = right[i];
      metrics.swaps++;
      arrayIndex++;
    }
    
    return {
      leftIndex: gallopLeft,
      rightIndex: gallopRight,
      arrayIndex
    };
  }

  /**
   * Galloping search for finding insertion point
   */
  private static gallopSearch<T>(
    arr: T[],
    target: T,
    start: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): number {
    let i = start;
    let step = 1;
    
    // Exponential search
    while (i < arr.length) {
      metrics.comparisons++;
      if (compare(arr[i], target) > 0) {
        break;
      }
      i += step;
      step *= 2;
    }
    
    // Binary search in the range [start, i]
    const end = Math.min(i, arr.length);
    return this.binarySearch(arr, target, start, end, compare, metrics);
  }

  /**
   * Binary search implementation
   */
  private static binarySearch<T>(
    arr: T[],
    target: T,
    start: number,
    end: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): number {
    let left = start;
    let right = end;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      metrics.comparisons++;
      
      if (compare(arr[mid], target) <= 0) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return left;
  }

  /**
   * Insertion sort for small arrays
   */
  private static insertionSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= left) {
        metrics.comparisons++;
        if (compare(arr[j], key) <= 0) break;
        
        arr[j + 1] = arr[j];
        metrics.swaps++;
        j--;
      }
      
      arr[j + 1] = key;
    }
  }
}

/**
 * Represents a run in the array
 */
interface Run {
  start: number;
  end: number;
} 