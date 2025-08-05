/**
 * Comparison function type for sorting algorithms
 * @param a First element to compare
 * @param b Second element to compare
 * @returns Negative if a < b, 0 if a === b, positive if a > b
 */
export type CompareFunction<T> = (a: T, b: T) => number;

/**
 * Options for sorting algorithms
 */
export interface SortOptions<T> {
  /** Custom comparison function */
  compare?: CompareFunction<T>;
  /** Whether to sort in descending order (default: false) */
  descending?: boolean;
  /** Whether to preserve original array (default: false) */
  inPlace?: boolean;
}

/**
 * Performance metrics for sorting algorithms
 */
export interface SortMetrics {
  /** Number of comparisons performed */
  comparisons: number;
  /** Number of swaps performed */
  swaps: number;
  /** Execution time in milliseconds */
  executionTime: number;
  /** Memory usage in bytes */
  memoryUsage?: number;
}

/**
 * Result of sorting operation
 */
export interface SortResult<T> {
  /** Sorted array */
  result: T[];
  /** Performance metrics */
  metrics: SortMetrics;
}

/**
 * Algorithm types available
 */
export type AlgorithmType = 
  | 'quickSort'
  | 'mergeSort'
  | 'heapSort'
  | 'timSort'
  | 'introSort'
  | 'radixSort'
  | 'insertionSort'
  | 'selectionSort'
  | 'bubbleSort';

/**
 * Configuration for specific algorithms
 */
export interface AlgorithmConfig {
  /** Threshold for switching to insertion sort in hybrid algorithms */
  insertionSortThreshold?: number;
  /** Maximum depth for introSort before switching to heapSort */
  maxDepth?: number;
  /** Run length for timSort */
  minRun?: number;
  /** Base for radix sort (default: 10) */
  radixBase?: number;
} 