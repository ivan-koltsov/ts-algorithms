import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  prepareArray, 
  validateArray, 
  measurePerformance,
  medianOfThree,
  partition,
  swap
} from '../utils';

/**
 * IntroSort implementation - hybrid sorting algorithm
 * 
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(log n)
 * 
 * Algorithm:
 * 1. Start with QuickSort
 * 2. Switch to HeapSort if recursion depth exceeds limit
 * 3. Use InsertionSort for small arrays
 * 
 * Advantages:
 * - Combines best of QuickSort, HeapSort, and InsertionSort
 * - Guaranteed O(n log n) performance
 * - Good average case performance
 * - Used by C++ STL sort
 */
export class IntroSort {
  private static readonly INSERTION_SORT_THRESHOLD = 16;
  private static readonly MAX_DEPTH_FACTOR = 2;

  /**
   * Sorts an array using IntroSort algorithm
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
      const maxDepth = this.MAX_DEPTH_FACTOR * Math.floor(Math.log2(array.length));
      this.introSort(array, 0, array.length - 1, compare, metrics, maxDepth);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * IntroSort implementation
   */
  private static introSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics,
    depthLimit: number
  ): void {
    const size = right - left + 1;

    // Use insertion sort for small arrays
    if (size <= this.INSERTION_SORT_THRESHOLD) {
      this.insertionSort(arr, left, right, compare, metrics);
      return;
    }

    // If depth limit is reached, switch to heap sort
    if (depthLimit === 0) {
      this.heapSort(arr, left, right, compare, metrics);
      return;
    }

    // Use quick sort
    this.quickSort(arr, left, right, compare, metrics, depthLimit);
  }

  /**
   * QuickSort implementation for IntroSort
   */
  private static quickSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics,
    depthLimit: number
  ): void {
    if (left < right) {
      // Use median-of-three for pivot selection
      const pivotIndex = medianOfThree(arr, left, right, compare);
      const pivot = arr[pivotIndex];

      // Move pivot to end
      [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
      metrics.swaps++;

      // Partition around pivot
      const partitionIndex = partition(arr, left, right, compare, metrics);

      // Recursively sort left and right parts
      this.introSort(arr, left, partitionIndex - 1, compare, metrics, depthLimit - 1);
      this.introSort(arr, partitionIndex + 1, right, compare, metrics, depthLimit - 1);
    }
  }

  /**
   * HeapSort implementation for IntroSort
   */
  private static heapSort<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const size = right - left + 1;

    // Build max heap
    this.buildMaxHeap(arr, left, right, compare, metrics);

    // Extract elements from heap one by one
    for (let i = right; i > left; i--) {
      // Move current root to end
      swap(arr, left, i);
      metrics.swaps++;

      // Call max heapify on the reduced heap
      this.maxHeapify(arr, left, i - left, compare, metrics);
    }
  }

  /**
   * Builds a max heap from an unsorted array
   */
  private static buildMaxHeap<T>(
    arr: T[],
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const size = right - left + 1;
    
    // Start from the last non-leaf node and heapify each node
    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
      this.maxHeapify(arr, left + i, size - i, compare, metrics);
    }
  }

  /**
   * Maintains the max heap property
   */
  private static maxHeapify<T>(
    arr: T[],
    index: number,
    heapSize: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    let largest = index;
    const left = 2 * (index - arr[0]) + 1;
    const right = 2 * (index - arr[0]) + 2;

    // Check if left child is larger than root
    if (left < heapSize) {
      metrics.comparisons++;
      if (compare(arr[left], arr[largest]) > 0) {
        largest = left;
      }
    }

    // Check if right child is larger than largest so far
    if (right < heapSize) {
      metrics.comparisons++;
      if (compare(arr[right], arr[largest]) > 0) {
        largest = right;
      }
    }

    // If largest is not root
    if (largest !== index) {
      swap(arr, index, largest);
      metrics.swaps++;

      // Recursively heapify the affected sub-tree
      this.maxHeapify(arr, largest, heapSize, compare, metrics);
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
   * IntroSort with custom depth limit
   */
  static sortWithDepth<T>(
    arr: T[],
    maxDepth: number,
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
      this.introSort(array, 0, array.length - 1, compare, metrics, maxDepth);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * Adaptive IntroSort that adjusts depth limit based on array size
   */
  static sortAdaptive<T>(
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
      // Adaptive depth limit based on array size
      const adaptiveDepth = Math.max(
        2,
        Math.floor(Math.log2(array.length)) + Math.floor(Math.log2(Math.log2(array.length)))
      );
      this.introSort(array, 0, array.length - 1, compare, metrics, adaptiveDepth);
      return array;
    }, metrics);

    return { result, metrics };
  }
} 