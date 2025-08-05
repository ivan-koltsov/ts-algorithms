# TypeScript Sorting Algorithms

A high-performance sorting algorithms library implemented in TypeScript for Node.js, featuring optimized implementations of the most efficient sorting algorithms.

## 🚀 Features

- **Multiple Algorithms**: QuickSort, MergeSort, HeapSort, TimSort, IntroSort, and RadixSort
- **Performance Optimized**: Each algorithm includes optimizations for real-world performance
- **TypeScript Support**: Full type safety and IntelliSense support
- **Performance Metrics**: Detailed metrics including comparisons, swaps, and execution time
- **Flexible API**: Support for custom comparison functions, in-place sorting, and more
- **Auto-Selection**: Intelligent algorithm selection based on data characteristics
- **Comprehensive Testing**: Full test suite with edge cases and performance tests

## 📦 Installation

```bash
npm install ts-algorithms
```

## 🎯 Quick Start

```typescript
import { Sort } from 'ts-algorithms';

// Basic usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const result = Sort.sort(numbers, 'quickSort');

console.log(result.result); // [11, 12, 22, 25, 34, 64, 90]
console.log(result.metrics); // { comparisons: 12, swaps: 8, executionTime: 0.123 }
```

## 🔧 API Reference

### Main Sort Class

#### `Sort.sort<T>(arr: T[], algorithm?: AlgorithmType, options?: SortOptions<T>): SortResult<T>`

Sorts an array using the specified algorithm.

```typescript
// Basic usage
const result = Sort.sort([3, 1, 4, 1, 5], 'quickSort');

// With options
const result = Sort.sort([3, 1, 4, 1, 5], 'mergeSort', {
  descending: true,
  inPlace: false,
  compare: (a, b) => a - b
});
```

#### `Sort.autoSort<T>(arr: T[], options?: SortOptions<T>): SortResult<T>`

Automatically selects the best algorithm based on array characteristics.

```typescript
const result = Sort.autoSort([3, 1, 4, 1, 5]);
```

#### `Sort.benchmark<T>(arr: T[], options?: SortOptions<T>): Record<AlgorithmType, SortResult<T>>`

Runs all algorithms on the same data and returns performance comparison.

```typescript
const results = Sort.benchmark([3, 1, 4, 1, 5]);
console.log(results.quickSort.metrics.executionTime);
console.log(results.mergeSort.metrics.executionTime);
```

#### `Sort.getFastest<T>(arr: T[], options?: SortOptions<T>): { algorithm: AlgorithmType, result: SortResult<T> }`

Finds the fastest algorithm for the given data.

```typescript
const fastest = Sort.getFastest([3, 1, 4, 1, 5]);
console.log(`Fastest: ${fastest.algorithm}`);
```

### Individual Algorithm Classes

Each algorithm can be used directly:

```typescript
import { QuickSort, MergeSort, HeapSort, TimSort, IntroSort, RadixSort } from 'ts-algorithms';

// QuickSort
const result = QuickSort.sort([3, 1, 4, 1, 5]);

// MergeSort with bottom-up variant
const result = MergeSort.sortBottomUp([3, 1, 4, 1, 5]);

// HeapSort with priority queue
const pq = HeapSort.createPriorityQueue<number>();
pq.enqueue(3);
pq.enqueue(1);
pq.enqueue(4);

// TimSort (optimized for real-world data)
const result = TimSort.sort([3, 1, 4, 1, 5]);

// IntroSort (hybrid algorithm)
const result = IntroSort.sort([3, 1, 4, 1, 5]);

// RadixSort for integers
const result = RadixSort.sort([170, 45, 75, 90, 802, 24, 2, 66]);

// RadixSort for strings
const result = RadixSort.sortStrings(['banana', 'apple', 'cherry', 'date']);

// RadixSort for floats
const result = RadixSort.sortFloats([3.14, 1.41, 2.71, 0.58, 1.73]);
```

## 🎨 Usage Examples

### Basic Sorting

```typescript
import { Sort } from 'ts-algorithms';

// Sort numbers
const numbers = [64, 34, 25, 12, 22, 11, 90];
const result = Sort.sort(numbers, 'quickSort');
console.log(result.result); // [11, 12, 22, 25, 34, 64, 90]

// Sort strings
const strings = ['banana', 'apple', 'cherry', 'date'];
const result = Sort.sort(strings, 'mergeSort', { 
  compare: (a, b) => a.localeCompare(b) 
});
console.log(result.result); // ['apple', 'banana', 'cherry', 'date']

// Sort objects
interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];

const result = Sort.sort(people, 'heapSort', {
  compare: (a, b) => a.age - b.age
});
console.log(result.result);
// [
//   { name: 'Bob', age: 25 },
//   { name: 'Alice', age: 30 },
//   { name: 'Charlie', age: 35 }
// ]
```

