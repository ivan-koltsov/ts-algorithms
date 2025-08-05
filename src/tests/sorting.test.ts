import { 
  Sort, 
  QuickSort, 
  MergeSort, 
  HeapSort, 
  TimSort, 
  IntroSort, 
  RadixSort,
  generateRandomArray,
  generateSortedArray,
  generateReverseSortedArray,
  generateDuplicateArray,
  isSorted,
  defaultCompare,
  stringCompare,
  objectCompare
} from '../index';

describe('Sorting Algorithms', () => {
  const algorithms = ['quickSort', 'mergeSort', 'heapSort', 'timSort', 'introSort'] as const;

  describe('Basic Functionality', () => {
    test.each(algorithms)('%s should sort numbers correctly', (algorithm) => {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      const result = Sort.sort(arr, algorithm);
      
      expect(result.result).toEqual([11, 12, 22, 25, 34, 64, 90]);
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });

    test.each(algorithms)('%s should handle empty arrays', (algorithm) => {
      const arr: number[] = [];
      const result = Sort.sort(arr, algorithm);
      
      expect(result.result).toEqual([]);
      expect(result.metrics.comparisons).toBe(0);
      expect(result.metrics.swaps).toBe(0);
    });

    test.each(algorithms)('%s should handle single element arrays', (algorithm) => {
      const arr = [42];
      const result = Sort.sort(arr, algorithm);
      
      expect(result.result).toEqual([42]);
      expect(result.metrics.comparisons).toBe(0);
      expect(result.metrics.swaps).toBe(0);
    });

    test.each(algorithms)('%s should handle duplicate elements', (algorithm) => {
      const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
      const result = Sort.sort(arr, algorithm);
      
      expect(result.result).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });

    test.each(algorithms)('%s should handle negative numbers', (algorithm) => {
      const arr = [-5, 3, -1, 0, 2, -10, 7];
      const result = Sort.sort(arr, algorithm);
      
      expect(result.result).toEqual([-10, -5, -1, 0, 2, 3, 7]);
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });
  });

  describe('String Sorting', () => {
    test.each(algorithms)('%s should sort strings correctly', (algorithm) => {
      const arr = ['banana', 'apple', 'cherry', 'date'];
      const result = Sort.sort(arr, algorithm, { compare: stringCompare });
      
      expect(result.result).toEqual(['apple', 'banana', 'cherry', 'date']);
      expect(isSorted(result.result, stringCompare)).toBe(true);
    });

    test('RadixSort should sort strings correctly', () => {
      const arr = ['banana', 'apple', 'cherry', 'date'];
      const result = RadixSort.sortStrings(arr);
      
      expect(result.result).toEqual(['apple', 'banana', 'cherry', 'date']);
      expect(isSorted(result.result, stringCompare)).toBe(true);
    });
  });

  describe('Object Sorting', () => {
    interface Person {
      name: string;
      age: number;
    }

    test.each(algorithms)('%s should sort objects by key', (algorithm) => {
      const arr: Person[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 35 }
      ];
      
      const result = Sort.sort(arr, algorithm, { 
        compare: objectCompare<Person, 'age'>('age') 
      });
      
      expect(result.result).toEqual([
        { name: 'Bob', age: 25 },
        { name: 'Alice', age: 30 },
        { name: 'Charlie', age: 35 }
      ]);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large arrays', () => {
      const arr = generateRandomArray(1000);
      const result = Sort.sort(arr);
      
      expect(result.result.length).toBe(1000);
      expect(isSorted(result.result, defaultCompare)).toBe(true);
      expect(result.metrics.executionTime).toBeGreaterThan(0);
    });

    test('should handle already sorted arrays', () => {
      const arr = generateSortedArray(100);
      const result = Sort.sort(arr);
      
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });

    test('should handle reverse sorted arrays', () => {
      const arr = generateReverseSortedArray(100);
      const result = Sort.sort(arr);
      
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });

    test('should handle arrays with many duplicates', () => {
      const arr = generateDuplicateArray(1000, 10);
      const result = Sort.sort(arr);
      
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });
  });

  describe('RadixSort Specific Tests', () => {
    test('should sort integers correctly', () => {
      const arr = [170, 45, 75, 90, 802, 24, 2, 66];
      const result = RadixSort.sort(arr);
      
      expect(result.result).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
    });

    test('should handle negative integers', () => {
      const arr = [-170, 45, -75, 90, -802, 24, -2, 66];
      const result = RadixSort.sort(arr);
      
      expect(result.result).toEqual([-802, -170, -75, -2, 24, 45, 66, 90]);
    });

    test('should sort floats correctly', () => {
      const arr = [3.14, 1.41, 2.71, 0.58, 1.73];
      const result = RadixSort.sortFloats(arr, { precision: 2 });
      
      expect(result.result).toEqual([0.58, 1.41, 1.73, 2.71, 3.14]);
    });

    test('should sort strings with different lengths', () => {
      const arr = ['cat', 'dog', 'bird', 'elephant', 'ant'];
      const result = RadixSort.sortStrings(arr);
      
      expect(result.result).toEqual(['ant', 'bird', 'cat', 'dog', 'elephant']);
    });
  });

  describe('Sort Options', () => {
    test('should sort in descending order', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      const result = Sort.sort(arr, 'quickSort', { descending: true });
      
      expect(result.result).toEqual([90, 64, 34, 25, 22, 12, 11]);
    });

    test('should sort in place', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      const result = Sort.sort(arr, 'quickSort', { inPlace: true });
      
      expect(result.result).toBe(arr); // Same reference
      expect(result.result).toEqual([11, 12, 22, 25, 34, 64, 90]);
    });

    test('should use custom comparison function', () => {
      const arr = [1, 2, 3, 4, 5];
      const customCompare = (a: number, b: number) => b - a; // Reverse order
      const result = Sort.sort(arr, 'quickSort', { compare: customCompare });
      
      expect(result.result).toEqual([5, 4, 3, 2, 1]);
    });
  });

  describe('Auto Sort', () => {
    test('should auto-select appropriate algorithm for small arrays', () => {
      const arr = generateRandomArray(20);
      const result = Sort.autoSort(arr);
      
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });

    test('should auto-select appropriate algorithm for large arrays', () => {
      const arr = generateRandomArray(15000);
      const result = Sort.autoSort(arr);
      
      expect(isSorted(result.result, defaultCompare)).toBe(true);
    });
  });

  describe('Benchmark', () => {
    test('should run benchmark on all algorithms', () => {
      const arr = generateRandomArray(100);
      const results = Sort.benchmark(arr);
      
      expect(Object.keys(results)).toContain('quickSort');
      expect(Object.keys(results)).toContain('mergeSort');
      expect(Object.keys(results)).toContain('heapSort');
      expect(Object.keys(results)).toContain('timSort');
      expect(Object.keys(results)).toContain('introSort');
      
      // All results should be sorted
      for (const result of Object.values(results)) {
        expect(isSorted(result.result, defaultCompare)).toBe(true);
      }
    });

    test('should find fastest algorithm', () => {
      const arr = generateRandomArray(100);
      const fastest = Sort.getFastest(arr);
      
      expect(fastest.algorithm).toBeDefined();
      expect(isSorted(fastest.result.result, defaultCompare)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid input', () => {
      expect(() => Sort.sort(null as any)).toThrow();
      expect(() => Sort.sort(undefined as any)).toThrow();
    });

    test('should throw error for unknown algorithm', () => {
      const arr = [1, 2, 3];
      expect(() => Sort.sort(arr, 'unknown' as any)).toThrow();
    });

    test('should throw error for RadixSort with non-numbers', () => {
      const arr = ['a', 'b', 'c'];
      expect(() => Sort.sort(arr, 'radixSort')).toThrow();
    });
  });

  describe('Metrics', () => {
    test('should provide accurate metrics', () => {
      const arr = generateRandomArray(100);
      const result = Sort.sort(arr, 'quickSort');
      
      expect(result.metrics.comparisons).toBeGreaterThan(0);
      expect(result.metrics.swaps).toBeGreaterThan(0);
      expect(result.metrics.executionTime).toBeGreaterThan(0);
    });

    test('should provide memory usage when available', () => {
      const arr = generateRandomArray(1000);
      const result = Sort.sort(arr, 'mergeSort');
      
      // Memory usage might not be available in all environments
      if (result.metrics.memoryUsage !== undefined) {
        expect(result.metrics.memoryUsage).toBeGreaterThan(0);
      }
    });
  });
}); 