# TypeScript Sorting & Search Algorithms

A high-performance sorting and search algorithms library implemented in TypeScript for Node.js, featuring optimized implementations of the most efficient algorithms.

## 🚀 Features

### Sorting Algorithms
- **Multiple Algorithms**: QuickSort, MergeSort, HeapSort, TimSort, IntroSort, and RadixSort
- **Performance Optimized**: Each algorithm includes optimizations for real-world performance
- **TypeScript Support**: Full type safety and IntelliSense support
- **Performance Metrics**: Detailed metrics including comparisons, swaps, and execution time
- **Flexible API**: Support for custom comparison functions, in-place sorting, and more
- **Auto-Selection**: Intelligent algorithm selection based on data characteristics

### Search Algorithms
- **Array Search**: Linear, Binary, Interpolation, Exponential, Jump, Fibonacci, and Ternary search
- **Hash-Based**: HashTable, HashSet, and HashMap implementations with collision resolution
- **Tree-Based**: Binary Search Tree, AVL Tree, and B-Tree implementations
- **Performance Optimized**: Each algorithm optimized for specific use cases
- **Comprehensive Testing**: Full test suite with edge cases and performance tests

## 📦 Installation

```bash
npm install ts-algorithms
```

## 🎯 Quick Start

### Sorting

```typescript
import { Sort } from 'ts-algorithms';

// Basic usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const result = Sort.sort(numbers, 'quickSort');

console.log(result.result); // [11, 12, 22, 25, 34, 64, 90]
console.log(result.metrics); // { comparisons: 12, swaps: 8, executionTime: 0.123 }
```

### Searching

```typescript
import { Search, SearchAlgorithms } from 'ts-algorithms';

// Basic search
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = Search.binarySearch(arr, 5);

console.log(result.index); // 4
console.log(result.element); // 5

// Auto-select best search algorithm
const autoResult = SearchAlgorithms.search(arr, 5);
```

## 🔧 API Reference

### Sorting

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

### Searching

#### `Search.linearSearch<T>(arr: T[], target: T, options?: SortOptions<T>): SearchResult<T>`

Linear search - O(n) time complexity, best for unsorted arrays.

```typescript
const result = Search.linearSearch([64, 34, 25, 12, 22, 11, 90], 25);
console.log(result.index); // 2
```

#### `Search.binarySearch<T>(arr: T[], target: T, options?: SortOptions<T>): SearchResult<T>`

Binary search - O(log n) time complexity, requires sorted array.

```typescript
const result = Search.binarySearch([11, 12, 22, 25, 34, 64, 90], 25);
console.log(result.index); // 3
```

#### `SearchAlgorithms.search<T>(arr: T[], target: T, options?: SortOptions<T>): SearchResult<T>`

Auto-selects the best search algorithm based on array characteristics.

```typescript
const result = SearchAlgorithms.search([1, 2, 3, 4, 5], 3);
```

### Hash-Based Data Structures

#### `HashTable<K, V>`

Generic hash table implementation with collision resolution.

```typescript
import { HashTable } from 'ts-algorithms';

const hashTable = new HashTable<string, number>();
hashTable.put('apple', 1);
hashTable.put('banana', 2);

console.log(hashTable.get('apple')); // 1
console.log(hashTable.has('banana')); // true
```

#### `HashSet<T>`

Set implementation using hash table.

```typescript
import { HashSet } from 'ts-algorithms';

const set = new HashSet<number>();
set.add(1);
set.add(2);
set.add(3);

console.log(set.has(1)); // true
console.log(set.size()); // 3
```

#### `HashMap<K, V>`

Map implementation using hash table.

```typescript
import { HashMap } from 'ts-algorithms';

const map = new HashMap<string, number>();
map.set('apple', 1);
map.set('banana', 2);

console.log(map.get('apple')); // 1
console.log(map.has('banana')); // true
```

### Tree-Based Data Structures

#### `BinarySearchTree<T>`

Binary search tree implementation.

