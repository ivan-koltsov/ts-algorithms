import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  validateArray, 
  measurePerformance,
  defaultCompare
} from '../utils';

/**
 * Search result interface
 */
export interface SearchResult<T> {
  /** Index of found element (-1 if not found) */
  index: number;
  /** The found element (undefined if not found) */
  element?: T;
  /** Performance metrics */
  metrics: SortMetrics;
  /** Number of comparisons made */
  comparisons: number;
  /** Execution time in milliseconds */
  executionTime: number;
}

/**
 * Search algorithms implementation
 */
export class Search {
  /**
   * Linear Search - O(n) time complexity
   * Best for unsorted arrays or small arrays
   */
  static linearSearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      for (let i = 0; i < arr.length; i++) {
        metrics.comparisons++;
        if (compare(arr[i], target) === 0) {
          return { index: i, element: arr[i] };
        }
      }
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Binary Search - O(log n) time complexity
   * Requires sorted array
   */
  static binarySearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        metrics.comparisons++;
        
        const comparison = compare(arr[mid], target);
        
        if (comparison === 0) {
          return { index: mid, element: arr[mid] };
        } else if (comparison < 0) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Binary Search with first occurrence
   */
  static binarySearchFirst<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let left = 0;
      let right = arr.length - 1;
      let result = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        metrics.comparisons++;
        
        const comparison = compare(arr[mid], target);
        
        if (comparison === 0) {
          result = mid;
          right = mid - 1; // Continue searching left for first occurrence
        } else if (comparison < 0) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      return result !== -1 ? { index: result, element: arr[result] } : { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Binary Search with last occurrence
   */
  static binarySearchLast<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let left = 0;
      let right = arr.length - 1;
      let result = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        metrics.comparisons++;
        
        const comparison = compare(arr[mid], target);
        
        if (comparison === 0) {
          result = mid;
          left = mid + 1; // Continue searching right for last occurrence
        } else if (comparison < 0) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      return result !== -1 ? { index: result, element: arr[result] } : { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Interpolation Search - O(log log n) average case
   * Best for uniformly distributed sorted arrays
   */
  static interpolationSearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right && compare(arr[left], target) <= 0 && compare(arr[right], target) >= 0) {
        metrics.comparisons++;
        
        // Avoid division by zero
        if (left === right) {
          if (compare(arr[left], target) === 0) {
            return { index: left, element: arr[left] };
          }
          return { index: -1 };
        }

        // Interpolation formula
        const pos = left + Math.floor(
          ((right - left) * (compare(target, arr[left]))) / 
          (compare(arr[right], arr[left]))
        );

        metrics.comparisons++;
        const comparison = compare(arr[pos], target);
        
        if (comparison === 0) {
          return { index: pos, element: arr[pos] };
        } else if (comparison < 0) {
          left = pos + 1;
        } else {
          right = pos - 1;
        }
      }
      
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Exponential Search - O(log n) time complexity
   * Good for unbounded searches
   */
  static exponentialSearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      if (arr.length === 0) return { index: -1 };
      
      // If first element is the target
      metrics.comparisons++;
      if (compare(arr[0], target) === 0) {
        return { index: 0, element: arr[0] };
      }

      // Find range for binary search
      let i = 1;
      while (i < arr.length && compare(arr[i], target) <= 0) {
        metrics.comparisons++;
        i = i * 2;
      }

      // Binary search in the found range
      return this.binarySearchRange(arr, target, Math.floor(i / 2), Math.min(i, arr.length - 1), compare, metrics);
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Jump Search - O(√n) time complexity
   * Good for sorted arrays, especially when jumping is faster than binary search
   */
  static jumpSearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      const n = arr.length;
      if (n === 0) return { index: -1 };

      const step = Math.floor(Math.sqrt(n));
      let prev = 0;

      // Finding the block where element is present
      while (prev < n && compare(arr[Math.min(step, n) - 1], target) < 0) {
        metrics.comparisons++;
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return { index: -1 };
      }

      // Linear search in the identified block
      while (prev < Math.min(step, n)) {
        metrics.comparisons++;
        if (compare(arr[prev], target) === 0) {
          return { index: prev, element: arr[prev] };
        }
        prev++;
      }
      
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Fibonacci Search - O(log n) time complexity
   * Uses Fibonacci numbers to divide array
   */
  static fibonacciSearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      const n = arr.length;
      if (n === 0) return { index: -1 };

      // Initialize Fibonacci numbers
      let fib2 = 0; // (k-2)th Fibonacci number
      let fib1 = 1; // (k-1)th Fibonacci number
      let fib = fib1 + fib2; // kth Fibonacci number

      // Find the smallest Fibonacci number greater than or equal to n
      while (fib < n) {
        fib2 = fib1;
        fib1 = fib;
        fib = fib1 + fib2;
      }

      let offset = -1;

      while (fib > 1) {
        const i = Math.min(offset + fib2, n - 1);
        metrics.comparisons++;
        
        const comparison = compare(arr[i], target);
        
        if (comparison < 0) {
          fib = fib1;
          fib1 = fib2;
          fib2 = fib - fib1;
          offset = i;
        } else if (comparison > 0) {
          fib = fib2;
          fib1 = fib1 - fib2;
          fib2 = fib - fib1;
        } else {
          return { index: i, element: arr[i] };
        }
      }

      // Compare last element
      if (fib1 && offset < n - 1) {
        metrics.comparisons++;
        if (compare(arr[offset + 1], target) === 0) {
          return { index: offset + 1, element: arr[offset + 1] };
        }
      }
      
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Ternary Search - O(log3 n) time complexity
   * Divides array into three parts
   */
  static ternarySearch<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);

