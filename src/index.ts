// Core types and interfaces
export * from './types';

// Utility functions
export * from './utils';

// Sorting algorithms
export { QuickSort } from './algorithms/quickSort';
export { MergeSort } from './algorithms/mergeSort';
export { HeapSort } from './algorithms/heapSort';
export { TimSort } from './algorithms/timSort';
export { IntroSort } from './algorithms/introSort';
export { RadixSort } from './algorithms/radixSort';

// Search algorithms
export { Search } from './algorithms/search';
export { HashTable, HashSet, HashMap } from './algorithms/hashTable';
export { BinarySearchTree, AVLTree, BTree } from './algorithms/treeSearch';

// Main sorting class that provides a unified interface
import { AlgorithmType, SortOptions, SortResult, AlgorithmConfig } from './types';
import { QuickSort } from './algorithms/quickSort';
import { MergeSort } from './algorithms/mergeSort';
import { HeapSort } from './algorithms/heapSort';
import { TimSort } from './algorithms/timSort';
import { IntroSort } from './algorithms/introSort';
import { RadixSort } from './algorithms/radixSort';

/**
 * Main sorting class that provides a unified interface for all sorting algorithms
 */
export class Sort {
  private static config: AlgorithmConfig = {
    insertionSortThreshold: 10,
    maxDepth: 32,
    minRun: 32,
    radixBase: 10
  };

