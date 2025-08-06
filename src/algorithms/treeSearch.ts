import { CompareFunction, SortOptions } from '../types';
import { createCompareFunction } from '../utils';

/**
 * Binary Search Tree Node
 */
class BSTNode<T> {
  key: T;
  value?: any;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
  parent: BSTNode<T> | null;

  constructor(key: T, value?: any) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/**
 * Binary Search Tree implementation
 */
export class BinarySearchTree<T> {
  private root: BSTNode<T> | null;
  private compare: CompareFunction<T>;
  private size: number;

  constructor(compare?: CompareFunction<T>) {
    this.root = null;
    this.compare = compare || ((a, b) => (a as any) - (b as any));
    this.size = 0;
  }

  /**
   * Insert a key-value pair
   */
  insert(key: T, value?: any): void {
    const newNode = new BSTNode(key, value);
    
    if (!this.root) {
      this.root = newNode;
      this.size = 1;
      return;
    }

    let current = this.root;
    let parent: BSTNode<T> | null = null;

    while (current) {
      parent = current;
      const comparison = this.compare(key, current.key);
      
      if (comparison === 0) {
        current.value = value; // Update existing key
        return;
      } else if (comparison < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (parent) {
      const comparison = this.compare(key, parent.key);
      if (comparison < 0) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
      newNode.parent = parent;
      this.size++;
    }
  }

  /**
   * Search for a key
   */
  search(key: T): any {
    const node = this.findNode(key);
    return node ? node.value : undefined;
  }

  /**
   * Find node by key
   */
  private findNode(key: T): BSTNode<T> | null {
    let current = this.root;

    while (current) {
      const comparison = this.compare(key, current.key);
      
      if (comparison === 0) {
        return current;
      } else if (comparison < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  /**
   * Delete a key
   */
  delete(key: T): boolean {
    const node = this.findNode(key);
    if (!node) return false;

    this.deleteNode(node);
    this.size--;
    return true;
  }

  /**
   * Delete a node
   */
  private deleteNode(node: BSTNode<T>): void {
    if (!node.left && !node.right) {
      // Leaf node
      this.replaceNode(node, null);
    } else if (!node.left) {
      // Node with only right child
      this.replaceNode(node, node.right);
    } else if (!node.right) {
      // Node with only left child
      this.replaceNode(node, node.left);
    } else {
      // Node with two children
      const successor = this.findMin(node.right!);
      node.key = successor.key;
      node.value = successor.value;
      this.deleteNode(successor);
    }
  }

  /**
   * Replace a node with another
   */
  private replaceNode(oldNode: BSTNode<T>, newNode: BSTNode<T> | null): void {
    if (!oldNode.parent) {
      this.root = newNode;
    } else if (oldNode === oldNode.parent.left) {
      oldNode.parent.left = newNode;
    } else {
      oldNode.parent.right = newNode;
    }

    if (newNode) {
      newNode.parent = oldNode.parent;
    }
  }

  /**
   * Find minimum node in subtree
   */
  private findMin(node: BSTNode<T>): BSTNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  /**
   * Find maximum node in subtree
   */
  private findMax(node: BSTNode<T>): BSTNode<T> {
    while (node.right) {
      node = node.right;
    }
    return node;
  }

  /**
   * Get minimum key
   */
  min(): T | undefined {
    if (!this.root) return undefined;
    return this.findMin(this.root).key;
  }

  /**
   * Get maximum key
   */
  max(): T | undefined {
    if (!this.root) return undefined;
    return this.findMax(this.root).key;
  }

  /**
   * Get size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if tree is empty
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Inorder traversal
   */
  inorder(): T[] {
    const result: T[] = [];
    this.inorderTraversal(this.root, result);
    return result;
  }

  /**
   * Inorder traversal helper
   */
  private inorderTraversal(node: BSTNode<T> | null, result: T[]): void {
    if (node) {
      this.inorderTraversal(node.left, result);
      result.push(node.key);
      this.inorderTraversal(node.right, result);
    }
  }

  /**
   * Preorder traversal
   */
  preorder(): T[] {
    const result: T[] = [];
    this.preorderTraversal(this.root, result);
    return result;
  }

  /**
   * Preorder traversal helper
   */
  private preorderTraversal(node: BSTNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.key);
      this.preorderTraversal(node.left, result);
      this.preorderTraversal(node.right, result);
    }
  }

  /**
   * Postorder traversal
   */
  postorder(): T[] {
    const result: T[] = [];
    this.postorderTraversal(this.root, result);
    return result;
  }

  /**
   * Postorder traversal helper
   */
  private postorderTraversal(node: BSTNode<T> | null, result: T[]): void {
    if (node) {
      this.postorderTraversal(node.left, result);
      this.postorderTraversal(node.right, result);
      result.push(node.key);
    }
  }
}

/**
 * AVL Tree Node
 */
class AVLNode<T> extends BSTNode<T> {
  height: number;

  constructor(key: T, value?: any) {
    super(key, value);
    this.height = 1;
  }
}

/**
 * AVL Tree implementation (self-balancing)
 */
export class AVLTree<T> {
  private root: AVLNode<T> | null;
  private compare: CompareFunction<T>;
  private size: number;

  constructor(compare?: CompareFunction<T>) {
    this.root = null;
    this.compare = compare || ((a, b) => (a as any) - (b as any));
    this.size = 0;
  }

  /**
   * Get height of node
   */
  private getHeight(node: AVLNode<T> | null): number {
    return node ? node.height : 0;
  }

  /**
   * Get balance factor
   */
  private getBalance(node: AVLNode<T>): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  /**
   * Update height of node
   */
  private updateHeight(node: AVLNode<T>): void {
    node.height = Math.max(
      this.getHeight(node.left),
      this.getHeight(node.right)
    ) + 1;
  }

  /**
   * Right rotate
   */
  private rightRotate(y: AVLNode<T>): AVLNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    if (T2) T2.parent = y;
    x.parent = y.parent;
    y.parent = x;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  /**
   * Left rotate
   */
  private leftRotate(x: AVLNode<T>): AVLNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    if (T2) T2.parent = x;
    y.parent = x.parent;
    x.parent = y;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  /**
   * Insert a key-value pair
   */
  insert(key: T, value?: any): void {
    this.root = this.insertNode(this.root, key, value);
    this.size++;
  }

  /**
   * Insert node helper
   */
  private insertNode(node: AVLNode<T> | null, key: T, value?: any): AVLNode<T> {
    if (!node) {
      return new AVLNode(key, value);
    }

    const comparison = this.compare(key, node.key);
    
    if (comparison === 0) {
      node.value = value; // Update existing key
      return node;
    } else if (comparison < 0) {
      node.left = this.insertNode(node.left, key, value);
      if (node.left) node.left.parent = node;
    } else {
      node.right = this.insertNode(node.right, key, value);
      if (node.right) node.right.parent = node;
    }

    this.updateHeight(node);

    const balance = this.getBalance(node);

    // Left Left Case
    if (balance > 1 && this.compare(key, node.left!.key) < 0) {
      return this.rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && this.compare(key, node.right!.key) > 0) {
      return this.leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && this.compare(key, node.left!.key) > 0) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && this.compare(key, node.right!.key) < 0) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  /**
   * Search for a key
   */
  search(key: T): any {
    const node = this.findNode(key);
    return node ? node.value : undefined;
  }

  /**
   * Find node by key
   */
  private findNode(key: T): AVLNode<T> | null {
    let current = this.root;

    while (current) {
      const comparison = this.compare(key, current.key);
      
      if (comparison === 0) {
        return current;
      } else if (comparison < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  /**
   * Get size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if tree is empty
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Inorder traversal
   */
  inorder(): T[] {
    const result: T[] = [];
    this.inorderTraversal(this.root, result);
    return result;
  }

  /**
   * Inorder traversal helper
   */
  private inorderTraversal(node: AVLNode<T> | null, result: T[]): void {
    if (node) {
      this.inorderTraversal(node.left, result);
      result.push(node.key);
      this.inorderTraversal(node.right, result);
    }
  }
}

/**
 * B-Tree Node
 */
class BTreeNode<T> {
  keys: T[];
  children: BTreeNode<T>[];
  isLeaf: boolean;
  size: number;

  constructor(isLeaf: boolean = true) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
    this.size = 0;
  }
}

/**
 * B-Tree implementation
 */
export class BTree<T> {
  private root: BTreeNode<T>;
  private t: number; // Minimum degree
  private compare: CompareFunction<T>;

  constructor(t: number = 3, compare?: CompareFunction<T>) {
    this.root = new BTreeNode<T>(true);
    this.t = t;
    this.compare = compare || ((a, b) => (a as any) - (b as any));
  }

  /**
   * Search for a key
   */
  search(key: T): any {
    return this.searchNode(this.root, key);
  }

  /**
   * Search in a node
   */
  private searchNode(node: BTreeNode<T>, key: T): any {
    let i = 0;
    
    // Find the first key greater than or equal to k
    while (i < node.size && this.compare(key, node.keys[i]) > 0) {
      i++;
    }

    // If the found key is equal to k, return this node
    if (i < node.size && this.compare(key, node.keys[i]) === 0) {
      return node.keys[i];
    }

    // If this is a leaf node, then key is not present
    if (node.isLeaf) {
      return undefined;
    }

    // Go to the appropriate child
    return this.searchNode(node.children[i], key);
  }

  /**
   * Insert a key
   */
  insert(key: T): void {
    const root = this.root;

    // If root is full, then tree grows in height
    if (root.size === 2 * this.t - 1) {
      const newRoot = new BTreeNode<T>(false);
      newRoot.children[0] = root;
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, key);
  }

  /**
   * Insert in a non-full node
   */
  private insertNonFull(node: BTreeNode<T>, key: T): void {
    let i = node.size - 1;

    if (node.isLeaf) {
      // Find the location of new key to be inserted
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
      node.size++;
    } else {
      // Find the child which is going to have the new key
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        i--;
      }
      i++;

      if (node.children[i].size === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (this.compare(key, node.keys[i]) > 0) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  /**
   * Split child
   */
  private splitChild(parent: BTreeNode<T>, childIndex: number): void {
    const child = parent.children[childIndex];
    const newNode = new BTreeNode<T>(child.isLeaf);

    // Copy the second half keys of child to newNode
    for (let j = 0; j < this.t - 1; j++) {
      newNode.keys[j] = child.keys[j + this.t];
    }

    // Copy the second half children of child to newNode
    if (!child.isLeaf) {
      for (let j = 0; j < this.t; j++) {
        newNode.children[j] = child.children[j + this.t];
      }
    }

    child.size = this.t - 1;
    newNode.size = this.t - 1;

    // Insert newNode as a child of parent
    for (let j = parent.size; j >= childIndex + 1; j--) {
      parent.children[j + 1] = parent.children[j];
    }
    parent.children[childIndex + 1] = newNode;

    // Move a key from child to parent
    for (let j = parent.size - 1; j >= childIndex; j--) {
      parent.keys[j + 1] = parent.keys[j];
    }
    parent.keys[childIndex] = child.keys[this.t - 1];
    parent.size++;
  }

  /**
   * Get size
   */
  getSize(): number {
    return this.getNodeSize(this.root);
  }

  /**
   * Get node size recursively
   */
  private getNodeSize(node: BTreeNode<T>): number {
    let size = node.size;
    if (!node.isLeaf) {
      for (const child of node.children) {
        size += this.getNodeSize(child);
      }
    }
    return size;
  }

  /**
   * Check if tree is empty
   */
  isEmpty(): boolean {
    return this.root.size === 0;
  }
} 