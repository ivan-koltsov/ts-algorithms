import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  prepareArray, 
  validateArray, 
  measurePerformance,
  medianOfThree,
  partition
} from '../utils';

/**
 * QuickSort implementation with optimizations
 * 
 * Time Complexity:
 * - Average: O(n log n)
 * - Worst: O(n²) (rare with good pivot selection)
 * - Best: O(n log n)
 * 
 * Space Complexity: O(log n) due to recursion stack
 * 
 * Optimizations:
 * - Median-of-three pivot selection
 * - Insertion sort for small arrays
 * - Tail recursion optimization
 */
export class QuickSort {
  private static readonly INSERTION_SORT_THRESHOLD = 10;

  /**
   * Sorts an array using QuickSort algorithm
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
      this.quickSort(array, 0, array.length - 1, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Recursive QuickSort implementation
   */
  private static quickSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    // Use insertion sort for small arrays
    if (right - left + 1 <= this.INSERTION_SORT_THRESHOLD) {
      this.insertionSort(arr, left, right, compare, metrics);
      return;
    }

    // Use median-of-three for pivot selection
    const pivotIndex = medianOfThree(arr, left, right, compare);
    const pivot = arr[pivotIndex];

    // Move pivot to end
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    metrics.swaps++;

    // Partition around pivot
    const partitionIndex = partition(arr, left, right, compare, metrics);

    // Recursively sort left and right parts
    if (left < partitionIndex - 1) {
      this.quickSort(arr, left, partitionIndex - 1, compare, metrics);
    }
    if (partitionIndex + 1 < right) {
      this.quickSort(arr, partitionIndex + 1, right, compare, metrics);
    }
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

  /**
   * Three-way partition QuickSort for arrays with many duplicates
   */
  static sortWithDuplicates<T>(
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
      this.threeWayQuickSort(array, 0, array.length - 1, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Three-way partition QuickSort implementation
   */
  private static threeWayQuickSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    if (right <= left) return;

    let lt = left;
    let gt = right;
    const pivot = arr[left];
    let i = left + 1;

    while (i <= gt) {
      metrics.comparisons++;
      const cmp = compare(arr[i], pivot);
      
      if (cmp < 0) {
        [arr[lt], arr[i]] = [arr[i], arr[lt]];
        metrics.swaps++;
        lt++;
        i++;
      } else if (cmp > 0) {
        [arr[gt], arr[i]] = [arr[i], arr[gt]];
        metrics.swaps++;
        gt--;
      } else {
        i++;
      }
    }

    this.threeWayQuickSort(arr, left, lt - 1, compare, metrics);
    this.threeWayQuickSort(arr, gt + 1, right, compare, metrics);
  }
} 