  /**
   * Configure algorithm parameters
   */
  static configure(config: Partial<AlgorithmConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Sort an array using the specified algorithm
   */
  static sort<T>(
    arr: T[],
    algorithm: AlgorithmType = 'quickSort',
    options: SortOptions<T> = {}
  ): SortResult<T> {
    switch (algorithm) {
      case 'quickSort':
        return QuickSort.sort(arr, options);
      
      case 'mergeSort':
        return MergeSort.sort(arr, options);
      
      case 'heapSort':
        return HeapSort.sort(arr, options);
      
      case 'timSort':
        return TimSort.sort(arr, options);
      
      case 'introSort':
        return IntroSort.sort(arr, options);
      
      case 'radixSort':
        if (typeof arr[0] === 'number') {
          return RadixSort.sort(arr as number[], { ...options, base: this.config.radixBase });
        }
        throw new Error('RadixSort is only supported for numbers');
      
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }

  /**
   * Sort numbers using the most appropriate algorithm
   */
  static sortNumbers(
    arr: number[],
    options: SortOptions<number> = {}
  ): SortResult<number> {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min;
    
    // Use RadixSort for integers with small range
    if (Number.isInteger(max) && Number.isInteger(min) && range < arr.length * 10) {
      return RadixSort.sort(arr, { ...options, base: this.config.radixBase });
    }
    
    // Use QuickSort for general numbers
    return QuickSort.sort(arr, options);
  }

  /**
   * Sort strings using the most appropriate algorithm
   */
  static sortStrings(
    arr: string[],
    options: SortOptions<string> = {}
  ): SortResult<string> {
    // Use RadixSort for strings
    return RadixSort.sortStrings(arr, options);
  }

  /**
   * Sort objects by a specific key
   */
  static sortObjects<T, K extends keyof T>(
    arr: T[],
    key: K,
    options: SortOptions<T> = {}
  ): SortResult<T> {
    // Use QuickSort for objects
    return QuickSort.sort(arr, options);
  }

  /**
   * Auto-select the best algorithm based on array characteristics
   */
  static autoSort<T>(
    arr: T[],
    options: SortOptions<T> = {}
  ): SortResult<T> {
    if (arr.length <= 1) {
      return {
        result: [...arr],
        metrics: { comparisons: 0, swaps: 0, executionTime: 0 }
      };
    }

    // For small arrays, use insertion sort (handled by hybrid algorithms)
    if (arr.length <= 50) {
      return QuickSort.sort(arr, options);
    }

    // For large arrays, use TimSort (good for real-world data)
    if (arr.length > 10000) {
      return TimSort.sort(arr, options);
    }

    // For medium arrays, use IntroSort (guaranteed performance)
    return IntroSort.sort(arr, options);
  }

  /**
   * Get performance comparison of all algorithms
   */
  static benchmark<T>(
    arr: T[],
    options: SortOptions<T> = {}
  ): Record<AlgorithmType, SortResult<T>> {
    const algorithms: AlgorithmType[] = [
      'quickSort',
      'mergeSort', 
      'heapSort',
      'timSort',
      'introSort'
    ];

    const results: Record<AlgorithmType, SortResult<T>> = {} as any;

    for (const algorithm of algorithms) {
      try {
        results[algorithm] = this.sort(arr, algorithm, options);
      } catch (error) {
        console.warn(`Failed to run ${algorithm}:`, error);
      }
    }

    return results;
  }

  /**
   * Get the fastest algorithm for the given array
   */
  static getFastest<T>(
    arr: T[],
    options: SortOptions<T> = {}
  ): { algorithm: AlgorithmType; result: SortResult<T> } {
    const benchmark = this.benchmark(arr, options);
    
    let fastest: AlgorithmType = 'quickSort';
    let bestTime = Infinity;
    
    for (const [algorithm, result] of Object.entries(benchmark)) {
      if (result.metrics.executionTime < bestTime) {
        bestTime = result.metrics.executionTime;
        fastest = algorithm as AlgorithmType;
      }
    }
    
    return {
      algorithm: fastest,
      result: benchmark[fastest]
    };
  }
}

/**
 * Main search class that provides a unified interface for all search algorithms
 */
export class SearchAlgorithms {
  /**
   * Search in an array using the most appropriate algorithm
   */
  static search<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ) {
    // For sorted arrays, use binary search
    if (this.isSorted(arr, options)) {
      return Search.binarySearch(arr, target, options);
    }
    
    // For small arrays, use linear search
    if (arr.length <= 50) {
      return Search.linearSearch(arr, target, options);
    }
    
    // For large unsorted arrays, use hash table
    return this.searchWithHashTable(arr, target, options);
  }

  /**
   * Check if array is sorted
   */
  private static isSorted<T>(arr: T[], options: SortOptions<T> = {}): boolean {
    if (arr.length <= 1) return true;
    
    const compare = options.compare || ((a, b) => (a as any) - (b as any));
    
    for (let i = 1; i < arr.length; i++) {
      if (compare(arr[i - 1], arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Search using hash table
   */
  private static searchWithHashTable<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ) {
    const hashTable = new HashTable<T, number>();
    
    // Build hash table
    for (let i = 0; i < arr.length; i++) {
      hashTable.put(arr[i], i);
    }
    
    // Search in hash table
    const index = hashTable.get(target);
    
    if (index !== undefined) {
      return {
        index,
        element: arr[index],
        metrics: { comparisons: 1, swaps: 0, executionTime: 0 },
        comparisons: 1,
        executionTime: 0
      };
    }
    
    return {
      index: -1,
      metrics: { comparisons: 1, swaps: 0, executionTime: 0 },
      comparisons: 1,
      executionTime: 0
    };
  }

  /**
   * Get performance comparison of all search algorithms
   */
  static benchmark<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ) {
    const results: Record<string, any> = {};

    // Test linear search
    results.linearSearch = Search.linearSearch(arr, target, options);
    
    // Test binary search (only if sorted)
    if (this.isSorted(arr, options)) {
      results.binarySearch = Search.binarySearch(arr, target, options);
      results.interpolationSearch = Search.interpolationSearch(arr, target, options);
      results.exponentialSearch = Search.exponentialSearch(arr, target, options);
      results.jumpSearch = Search.jumpSearch(arr, target, options);
      results.fibonacciSearch = Search.fibonacciSearch(arr, target, options);
      results.ternarySearch = Search.ternarySearch(arr, target, options);
    }

    return results;
  }

  /**
   * Get the fastest search algorithm for the given data
   */
  static getFastest<T>(
    arr: T[],
    target: T,
    options: SortOptions<T> = {}
  ) {
    const benchmark = this.benchmark(arr, target, options);
    
    let fastest = 'linearSearch';
    let bestTime = Infinity;
    
    for (const [algorithm, result] of Object.entries(benchmark)) {
      if (result.metrics.executionTime < bestTime) {
        bestTime = result.metrics.executionTime;
        fastest = algorithm;
      }
    }
    
    return {
      algorithm: fastest,
      result: benchmark[fastest]
    };
  }
}

// Export the main classes as default
export default { Sort, SearchAlgorithms }; 