### Advanced Options

```typescript
import { Sort } from 'ts-algorithms';

const numbers = [64, 34, 25, 12, 22, 11, 90];

// Sort in descending order
const result = Sort.sort(numbers, 'quickSort', { descending: true });
console.log(result.result); // [90, 64, 34, 25, 22, 12, 11]

// Sort in place (modifies original array)
const result = Sort.sort(numbers, 'mergeSort', { inPlace: true });
console.log(result.result === numbers); // true

// Custom comparison function
const result = Sort.sort(numbers, 'heapSort', {
  compare: (a, b) => b - a // Reverse order
});
```

### Performance Analysis

```typescript
import { Sort } from 'ts-algorithms';

const largeArray = Array.from({ length: 10000 }, () => Math.random());

// Get detailed metrics
const result = Sort.sort(largeArray, 'timSort');
console.log(`Execution time: ${result.metrics.executionTime}ms`);
console.log(`Comparisons: ${result.metrics.comparisons}`);
console.log(`Swaps: ${result.metrics.swaps}`);
console.log(`Memory usage: ${result.metrics.memoryUsage} bytes`);

// Compare all algorithms
const benchmark = Sort.benchmark(largeArray);
for (const [algorithm, result] of Object.entries(benchmark)) {
  console.log(`${algorithm}: ${result.metrics.executionTime}ms`);
}

// Find the fastest
const fastest = Sort.getFastest(largeArray);
console.log(`Fastest algorithm: ${fastest.algorithm}`);
```

### Specialized Sorting

```typescript
import { RadixSort } from 'ts-algorithms';

// Sort integers with RadixSort (linear time for bounded digits)
const integers = [170, 45, 75, 90, 802, 24, 2, 66];
const result = RadixSort.sort(integers, { base: 10 });
console.log(result.result); // [2, 24, 45, 66, 75, 90, 170, 802]

// Sort strings with RadixSort
const strings = ['banana', 'apple', 'cherry', 'date'];
const result = RadixSort.sortStrings(strings);
console.log(result.result); // ['apple', 'banana', 'cherry', 'date']

// Sort floats with RadixSort
const floats = [3.14, 1.41, 2.71, 0.58, 1.73];
const result = RadixSort.sortFloats(floats, { precision: 2 });
console.log(result.result); // [0.58, 1.41, 1.73, 2.71, 3.14]
```

## 🏃‍♂️ Performance Characteristics

| Algorithm | Average Time | Worst Time | Space | Stable | In-Place |
|-----------|-------------|------------|-------|--------|----------|
| QuickSort | O(n log n) | O(n²) | O(log n) | No | Yes |
| MergeSort | O(n log n) | O(n log n) | O(n) | Yes | No |
| HeapSort | O(n log n) | O(n log n) | O(1) | No | Yes |
| TimSort | O(n log n) | O(n log n) | O(n) | Yes | No |
| IntroSort | O(n log n) | O(n log n) | O(log n) | No | Yes |
| RadixSort | O(d(n+k)) | O(d(n+k)) | O(n+k) | Yes | No |

### Algorithm Selection Guide

- **QuickSort**: Best average case, good for general-purpose sorting
- **MergeSort**: Guaranteed O(n log n), stable, good for linked lists
- **HeapSort**: In-place, guaranteed O(n log n), good for embedded systems
- **TimSort**: Optimized for real-world data, used by Python and Java
- **IntroSort**: Hybrid algorithm, combines best of QuickSort, HeapSort, and InsertionSort
- **RadixSort**: Linear time for integers with bounded digits

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Benchmarking

```bash
# Run comprehensive benchmark
npm run benchmark
```

This will test all algorithms on various data types and sizes, providing detailed performance analysis.

## 🔧 Configuration

```typescript
import { Sort } from 'ts-algorithms';

// Configure algorithm parameters
Sort.configure({
  insertionSortThreshold: 10,  // Threshold for switching to insertion sort
  maxDepth: 32,               // Maximum depth for IntroSort
  minRun: 32,                 // Minimum run length for TimSort
  radixBase: 10               // Base for RadixSort
});
```

## 📈 Performance Tips

1. **Use Auto-Sort**: Let the library choose the best algorithm automatically
2. **Consider Data Type**: Use RadixSort for integers with small ranges
3. **Use In-Place Sorting**: When memory is limited, use algorithms that support in-place sorting
4. **Benchmark Your Data**: Use `Sort.benchmark()` to find the fastest algorithm for your specific data
5. **Consider Stability**: Use stable algorithms (MergeSort, TimSort) when preserving order is important

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the sorting algorithms used in Python, Java, and C++ STL
- Performance optimizations based on research in algorithm engineering
- Test data generation patterns from various algorithm textbooks
