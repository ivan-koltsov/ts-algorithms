import { CompareFunction, SortOptions } from '../types';
import { createCompareFunction, validateArray } from '../utils';

/**
 * Hash table entry interface
 */
interface HashEntry<K, V> {
  key: K;
  value: V;
  isDeleted: boolean;
}

/**
 * Hash table implementation with efficient search
 */
export class HashTable<K, V> {
  private table: (HashEntry<K, V> | null)[];
  private size: number;
  private capacity: number;
  private loadFactor: number;
  private compare: CompareFunction<K>;

  constructor(initialCapacity: number = 16, loadFactor: number = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.size = 0;
    this.table = new Array(this.capacity).fill(null);
    this.compare = (a, b) => (a as any) - (b as any);
  }

  /**
   * Set custom comparison function
   */
  setCompareFunction(compare: CompareFunction<K>): void {
    this.compare = compare;
  }

  /**
   * Hash function
   */
  private hash(key: K): number {
    const keyStr = String(key);
    let hash = 0;
    
    for (let i = 0; i < keyStr.length; i++) {
      const char = keyStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash) % this.capacity;
  }

  /**
   * Insert or update a key-value pair
   */
  put(key: K, value: V): void {
    if (this.size / this.capacity >= this.loadFactor) {
      this.resize(this.capacity * 2);
    }

    let index = this.hash(key);
    let originalIndex = index;

    do {
      if (this.table[index] === null) {
        this.table[index] = { key, value, isDeleted: false };
        this.size++;
        return;
      }

      if (this.table[index]!.isDeleted) {
        this.table[index] = { key, value, isDeleted: false };
        this.size++;
        return;
      }

      if (this.compare(this.table[index]!.key, key) === 0) {
        this.table[index]!.value = value;
        return;
      }

      index = (index + 1) % this.capacity;
    } while (index !== originalIndex);

    // Table is full, resize and retry
    this.resize(this.capacity * 2);
    this.put(key, value);
  }

  /**
   * Get value by key
   */
  get(key: K): V | undefined {
    const index = this.findIndex(key);
    return index !== -1 ? this.table[index]!.value : undefined;
  }

  /**
   * Check if key exists
   */
  has(key: K): boolean {
    return this.findIndex(key) !== -1;
  }

  /**
   * Remove key-value pair
   */
  remove(key: K): boolean {
    const index = this.findIndex(key);
    if (index === -1) return false;

    this.table[index]!.isDeleted = true;
    this.size--;
    return true;
  }

  /**
   * Find index of key
   */
  private findIndex(key: K): number {
    let index = this.hash(key);
    let originalIndex = index;

    do {
      if (this.table[index] === null) {
        return -1;
      }

      if (!this.table[index]!.isDeleted && this.compare(this.table[index]!.key, key) === 0) {
        return index;
      }

      index = (index + 1) % this.capacity;
    } while (index !== originalIndex);

    return -1;
  }

  /**
   * Resize hash table
   */
  private resize(newCapacity: number): void {
    const oldTable = this.table;
    this.capacity = newCapacity;
    this.table = new Array(this.capacity).fill(null);
    this.size = 0;

    for (const entry of oldTable) {
      if (entry && !entry.isDeleted) {
        this.put(entry.key, entry.value);
      }
    }
  }

  /**
   * Get all keys
   */
  keys(): K[] {
    const keys: K[] = [];
    for (const entry of this.table) {
      if (entry && !entry.isDeleted) {
        keys.push(entry.key);
      }
    }
    return keys;
  }

  /**
   * Get all values
   */
  values(): V[] {
    const values: V[] = [];
    for (const entry of this.table) {
      if (entry && !entry.isDeleted) {
        values.push(entry.value);
      }
    }
    return values;
  }

  /**
   * Get all entries
   */
  entries(): [K, V][] {
    const entries: [K, V][] = [];
    for (const entry of this.table) {
      if (entry && !entry.isDeleted) {
        entries.push([entry.key, entry.value]);
      }
    }
    return entries;
  }

  /**
   * Clear hash table
   */
  clear(): void {
    this.table = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * Get size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Get capacity
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Get load factor
   */
  getLoadFactor(): number {
    return this.size / this.capacity;
  }
}

/**
 * Set implementation using hash table
 */
export class HashSet<T> {
  private hashTable: HashTable<T, boolean>;

  constructor() {
    this.hashTable = new HashTable<T, boolean>();
  }

  /**
   * Add element to set
   */
  add(element: T): void {
    this.hashTable.put(element, true);
  }

  /**
   * Check if element exists
   */
  has(element: T): boolean {
    return this.hashTable.has(element);
  }

  /**
   * Remove element
   */
  remove(element: T): boolean {
    return this.hashTable.remove(element);
  }

  /**
   * Get all elements
   */
  values(): T[] {
    return this.hashTable.keys();
  }

  /**
   * Get size
   */
  size(): number {
    return this.hashTable.getSize();
  }

  /**
   * Clear set
   */
  clear(): void {
    this.hashTable.clear();
  }

  /**
   * Union with another set
   */
  union(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    
    for (const element of this.values()) {
      result.add(element);
    }
    
    for (const element of other.values()) {
      result.add(element);
    }
    
    return result;
  }

  /**
   * Intersection with another set
   */
  intersection(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    
    for (const element of this.values()) {
      if (other.has(element)) {
        result.add(element);
      }
    }
    
    return result;
  }

  /**
   * Difference with another set
   */
  difference(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    
    for (const element of this.values()) {
      if (!other.has(element)) {
        result.add(element);
      }
    }
    
    return result;
  }
}

/**
 * Map implementation using hash table
 */
export class HashMap<K, V> {
  private hashTable: HashTable<K, V>;

  constructor() {
    this.hashTable = new HashTable<K, V>();
  }

  /**
   * Set key-value pair
   */
  set(key: K, value: V): void {
    this.hashTable.put(key, value);
  }

  /**
   * Get value by key
   */
  get(key: K): V | undefined {
    return this.hashTable.get(key);
  }

  /**
   * Check if key exists
   */
  has(key: K): boolean {
    return this.hashTable.has(key);
  }

  /**
   * Remove key-value pair
   */
  delete(key: K): boolean {
    return this.hashTable.remove(key);
  }

  /**
   * Get all keys
   */
  keys(): K[] {
    return this.hashTable.keys();
  }

  /**
   * Get all values
   */
  values(): V[] {
    return this.hashTable.values();
  }

  /**
   * Get all entries
   */
  entries(): [K, V][] {
    return this.hashTable.entries();
  }

  /**
   * Get size
   */
  size(): number {
    return this.hashTable.getSize();
  }

  /**
   * Clear map
   */
  clear(): void {
    this.hashTable.clear();
  }
} 