```typescript
import { BinarySearchTree } from 'ts-algorithms';

const bst = new BinarySearchTree<number>();
bst.insert(50);
bst.insert(30);
bst.insert(70);

console.log(bst.search(30)); // 30
console.log(bst.min()); // 30
console.log(bst.max()); // 70
```

#### `AVLTree<T>`

Self-balancing AVL tree implementation.

```typescript
import { AVLTree } from 'ts-algorithms';

const avl = new AVLTree<number>();
avl.insert(10);
avl.insert(20);
avl.insert(30);

console.log(avl.search(20)); // 20
```

#### `BTree<T>`

B-tree implementation for large datasets.

```typescript
import { BTree } from 'ts-algorithms';

const btree = new BTree<number>();
btree.insert(10);
btree.insert(20);
btree.insert(30);

console.log(btree.search(20)); // 20
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

### Advanced Sorting Options

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

### Search Examples

```typescript
import { Search, SearchAlgorithms } from 'ts-algorithms';

// Linear search for unsorted arrays
const unsorted = [64, 34, 25, 12, 22, 11, 90];
const result = Search.linearSearch(unsorted, 25);
console.log(result.index); // 2

// Binary search for sorted arrays
const sorted = [11, 12, 22, 25, 34, 64, 90];
const result = Search.binarySearch(sorted, 25);
console.log(result.index); // 3

// Auto-select best search algorithm
const result = SearchAlgorithms.search(sorted, 25);
console.log(result.index); // 3

// Find all occurrences
const duplicates = [1, 2, 2, 2, 3, 4, 5];
const result = Search.findAllOccurrences(duplicates, 2);
console.log(result.indices); // [1, 2, 3]

// Find closest element
const numbers = [1, 3, 5, 7, 9];
const result = Search.findClosest(numbers, 4);
console.log(result.element); // 3
```

### Hash Table Examples

```typescript
import { HashTable, HashSet, HashMap } from 'ts-algorithms';

// Hash Table
const hashTable = new HashTable<string, number>();
hashTable.put('apple', 1);
hashTable.put('banana', 2);
hashTable.put('cherry', 3);

console.log(hashTable.get('apple')); // 1
console.log(hashTable.has('banana')); // true
console.log(hashTable.remove('apple')); // true

// Hash Set
const set = new HashSet<number>();
set.add(1);
set.add(2);
set.add(3);

console.log(set.has(1)); // true
console.log(set.size()); // 3

// Set operations
const set1 = new HashSet<number>();
const set2 = new HashSet<number>();

set1.add(1);
set1.add(2);
set1.add(3);

set2.add(2);
set2.add(3);
set2.add(4);

const union = set1.union(set2);
const intersection = set1.intersection(set2);
const difference = set1.difference(set2);

// Hash Map
const map = new HashMap<string, number>();
map.set('apple', 1);
map.set('banana', 2);

console.log(map.get('apple')); // 1
console.log(map.has('banana')); // true
console.log(map.delete('apple')); // true
```

### Tree Examples

```typescript
import { BinarySearchTree, AVLTree, BTree } from 'ts-algorithms';

// Binary Search Tree
const bst = new BinarySearchTree<number>();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);

console.log(bst.search(30)); // 30
console.log(bst.min()); // 20
console.log(bst.max()); // 70

const inorder = bst.inorder();
console.log(inorder); // [20, 30, 40, 50, 70]

// AVL Tree (self-balancing)
const avl = new AVLTree<number>();
avl.insert(10);
avl.insert(20);
avl.insert(30);
avl.insert(40);
avl.insert(50);

console.log(avl.search(30)); // 30

// B-Tree
const btree = new BTree<number>();
btree.insert(10);
btree.insert(20);
btree.insert(30);
btree.insert(40);
btree.insert(50);

console.log(btree.search(30)); // 30
```

### Performance Analysis

```typescript
import { Sort, SearchAlgorithms } from 'ts-algorithms';

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

