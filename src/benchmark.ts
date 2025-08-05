import { 
  Sort, 
  generateRandomArray, 
  generateSortedArray, 
  generateReverseSortedArray, 
  generateDuplicateArray 
} from './index';

interface BenchmarkResult {
  algorithm: string;
  size: number;
  type: string;
  time: number;
  comparisons: number;
  swaps: number;
  memory?: number;
}

class Benchmark {
  private results: BenchmarkResult[] = [];

  /**
   * Run benchmark on a specific algorithm and data
   */
  private runBenchmark(
    algorithm: string,
    arr: number[],
    type: string
  ): BenchmarkResult {
    const result = Sort.sort(arr, algorithm as any);
    
    return {
      algorithm,
      size: arr.length,
      type,
      time: result.metrics.executionTime,
      comparisons: result.metrics.comparisons,
      swaps: result.metrics.swaps,
      memory: result.metrics.memoryUsage
    };
  }

  /**
   * Run comprehensive benchmark
   */
  run(): void {
    console.log('🚀 Starting Sorting Algorithms Benchmark\n');

    const algorithms = ['quickSort', 'mergeSort', 'heapSort', 'timSort', 'introSort'];
    const sizes = [100, 1000, 10000, 50000];
    const types = ['random', 'sorted', 'reverse', 'duplicates'];

    for (const size of sizes) {
      console.log(`\n📊 Testing arrays of size: ${size.toLocaleString()}`);
      console.log('='.repeat(60));

      for (const type of types) {
        console.log(`\n🔍 Data type: ${type}`);
        console.log('-'.repeat(40));

        let data: number[];
        switch (type) {
          case 'random':
            data = generateRandomArray(size);
            break;
          case 'sorted':
            data = generateSortedArray(size);
            break;
          case 'reverse':
            data = generateReverseSortedArray(size);
            break;
          case 'duplicates':
            data = generateDuplicateArray(size, Math.max(1, Math.floor(size / 100)));
            break;
          default:
            data = generateRandomArray(size);
        }

        const typeResults: BenchmarkResult[] = [];

        for (const algorithm of algorithms) {
          try {
            const result = this.runBenchmark(algorithm, [...data], type);
            typeResults.push(result);
            
            console.log(`${algorithm.padEnd(12)} | ${result.time.toFixed(3).padStart(8)}ms | ${result.comparisons.toLocaleString().padStart(8)} comparisons | ${result.swaps.toLocaleString().padStart(6)} swaps`);
          } catch (error) {
            console.log(`${algorithm.padEnd(12)} | ERROR: ${error}`);
          }
        }

        // Find fastest algorithm for this type
        const fastest = typeResults.reduce((a, b) => a.time < b.time ? a : b);
        console.log(`\n🏆 Fastest: ${fastest.algorithm} (${fastest.time.toFixed(3)}ms)`);

        this.results.push(...typeResults);
      }
    }

    this.printSummary();
  }

