import { 
  Search, 
  HashTable, 
  HashSet, 
  HashMap,
  BinarySearchTree,
  AVLTree,
  BTree,
  SearchAlgorithms,
  generateRandomArray,
  generateSortedArray,
  defaultCompare,
  stringCompare
} from '../index';

describe('Search Algorithms', () => {
  describe('Linear Search', () => {
    test('should find element in array', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      const result = Search.linearSearch(arr, 25);
      
      expect(result.index).toBe(2);
      expect(result.element).toBe(25);
      expect(result.comparisons).toBeGreaterThan(0);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90];
      const result = Search.linearSearch(arr, 100);
      
      expect(result.index).toBe(-1);
      expect(result.element).toBeUndefined();
    });

    test('should handle empty array', () => {
      const arr: number[] = [];
      const result = Search.linearSearch(arr, 5);
      
      expect(result.index).toBe(-1);
      expect(result.comparisons).toBe(0);
    });

    test('should handle single element array', () => {
      const arr = [42];
      const result = Search.linearSearch(arr, 42);
      
      expect(result.index).toBe(0);
      expect(result.element).toBe(42);
      expect(result.comparisons).toBe(1);
    });
  });

  describe('Binary Search', () => {
    test('should find element in sorted array', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.binarySearch(arr, 25);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(25);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.binarySearch(arr, 100);
      
      expect(result.index).toBe(-1);
      expect(result.element).toBeUndefined();
    });

    test('should find first occurrence', () => {
      const arr = [1, 2, 2, 2, 3, 4, 5];
      const result = Search.binarySearchFirst(arr, 2);
      
      expect(result.index).toBe(1);
      expect(result.element).toBe(2);
    });

    test('should find last occurrence', () => {
      const arr = [1, 2, 2, 2, 3, 4, 5];
      const result = Search.binarySearchLast(arr, 2);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(2);
    });
  });

  describe('Interpolation Search', () => {
    test('should find element in uniformly distributed array', () => {
      const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const result = Search.interpolationSearch(arr, 50);
      
      expect(result.index).toBe(4);
      expect(result.element).toBe(50);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const result = Search.interpolationSearch(arr, 55);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Exponential Search', () => {
    test('should find element in sorted array', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.exponentialSearch(arr, 25);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(25);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.exponentialSearch(arr, 100);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Jump Search', () => {
    test('should find element in sorted array', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.jumpSearch(arr, 25);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(25);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.jumpSearch(arr, 100);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Fibonacci Search', () => {
    test('should find element in sorted array', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.fibonacciSearch(arr, 25);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(25);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.fibonacciSearch(arr, 100);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Ternary Search', () => {
    test('should find element in sorted array', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.ternarySearch(arr, 25);
      
      expect(result.index).toBe(3);
      expect(result.element).toBe(25);
    });

    test('should return -1 for non-existent element', () => {
      const arr = [11, 12, 22, 25, 34, 64, 90];
      const result = Search.ternarySearch(arr, 100);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Find All Occurrences', () => {
    test('should find all occurrences of element', () => {
      const arr = [1, 2, 2, 2, 3, 4, 5];
      const result = Search.findAllOccurrences(arr, 2);
      
      expect(result.indices).toEqual([1, 2, 3]);
      expect(result.metrics.comparisons).toBe(7);
    });

    test('should return empty array for non-existent element', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = Search.findAllOccurrences(arr, 6);
      
      expect(result.indices).toEqual([]);
    });
  });

  describe('Find Closest', () => {
    test('should find closest element', () => {
      const arr = [1, 3, 5, 7, 9];
      const result = Search.findClosest(arr, 4);
      
      expect(result.index).toBe(1); // 3 is closest to 4
      expect(result.element).toBe(3);
    });

    test('should handle empty array', () => {
      const arr: number[] = [];
      const result = Search.findClosest(arr, 5);
      
      expect(result.index).toBe(-1);
    });
  });

  describe('Hash Table', () => {
    test('should insert and retrieve values', () => {
      const hashTable = new HashTable<string, number>();
      
      hashTable.put('apple', 1);
      hashTable.put('banana', 2);
      hashTable.put('cherry', 3);
      
      expect(hashTable.get('apple')).toBe(1);
      expect(hashTable.get('banana')).toBe(2);
      expect(hashTable.get('cherry')).toBe(3);
      expect(hashTable.get('orange')).toBeUndefined();
    });

    test('should handle collisions', () => {
      const hashTable = new HashTable<string, number>();
      
      // Force collisions by using similar keys
      hashTable.put('a', 1);
      hashTable.put('b', 2);
      hashTable.put('c', 3);
      
      expect(hashTable.get('a')).toBe(1);
      expect(hashTable.get('b')).toBe(2);
      expect(hashTable.get('c')).toBe(3);
    });

    test('should remove values', () => {
      const hashTable = new HashTable<string, number>();
      
      hashTable.put('apple', 1);
      hashTable.put('banana', 2);
      
      expect(hashTable.remove('apple')).toBe(true);
      expect(hashTable.get('apple')).toBeUndefined();
      expect(hashTable.get('banana')).toBe(2);
    });

    test('should check if key exists', () => {
      const hashTable = new HashTable<string, number>();
      
      hashTable.put('apple', 1);
      
      expect(hashTable.has('apple')).toBe(true);
      expect(hashTable.has('banana')).toBe(false);
    });

    test('should get all keys and values', () => {
      const hashTable = new HashTable<string, number>();
      
      hashTable.put('apple', 1);
      hashTable.put('banana', 2);
      hashTable.put('cherry', 3);
      
      expect(hashTable.keys()).toContain('apple');
      expect(hashTable.keys()).toContain('banana');
      expect(hashTable.keys()).toContain('cherry');
      expect(hashTable.keys()).toHaveLength(3);
      
      expect(hashTable.values()).toContain(1);
      expect(hashTable.values()).toContain(2);
      expect(hashTable.values()).toContain(3);
      expect(hashTable.values()).toHaveLength(3);
    });
  });

  describe('Hash Set', () => {
    test('should add and check elements', () => {
      const set = new HashSet<number>();
      
      set.add(1);
      set.add(2);
      set.add(3);
      
      expect(set.has(1)).toBe(true);
      expect(set.has(2)).toBe(true);
      expect(set.has(3)).toBe(true);
      expect(set.has(4)).toBe(false);
    });

    test('should remove elements', () => {
      const set = new HashSet<number>();
      
      set.add(1);
      set.add(2);
      
      expect(set.remove(1)).toBe(true);
      expect(set.has(1)).toBe(false);
      expect(set.has(2)).toBe(true);
    });

    test('should perform set operations', () => {
      const set1 = new HashSet<number>();
      const set2 = new HashSet<number>();
      
      set1.add(1);
      set1.add(2);
      set1.add(3);
      
      set2.add(2);
      set2.add(3);
      set2.add(4);
      
      const union = set1.union(set2);
      expect(union.values()).toContain(1);
      expect(union.values()).toContain(2);
      expect(union.values()).toContain(3);
      expect(union.values()).toContain(4);
      
      const intersection = set1.intersection(set2);
      expect(intersection.values()).toContain(2);
      expect(intersection.values()).toContain(3);
      expect(intersection.values()).not.toContain(1);
      expect(intersection.values()).not.toContain(4);
      
      const difference = set1.difference(set2);
      expect(difference.values()).toContain(1);
      expect(difference.values()).not.toContain(2);
      expect(difference.values()).not.toContain(3);
    });
  });

  describe('Hash Map', () => {
    test('should set and get values', () => {
      const map = new HashMap<string, number>();
      
      map.set('apple', 1);
      map.set('banana', 2);
      
      expect(map.get('apple')).toBe(1);
      expect(map.get('banana')).toBe(2);
      expect(map.get('orange')).toBeUndefined();
    });

    test('should check if key exists', () => {
      const map = new HashMap<string, number>();
      
      map.set('apple', 1);
      
      expect(map.has('apple')).toBe(true);
      expect(map.has('banana')).toBe(false);
    });

    test('should delete values', () => {
      const map = new HashMap<string, number>();
      
      map.set('apple', 1);
      map.set('banana', 2);
      
      expect(map.delete('apple')).toBe(true);
      expect(map.get('apple')).toBeUndefined();
      expect(map.get('banana')).toBe(2);
    });

    test('should get all entries', () => {
      const map = new HashMap<string, number>();
      
      map.set('apple', 1);
      map.set('banana', 2);
      
      const entries = map.entries();
      expect(entries).toContainEqual(['apple', 1]);
      expect(entries).toContainEqual(['banana', 2]);
      expect(entries).toHaveLength(2);
    });
  });

  describe('Binary Search Tree', () => {
    test('should insert and search values', () => {
      const bst = new BinarySearchTree<number>();
      
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      bst.insert(20);
      bst.insert(40);
      
      expect(bst.search(50)).toBeDefined();
      expect(bst.search(30)).toBeDefined();
      expect(bst.search(70)).toBeDefined();
      expect(bst.search(100)).toBeUndefined();
    });

    test('should delete values', () => {
      const bst = new BinarySearchTree<number>();
      
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      
      expect(bst.delete(30)).toBe(true);
      expect(bst.search(30)).toBeUndefined();
      expect(bst.search(50)).toBeDefined();
    });

    test('should get min and max values', () => {
      const bst = new BinarySearchTree<number>();
      
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      bst.insert(20);
      bst.insert(40);
      
      expect(bst.min()).toBe(20);
      expect(bst.max()).toBe(70);
    });

    test('should perform traversals', () => {
      const bst = new BinarySearchTree<number>();
      
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      bst.insert(20);
      bst.insert(40);
      
      const inorder = bst.inorder();
      expect(inorder).toEqual([20, 30, 40, 50, 70]);
      
      const preorder = bst.preorder();
      expect(preorder).toEqual([50, 30, 20, 40, 70]);
      
      const postorder = bst.postorder();
      expect(postorder).toEqual([20, 40, 30, 70, 50]);
    });
  });

  describe('AVL Tree', () => {
    test('should maintain balance after insertions', () => {
      const avl = new AVLTree<number>();
      
      avl.insert(10);
      avl.insert(20);
      avl.insert(30);
      avl.insert(40);
      avl.insert(50);
      avl.insert(25);
      
      expect(avl.search(10)).toBeDefined();
      expect(avl.search(20)).toBeDefined();
      expect(avl.search(30)).toBeDefined();
      expect(avl.search(40)).toBeDefined();
      expect(avl.search(50)).toBeDefined();
      expect(avl.search(25)).toBeDefined();
    });

    test('should perform inorder traversal', () => {
      const avl = new AVLTree<number>();
      
      avl.insert(10);
      avl.insert(20);
      avl.insert(30);
      
      const inorder = avl.inorder();
      expect(inorder).toEqual([10, 20, 30]);
    });
  });

  describe('B-Tree', () => {
    test('should insert and search values', () => {
      const btree = new BTree<number>();
      
      btree.insert(10);
      btree.insert(20);
      btree.insert(30);
      btree.insert(40);
      btree.insert(50);
      
      expect(btree.search(10)).toBe(10);
      expect(btree.search(20)).toBe(20);
      expect(btree.search(30)).toBe(30);
      expect(btree.search(40)).toBe(40);
      expect(btree.search(50)).toBe(50);
      expect(btree.search(60)).toBeUndefined();
    });

    test('should handle large number of insertions', () => {
      const btree = new BTree<number>();
      
      for (let i = 0; i < 100; i++) {
        btree.insert(i);
      }
      
      expect(btree.search(50)).toBe(50);
      expect(btree.search(99)).toBe(99);
      expect(btree.search(100)).toBeUndefined();
    });
  });

  describe('Search Algorithms Class', () => {
    test('should auto-select appropriate search algorithm', () => {
      const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const unsortedArr = [5, 2, 8, 1, 9, 3, 7, 4, 6, 10];
      
      const sortedResult = SearchAlgorithms.search(sortedArr, 5);
      const unsortedResult = SearchAlgorithms.search(unsortedArr, 5);
      
      expect(sortedResult.index).toBe(4);
      expect(unsortedResult.index).toBeGreaterThanOrEqual(0);
    });

    test('should benchmark search algorithms', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = SearchAlgorithms.benchmark(arr, 5);
      
      expect(results.linearSearch).toBeDefined();
      expect(results.binarySearch).toBeDefined();
    });

    test('should find fastest search algorithm', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const fastest = SearchAlgorithms.getFastest(arr, 5);
      
      expect(fastest.algorithm).toBeDefined();
      expect(fastest.result).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    test('should handle large arrays efficiently', () => {
      const largeArr = generateRandomArray(10000);
      const target = largeArr[5000];
      
      const result = Search.linearSearch(largeArr, target);
      
      expect(result.index).toBeGreaterThanOrEqual(0);
      expect(result.metrics.executionTime).toBeGreaterThan(0);
    });

    test('should handle sorted arrays efficiently', () => {
      const sortedArr = generateSortedArray(10000);
      const target = sortedArr[5000];
      
      const result = Search.binarySearch(sortedArr, target);
      
      expect(result.index).toBe(5000);
      expect(result.metrics.executionTime).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle null and undefined inputs', () => {
      expect(() => Search.linearSearch(null as any, 5)).toThrow();
      expect(() => Search.linearSearch(undefined as any, 5)).toThrow();
    });

    test('should handle invalid comparison functions', () => {
      const arr = [1, 2, 3, 4, 5];
      const invalidCompare = () => 'invalid' as any;
      
      expect(() => Search.linearSearch(arr, 3, { compare: invalidCompare })).toThrow();
    });
  });
}); 