import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  prepareArray, 
  validateArray, 
  measurePerformance
} from '../utils';

/**
 * MergeSort implementation with optimizations
 * 
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(n) - requires extra space
 * 
 * Advantages:
 * - Stable sort
 * - Predictable performance
 * - Good for linked lists
 * 
 * Optimizations:
 * - Bottom-up merge sort
 * - Insertion sort for small arrays
 * - In-place merge for small arrays
 */
export class MergeSort {
  private static readonly INSERTION_SORT_THRESHOLD = 7;

  /**
   * Sorts an array using MergeSort algorithm (top-down)
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
      this.mergeSort(array, 0, array.length - 1, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Recursive MergeSort implementation
   */
  private static mergeSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    if (right - left + 1 <= this.INSERTION_SORT_THRESHOLD) {
      this.insertionSort(arr, left, right, compare, metrics);
      return;
    }

    const mid = Math.floor((left + right) / 2);
    
    this.mergeSort(arr, left, mid, compare, metrics);
    this.mergeSort(arr, mid + 1, right, compare, metrics);
    
    // Skip merge if already sorted
    metrics.comparisons++;
    if (compare(arr[mid], arr[mid + 1]) <= 0) {
      return;
    }
    
    this.merge(arr, left, mid, right, compare, metrics);
  }

  /**
   * Merges two sorted subarrays
   */
  private static merge<T>(
    arr: T[],
    left: number,
    mid: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      metrics.comparisons++;
      if (compare(leftArray[i], rightArray[j]) <= 0) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      metrics.swaps++;
      k++;
    }
    
    // Copy remaining elements
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      metrics.swaps++;
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      metrics.swaps++;
      j++;
      k++;
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
   * Bottom-up MergeSort implementation (iterative)
   */
  static sortBottomUp<T>(
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
      this.bottomUpMergeSort(array, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Bottom-up MergeSort implementation
   */
  private static bottomUpMergeSort<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    
    // Start with subarrays of size 1, then 2, 4, 8, ...
    for (let size = 1; size < n; size = size * 2) {
      for (let left = 0; left < n - size; left += size * 2) {
        const mid = left + size - 1;
        const right = Math.min(left + size * 2 - 1, n - 1);
        
        this.merge(arr, left, mid, right, compare, metrics);
      }
    }
  }

  /**
   * In-place merge implementation (uses less memory but more swaps)
   */
  static sortInPlace<T>(
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
      this.inPlaceMergeSort(array, 0, array.length - 1, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * In-place merge sort implementation
   */
  private static inPlaceMergeSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    if (right - left + 1 <= this.INSERTION_SORT_THRESHOLD) {
      this.insertionSort(arr, left, right, compare, metrics);
      return;
    }

    const mid = Math.floor((left + right) / 2);
    
    this.inPlaceMergeSort(arr, left, mid, compare, metrics);
    this.inPlaceMergeSort(arr, mid + 1, right, compare, metrics);
    
    this.inPlaceMerge(arr, left, mid, right, compare, metrics);
  }

  /**
   * In-place merge implementation
   */
  private static inPlaceMerge<T>(
    arr: T[],
    left: number,
    mid: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    let i = left;
    let j = mid + 1;
    
    while (i <= mid && j <= right) {
      metrics.comparisons++;
      if (compare(arr[i], arr[j]) <= 0) {
        i++;
      } else {
        // Rotate the subarray to bring arr[j] to position i
        const temp = arr[j];
        for (let k = j; k > i; k--) {
          arr[k] = arr[k - 1];
          metrics.swaps++;
        }
        arr[i] = temp;
        metrics.swaps++;
        i++;
        mid++;
        j++;
      }
    }
  }
} 