// Search benchmark
const searchBenchmark = SearchAlgorithms.benchmark(largeArray, largeArray[5000]);
for (const [algorithm, result] of Object.entries(searchBenchmark)) {
  console.log(`${algorithm}: ${result.metrics.executionTime}ms`);
}
```

## 🏃‍♂️ Performance Characteristics

### Sorting Algorithms

| Algorithm | Average Time | Worst Time | Space | Stable | In-Place |
|-----------|-------------|------------|-------|--------|----------|
| QuickSort | O(n log n) | O(n²) | O(log n) | No | Yes |
| MergeSort | O(n log n) | O(n log n) | O(n) | Yes | No |
| HeapSort | O(n log n) | O(n log n) | O(1) | No | Yes |
| TimSort | O(n log n) | O(n log n) | O(n) | Yes | No |
| IntroSort | O(n log n) | O(n log n) | O(log n) | No | Yes |
| RadixSort | O(d(n+k)) | O(d(n+k)) | O(n+k) | Yes | No |

### Search Algorithms

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| Linear Search | O(n) | O(1) | Small arrays, unsorted data |
| Binary Search | O(log n) | O(1) | Sorted arrays |
| Interpolation Search | O(log log n) | O(1) | Uniformly distributed sorted arrays |
| Exponential Search | O(log n) | O(1) | Unbounded searches |
| Jump Search | O(√n) | O(1) | Sorted arrays, when jumping is fast |
| Fibonacci Search | O(log n) | O(1) | Sorted arrays, cache-friendly |
| Ternary Search | O(log₃ n) | O(1) | Sorted arrays, three-way division |
| Hash Table | O(1) average | O(n) | Key-value lookups |
| Binary Search Tree | O(log n) | O(n) | Dynamic data, range queries |
| AVL Tree | O(log n) | O(n) | Self-balancing, guaranteed height |
| B-Tree | O(log n) | O(n) | Large datasets, disk-based storage |

### Algorithm Selection Guide

#### Sorting
- **QuickSort**: Best average case, good for general-purpose sorting
- **MergeSort**: Guaranteed O(n log n), stable, good for linked lists
- **HeapSort**: In-place, guaranteed O(n log n), good for embedded systems
- **TimSort**: Optimized for real-world data, used by Python and Java
- **IntroSort**: Hybrid algorithm, combines best of QuickSort, HeapSort, and InsertionSort
- **RadixSort**: Linear time for integers with bounded digits

#### Searching
- **Linear Search**: Best for small arrays or unsorted data
- **Binary Search**: Best for sorted arrays, guaranteed O(log n)
- **Interpolation Search**: Best for uniformly distributed sorted arrays
- **Hash Table**: Best for key-value lookups, O(1) average case
- **Binary Search Tree**: Good for dynamic data with range queries
- **AVL Tree**: Self-balancing, guaranteed height for consistent performance
- **B-Tree**: Best for large datasets and disk-based storage

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

### Sorting
1. **Use Auto-Sort**: Let the library choose the best algorithm automatically
2. **Consider Data Type**: Use RadixSort for integers with small ranges
3. **Use In-Place Sorting**: When memory is limited, use algorithms that support in-place sorting
4. **Benchmark Your Data**: Use `Sort.benchmark()` to find the fastest algorithm for your specific data
5. **Consider Stability**: Use stable algorithms (MergeSort, TimSort) when preserving order is important

### Searching
1. **Use Auto-Search**: Let the library choose the best search algorithm automatically
2. **Consider Data Structure**: Use hash tables for frequent lookups, trees for range queries
3. **Sort When Possible**: Binary search is much faster than linear search for large arrays
4. **Use Appropriate Data Structures**: Hash tables for O(1) lookups, trees for ordered data
5. **Benchmark Your Use Case**: Use `SearchAlgorithms.benchmark()` to find the fastest algorithm

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
- Hash table implementations based on industry best practices
- Tree structures optimized for real-world performance characteristics
