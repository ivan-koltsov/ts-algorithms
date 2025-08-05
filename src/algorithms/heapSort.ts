import { CompareFunction, SortMetrics, SortOptions, SortResult } from '../types';
import { 
  createCompareFunction, 
  prepareArray, 
  validateArray, 
  measurePerformance,
  swap
} from '../utils';

/**
 * HeapSort implementation with optimizations
 * 
 * Time Complexity: O(n log n) - guaranteed
 * Space Complexity: O(1) - in-place sorting
 * 
 * Advantages:
 * - In-place sorting
 * - Guaranteed O(n log n) performance
 * - Good for embedded systems
 * 
 * Optimizations:
 * - Bottom-up heap construction
 * - Optimized heapify
 */
export class HeapSort {
  /**
   * Sorts an array using HeapSort algorithm
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
      this.heapSort(array, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * HeapSort implementation
   */
  private static heapSort<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;

    // Build max heap (bottom-up approach)
    this.buildMaxHeap(arr, compare, metrics);

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      swap(arr, 0, i);
      metrics.swaps++;

      // Call max heapify on the reduced heap
      this.maxHeapify(arr, 0, i, compare, metrics);
    }
  }

  /**
   * Builds a max heap from an unsorted array
   */
  private static buildMaxHeap<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    
    // Start from the last non-leaf node and heapify each node
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.maxHeapify(arr, i, n, compare, metrics);
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
    const left = 2 * index + 1;
    const right = 2 * index + 2;

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
   * Optimized heapify using bottom-up approach
   */
  private static maxHeapifyBottomUp<T>(
    arr: T[],
    index: number,
    heapSize: number,
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    let current = index;
    
    while (true) {
      let largest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < heapSize) {
        metrics.comparisons++;
        if (compare(arr[left], arr[largest]) > 0) {
          largest = left;
        }
      }

      if (right < heapSize) {
        metrics.comparisons++;
        if (compare(arr[right], arr[largest]) > 0) {
          largest = right;
        }
      }

      if (largest === current) {
        break;
      }

      swap(arr, current, largest);
      metrics.swaps++;
      current = largest;
    }
  }

  /**
   * Builds max heap using bottom-up approach (more efficient)
   */
  private static buildMaxHeapBottomUp<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;
    
    // Start from the last non-leaf node
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.maxHeapifyBottomUp(arr, i, n, compare, metrics);
    }
  }

  /**
   * HeapSort with bottom-up heap construction
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
      this.heapSortBottomUp(array, compare, metrics);
      return array;
    }, metrics);

    return { result, metrics };
  }

  /**
   * HeapSort with bottom-up heap construction
   */
  private static heapSortBottomUp<T>(
    arr: T[],
    compare: CompareFunction<T>,
    metrics: SortMetrics
  ): void {
    const n = arr.length;

    // Build max heap using bottom-up approach
    this.buildMaxHeapBottomUp(arr, compare, metrics);

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      swap(arr, 0, i);
      metrics.swaps++;

      // Call max heapify on the reduced heap
      this.maxHeapifyBottomUp(arr, 0, i, compare, metrics);
    }
  }

  /**
   * Priority Queue implementation using heap
   */
  static createPriorityQueue<T>(compare: CompareFunction<T> = (a, b) => (a as any) - (b as any)) {
    return new PriorityQueue(compare);
  }
}

/**
 * Priority Queue implementation using heap
 */
class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: CompareFunction<T>;

  constructor(compare: CompareFunction<T>) {
    this.compare = compare;
  }

  /**
   * Inserts an element into the priority queue
   */
  enqueue(element: T): void {
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the highest priority element
   */
  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    
    const result = this.heap[0];
    const last = this.heap.pop()!;
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    
    return result;
  }

  /**
   * Returns the highest priority element without removing it
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * Returns the size of the priority queue
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Checks if the priority queue is empty
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Bubbles up an element to maintain heap property
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.compare(this.heap[index], this.heap[parentIndex]) <= 0) {
        break;
      }
      
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  /**
   * Bubbles down an element to maintain heap property
   */
  private bubbleDown(index: number): void {
    while (true) {
      let largest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[largest]) > 0) {
        largest = leftChild;
      }

      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[largest]) > 0) {
        largest = rightChild;
      }

      if (largest === index) {
        break;
      }

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
} 