        metrics.comparisons++;
        if (compare(arr[mid1], target) === 0) {
          return { index: mid1, element: arr[mid1] };
        }

        metrics.comparisons++;
        if (compare(arr[mid2], target) === 0) {
          return { index: mid2, element: arr[mid2] };
        }

        metrics.comparisons++;
        if (compare(arr[mid1], target) > 0) {
          right = mid1 - 1;
        } else if (compare(arr[mid2], target) < 0) {
          left = mid2 + 1;
        } else {
          left = mid1 + 1;
          right = mid2 - 1;
        }
      }
      
      return { index: -1 };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }

  /**
   * Helper method for binary search in a range
   */
  private static binarySearchRange<T>(
    arr: T[],
    target: T,
    left: number,
    right: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): { index: number; element?: T } {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      metrics.comparisons++;
      
      const comparison = compare(arr[mid], target);
      
      if (comparison === 0) {
        return { index: mid, element: arr[mid] };
      } else if (comparison < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    return { index: -1 };
  }

  /**
   * Find all occurrences of an element
   */
  static findAllOccurrences<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): { indices: number[]; metrics: SortMetrics } {
    validateArray(arr);
    
    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      const indices: number[] = [];
      
      for (let i = 0; i < arr.length; i++) {
        metrics.comparisons++;
        if (compare(arr[i], target) === 0) {
          indices.push(i);
        }
      }
      
      return indices;
    }, metrics);

    return {
      indices: result,
      metrics
    };
  }

  /**
   * Find the closest element to target
   */
  static findClosest<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ): SearchResult<T> {
    validateArray(arr);
    
    if (arr.length === 0) {
      return {
        index: -1,
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 },
        comparisons: 0,
        executionTime: 0
      };
    }

    const metrics: SortMetrics = { comparisons: 0, swaps: 0, executionTime: 0 };
    const compare = createCompareFunction(options);

    const result = measurePerformance(() => {
      let closestIndex = 0;
      let minDifference = Math.abs(compare(arr[0], target));

      for (let i = 1; i < arr.length; i++) {
        metrics.comparisons++;
        const difference = Math.abs(compare(arr[i], target));
        
        if (difference < minDifference) {
          minDifference = difference;
          closestIndex = i;
        }
      }
      
      return { index: closestIndex, element: arr[closestIndex] };
    }, metrics);

    return {
      index: result.index,
      element: result.element,
      metrics,
      comparisons: metrics.comparisons,
      executionTime: metrics.executionTime
    };
  }
} 