  /**
   * Print comprehensive summary
   */
  private printSummary(): void {
    console.log('\n\n📈 BENCHMARK SUMMARY');
    console.log('='.repeat(80));

    // Overall fastest algorithm
    const fastest = this.results.reduce((a, b) => a.time < b.time ? a : b);
    console.log(`🏆 Overall fastest: ${fastest.algorithm} (${fastest.time.toFixed(3)}ms)`);

    // Average performance by algorithm
    console.log('\n📊 Average Performance by Algorithm:');
    console.log('-'.repeat(50));

    const algorithmStats = new Map<string, { totalTime: number; count: number; avgComparisons: number; avgSwaps: number }>();

    for (const result of this.results) {
      if (!algorithmStats.has(result.algorithm)) {
        algorithmStats.set(result.algorithm, { totalTime: 0, count: 0, avgComparisons: 0, avgSwaps: 0 });
      }
      
      const stats = algorithmStats.get(result.algorithm)!;
      stats.totalTime += result.time;
      stats.count += 1;
      stats.avgComparisons += result.comparisons;
      stats.avgSwaps += result.swaps;
    }

    const sortedAlgorithms = Array.from(algorithmStats.entries())
      .map(([algorithm, stats]) => ({
        algorithm,
        avgTime: stats.totalTime / stats.count,
        avgComparisons: Math.round(stats.avgComparisons / stats.count),
        avgSwaps: Math.round(stats.avgSwaps / stats.count)
      }))
      .sort((a, b) => a.avgTime - b.avgTime);

    for (const stat of sortedAlgorithms) {
      console.log(`${stat.algorithm.padEnd(12)} | ${stat.avgTime.toFixed(3).padStart(8)}ms avg | ${stat.avgComparisons.toLocaleString().padStart(8)} avg comparisons | ${stat.avgSwaps.toLocaleString().padStart(6)} avg swaps`);
    }

    // Performance by data type
    console.log('\n📊 Performance by Data Type:');
    console.log('-'.repeat(50));

    const typeStats = new Map<string, { totalTime: number; count: number }>();

    for (const result of this.results) {
      if (!typeStats.has(result.type)) {
        typeStats.set(result.type, { totalTime: 0, count: 0 });
      }
      
      const stats = typeStats.get(result.type)!;
      stats.totalTime += result.time;
      stats.count += 1;
    }

    for (const [type, stats] of typeStats) {
      console.log(`${type.padEnd(12)} | ${(stats.totalTime / stats.count).toFixed(3).padStart(8)}ms avg`);
    }

    // Performance by array size
    console.log('\n📊 Performance by Array Size:');
    console.log('-'.repeat(50));

    const sizeStats = new Map<number, { totalTime: number; count: number }>();

    for (const result of this.results) {
      if (!sizeStats.has(result.size)) {
        sizeStats.set(result.size, { totalTime: 0, count: 0 });
      }
      
      const stats = sizeStats.get(result.size)!;
      stats.totalTime += result.time;
      stats.count += 1;
    }

    for (const [size, stats] of sizeStats) {
      console.log(`${size.toString().padEnd(8)} | ${(stats.totalTime / stats.count).toFixed(3).padStart(8)}ms avg`);
    }
  }

  /**
   * Run specific algorithm comparison
   */
  compareAlgorithms(arr: number[], algorithms: string[] = ['quickSort', 'mergeSort', 'heapSort', 'timSort', 'introSort']): void {
    console.log(`\n🔍 Comparing algorithms on array of size ${arr.length}`);
    console.log('='.repeat(60));

    const results: BenchmarkResult[] = [];

    for (const algorithm of algorithms) {
      try {
        const result = this.runBenchmark(algorithm, [...arr], 'custom');
        results.push(result);
        
        console.log(`${algorithm.padEnd(12)} | ${result.time.toFixed(3).padStart(8)}ms | ${result.comparisons.toLocaleString().padStart(8)} comparisons | ${result.swaps.toLocaleString().padStart(6)} swaps`);
      } catch (error) {
        console.log(`${algorithm.padEnd(12)} | ERROR: ${error}`);
      }
    }

    if (results.length > 0) {
      const fastest = results.reduce((a, b) => a.time < b.time ? a : b);
      console.log(`\n🏆 Fastest: ${fastest.algorithm} (${fastest.time.toFixed(3)}ms)`);
    }
  }

  /**
   * Test auto-sort functionality
   */
  testAutoSort(): void {
    console.log('\n🤖 Testing Auto-Sort Functionality');
    console.log('='.repeat(50));

    const testCases = [
      { size: 20, description: 'Small array' },
      { size: 100, description: 'Medium array' },
      { size: 15000, description: 'Large array' }
    ];

    for (const testCase of testCases) {
      const arr = generateRandomArray(testCase.size);
      const result = Sort.autoSort(arr);
      
      console.log(`${testCase.description.padEnd(15)} | ${result.metrics.executionTime.toFixed(3).padStart(8)}ms | ${result.metrics.comparisons.toLocaleString().padStart(8)} comparisons`);
    }
  }
}

// Run benchmark if this file is executed directly
if (require.main === module) {
  const benchmark = new Benchmark();
  
  console.log('🎯 TypeScript Sorting Algorithms Benchmark');
  console.log('Built with high-performance optimizations for Node.js\n');
  
  // Run comprehensive benchmark
  benchmark.run();
  
  // Test auto-sort
  benchmark.testAutoSort();
  
  // Test with custom data
  console.log('\n🔧 Custom Data Test');
  const customData = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4, 4, 5, 8, 6, 6, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4, 4, 5, 8, 6, 6, 6];
  benchmark.compareAlgorithms(customData);
  
  console.log('\n✅ Benchmark completed!');
} 