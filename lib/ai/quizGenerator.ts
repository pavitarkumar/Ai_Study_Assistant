import { foundryAI } from '../azure/foundry';
import { azureConfig } from '../azure/config';

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'True/False' | 'Scenario' | 'Code Output';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const TOPIC_QUESTION_BANK: Record<string, QuizQuestion[]> = {
  graphs: [
    {
      id: 'g-1',
      type: 'MCQ',
      question: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree'],
      correctAnswer: 'Queue',
      explanation: 'BFS explores graph nodes level by level using a FIFO Queue.',
    },
    {
      id: 'g-2',
      type: 'MCQ',
      question: 'What is the time complexity of DFS on a graph with V vertices and E edges (adjacency list)?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
      correctAnswer: 'O(V + E)',
      explanation: 'DFS visits each vertex once and traverses each edge once, yielding O(V + E).',
    },
    {
      id: 'g-3',
      type: 'True/False',
      question: 'Depth-First Search (DFS) can detect cycles in directed graphs via back-edges.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Encountering a node currently on the recursion stack represents a back-edge and confirms a cycle.',
    },
    {
      id: 'g-4',
      type: 'Scenario',
      question: 'You need to find the shortest path in an unweighted graph. Which algorithm is optimal?',
      options: ['Dijkstras Algorithm', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Bellman-Ford'],
      correctAnswer: 'Breadth-First Search (BFS)',
      explanation: 'BFS guarantees the shortest path in unweighted graphs in O(V + E) time.',
    },
    {
      id: 'g-5',
      type: 'Code Output',
      question: 'In a graph with 4 vertices and no edges, how many connected components exist?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '4',
      explanation: 'Each isolated vertex forms an independent connected component.',
    },
    {
      id: 'g-6',
      type: 'MCQ',
      question: 'Which algorithm finds the Minimum Spanning Tree (MST) by greedily adding the cheapest edge?',
      options: ['Kruskals Algorithm', 'Dijkstras Algorithm', 'Floyd-Warshall', 'A* Search'],
      correctAnswer: 'Kruskals Algorithm',
      explanation: 'Kruskals sorts edges by weight and adds edges that do not form a cycle.',
    },
  ],
  trees: [
    {
      id: 't-1',
      type: 'MCQ',
      question: 'In a Binary Search Tree (BST), which traversal visits nodes in ascending sorted order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level Order'],
      correctAnswer: 'Inorder',
      explanation: 'Inorder traversal visits Left -> Root -> Right, yielding sorted order in a valid BST.',
    },
    {
      id: 't-2',
      type: 'MCQ',
      question: 'What is the worst-case search time complexity in an unbalanced binary search tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswer: 'O(n)',
      explanation: 'A degenerate (skewed) BST acts like a linked list, requiring linear O(n) search time.',
    },
    {
      id: 't-3',
      type: 'True/False',
      question: 'An AVL tree is a self-balancing binary search tree where heights of children differ by at most 1.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'AVL balance factor must be -1, 0, or +1 at every node.',
    },
    {
      id: 't-4',
      type: 'Scenario',
      question: 'You need to find the Lowest Common Ancestor (LCA) of nodes p and q in a BST where p < root and q > root.',
      options: ['LCA is in left subtree', 'LCA is in right subtree', 'Root is the LCA', 'LCA does not exist'],
      correctAnswer: 'Root is the LCA',
      explanation: 'When one node is smaller and the other is greater than root in a BST, root is their split point and LCA.',
    },
    {
      id: 't-5',
      type: 'Code Output',
      question: 'What is the maximum number of nodes in a binary tree of height h (where height of single root = 1)?',
      options: ['2^h - 1', '2^(h-1)', '2^h', 'h^2'],
      correctAnswer: '2^h - 1',
      explanation: 'A full binary tree has 1 + 2 + 4 + ... + 2^(h-1) = 2^h - 1 nodes.',
    },
  ],
  'operating systems': [
    {
      id: 'os-1',
      type: 'MCQ',
      question: 'Which of the following is NOT one of the 4 Coffman conditions for deadlock?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
      correctAnswer: 'Preemption Allowed',
      explanation: 'The condition is No Preemption; allowing preemption prevents deadlock.',
    },
    {
      id: 'os-2',
      type: 'MCQ',
      question: 'Which algorithm is used for deadlock avoidance by verifying system state safety?',
      options: ['Round Robin', 'Bankers Algorithm', 'Peterson Algorithm', 'LRU'],
      correctAnswer: 'Bankers Algorithm',
      explanation: 'Dijkstras Banker algorithm simulates resource allocations to guarantee a safe execution state.',
    },
    {
      id: 'os-3',
      type: 'True/False',
      question: 'Virtual memory allows execution of processes that are not completely in physical memory.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Paging and demand paging load only required pages into physical RAM.',
    },
    {
      id: 'os-4',
      type: 'Scenario',
      question: 'A system with high paging activity spends more time swapping pages than executing instructions. What is this?',
      options: ['Thrashing', 'Starvation', 'Fragmentation', 'Deadlock'],
      correctAnswer: 'Thrashing',
      explanation: 'Thrashing happens when the working set of active processes exceeds physical memory capacity.',
    },
    {
      id: 'os-5',
      type: 'Code Output',
      question: 'If a parent process calls fork() 3 times in succession, how many total child processes are created?',
      options: ['3', '6', '7', '8'],
      correctAnswer: '7',
      explanation: '2^3 = 8 total processes, so 8 - 1 (parent) = 7 child processes.',
    },
  ],
  arrays: [
    {
      id: 'a-1',
      type: 'MCQ',
      question: 'What is the time complexity to access an element by index in a contiguous memory array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 'O(1)',
      explanation: 'Array elements are accessed in constant time using base address + index * element size.',
    },
    {
      id: 'a-2',
      type: 'MCQ',
      question: 'Which technique is most effective for finding a pair in a sorted array that sums to a target?',
      options: ['Two Pointers', 'Breadth-First Search', 'Divide and Conquer', 'Dynamic Programming'],
      correctAnswer: 'Two Pointers',
      explanation: 'Two pointers starting at opposite ends can solve this in O(n) time and O(1) space.',
    },
    {
      id: 'a-3',
      type: 'True/False',
      question: 'Binary search requires the input array to be ordered or sorted.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Binary search divides the search space in half based on comparison with sorted elements.',
    },
    {
      id: 'a-4',
      type: 'Scenario',
      question: 'You must compute running sum of any subarray in O(1) time after O(n) preprocessing. What do you construct?',
      options: ['Prefix Sum Array', 'Segment Tree', 'Hash Map', 'Priority Queue'],
      correctAnswer: 'Prefix Sum Array',
      explanation: 'Prefix sums allow range sum queries sum(L..R) = prefix[R] - prefix[L-1] in O(1).',
    },
    {
      id: 'a-5',
      type: 'Code Output',
      question: 'What does Kadanes algorithm compute in O(n) time?',
      options: ['Maximum Subarray Sum', 'Longest Increasing Subsequence', 'Median Element', 'Cycle Detection'],
      correctAnswer: 'Maximum Subarray Sum',
      explanation: 'Kadanes algorithm dynamically tracks maximum subarray sum ending at each position.',
    },
  ],
  'dynamic programming': [
    {
      id: 'dp-1',
      type: 'MCQ',
      question: 'What two key properties must a problem have to be efficiently solved using Dynamic Programming?',
      options: [
        'Optimal Substructure and Overlapping Subproblems',
        'Greedy Choice and Divide & Conquer',
        'Linear Complexity and Sorting',
        'Recursive Base and Binary Splitting',
      ],
      correctAnswer: 'Optimal Substructure and Overlapping Subproblems',
      explanation: 'DP reuses solutions to subproblems (overlapping) to construct the global optimum (optimal substructure).',
    },
    {
      id: 'dp-2',
      type: 'MCQ',
      question: 'What is the difference between Memoization and Tabulation?',
      options: [
        'Memoization is Top-Down; Tabulation is Bottom-Up',
        'Memoization is Bottom-Up; Tabulation is Top-Down',
        'Memoization uses no arrays; Tabulation uses recursion',
        'There is no difference',
      ],
      correctAnswer: 'Memoization is Top-Down; Tabulation is Bottom-Up',
      explanation: 'Memoization caches recursive calls top-down; tabulation fills an iterative table bottom-up.',
    },
    {
      id: 'dp-3',
      type: 'True/False',
      question: 'The 0/1 Knapsack problem can be solved in O(n * W) time using dynamic programming.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Standard DP table has dimensions n x W, where W is the knapsack capacity.',
    },
    {
      id: 'dp-4',
      type: 'Scenario',
      question: 'Finding the Longest Common Subsequence (LCS) of two strings of length m and n takes what DP space and time?',
      options: ['O(m * n)', 'O(m + n)', 'O(2^(m+n))', 'O(min(m, n))'],
      correctAnswer: 'O(m * n)',
      explanation: 'The 2D DP matrix requires O(m * n) time and O(m * n) space (optimizable to O(min(m,n)) space).',
    },
    {
      id: 'dp-5',
      type: 'Code Output',
      question: 'Using DP, how many ways are there to climb 4 stairs if you can take 1 or 2 steps at a time?',
      options: ['3', '5', '8', '13'],
      correctAnswer: '5',
      explanation: 'Ways(1)=1, Ways(2)=2, Ways(3)=3, Ways(4)=Ways(3)+Ways(2)=5 (Fibonacci pattern).',
    },
  ],
  python: [
    {
      id: 'py-1',
      type: 'MCQ',
      question: 'Which built-in Python data structure is mutable and ordered?',
      options: ['List', 'Tuple', 'Frozenset', 'String'],
      correctAnswer: 'List',
      explanation: 'Lists are mutable sequences that maintain element insertion order.',
    },
    {
      id: 'py-2',
      type: 'MCQ',
      question: 'What does the `GIL` (Global Interpreter Lock) in CPython do?',
      options: [
        'Prevents multiple native threads from executing Python bytecodes simultaneously',
        'Compresses memory for faster list indexing',
        'Secures imports from malicious scripts',
        'Locks file access across processes',
      ],
      correctAnswer: 'Prevents multiple native threads from executing Python bytecodes simultaneously',
      explanation: 'The GIL synchronizes thread execution so only one thread runs Python bytecode at a time.',
    },
    {
      id: 'py-3',
      type: 'True/False',
      question: 'In Python, functions are first-class citizens and can be passed as arguments to other functions.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Functions can be assigned to variables, stored in data structures, and passed/returned as higher-order functions.',
    },
    {
      id: 'py-4',
      type: 'Code Output',
      question: 'What is the output of `print([x**2 for x in range(4) if x % 2 == 0])`?',
      options: ['[0, 4]', '[0, 1, 4, 9]', '[4]', '[1, 9]'],
      correctAnswer: '[0, 4]',
      explanation: 'Range(4) produces 0, 1, 2, 3. Even numbers are 0 and 2. 0^2 = 0, 2^2 = 4.',
    },
    {
      id: 'py-5',
      type: 'Scenario',
      question: 'Which method should you implement in a class to enable context manager usage via `with` statement?',
      options: ['__enter__ and __exit__', '__open__ and __close__', '__start__ and __stop__', '__init__ and __del__'],
      correctAnswer: '__enter__ and __exit__',
      explanation: 'The context management protocol requires __enter__() and __exit__().',
    },
  ],
  java: [
    {
      id: 'jv-1',
      type: 'MCQ',
      question: 'Which keyword in Java prevents a class from being inherited?',
      options: ['final', 'static', 'const', 'sealed'],
      correctAnswer: 'final',
      explanation: 'Declaring a class as final prevents subclasses from extending it.',
    },
    {
      id: 'jv-2',
      type: 'MCQ',
      question: 'Where are objects created with `new` allocated in Java memory?',
      options: ['Heap', 'Stack', 'Metaspace', 'Program Counter Register'],
      correctAnswer: 'Heap',
      explanation: 'All object instances are allocated on the Heap and managed by the Garbage Collector.',
    },
    {
      id: 'jv-3',
      type: 'True/False',
      question: 'In Java, strings created as literals are stored in the String Constant Pool.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'String literals are shared in the string pool inside heap memory for efficiency.',
    },
    {
      id: 'jv-4',
      type: 'Scenario',
      question: 'You want a thread-safe map implementation with high concurrent throughput. What should you use?',
      options: ['ConcurrentHashMap', 'Hashtable', 'SynchronizedMap', 'HashMap'],
      correctAnswer: 'ConcurrentHashMap',
      explanation: 'ConcurrentHashMap uses bucket-level locking for superior concurrent performance over synchronized maps.',
    },
    {
      id: 'jv-5',
      type: 'Code Output',
      question: 'What is the output of `System.out.println(10 + 20 + "Java" + 10 + 20)`?',
      options: ['30Java1020', '30Java30', '1020Java1020', 'Compilation Error'],
      correctAnswer: '30Java1020',
      explanation: 'Evaluated left to right: 10 + 20 = 30; 30 + "Java" = "30Java"; then string concatenation produces "30Java1020".',
    },
  ],
};

function normalizeTopic(topic: string): string {
  const t = topic.toLowerCase().trim();
  if (t.includes('graph') || t.includes('bfs') || t.includes('dfs')) return 'graphs';
  if (t.includes('tree') || t.includes('bst') || t.includes('avl')) return 'trees';
  if (t.includes('os') || t.includes('operating') || t.includes('deadlock') || t.includes('memory')) return 'operating systems';
  if (t.includes('array') || t.includes('string') || t.includes('vector')) return 'arrays';
  if (t.includes('dp') || t.includes('dynamic') || t.includes('memoization')) return 'dynamic programming';
  if (t.includes('python') || t.includes('py')) return 'python';
  if (t.includes('java') || t.includes('jvm') || t.includes('oop')) return 'java';
  return t;
}

export async function generateAdaptiveQuiz(
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  count: number = 5
): Promise<QuizQuestion[]> {
  const normKey = normalizeTopic(topic);
  const bank = TOPIC_QUESTION_BANK[normKey];

  if (bank && bank.length > 0) {
    // If bank has questions, shuffle and slice
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, bank.length));
  }

  // Fallback for custom or novel topics: algorithmic generation
  const genericQuestions: QuizQuestion[] = [
    {
      id: `q-${Date.now()}-1`,
      type: 'MCQ',
      question: `What is the foundational principle behind ${topic}?`,
      options: [
        `Core structural abstraction in ${topic}`,
        `Arbitrary runtime randomization`,
        `Hardware register constraints only`,
        `Deprecated legacy specification`,
      ],
      correctAnswer: `Core structural abstraction in ${topic}`,
      explanation: `${topic} relies on clear architectural rules and data integrity principles.`,
    },
    {
      id: `q-${Date.now()}-2`,
      type: 'True/False',
      question: `Mastery of ${topic} requires understanding trade-offs between performance and complexity.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: `Engineering trade-offs are fundamental to applying ${topic} efficiently.`,
    },
    {
      id: `q-${Date.now()}-3`,
      type: 'Scenario',
      question: `When deploying or implementing ${topic} in high-throughput environments, what is the priority?`,
      options: [
        'Time and space efficiency with predictable scaling',
        'Maximum memory allocation without garbage collection',
        'Removing all exception handling and tests',
        'Hardcoding fixed buffer sizes',
      ],
      correctAnswer: 'Time and space efficiency with predictable scaling',
      explanation: `Scalability and predictable resource utilization are essential for ${topic}.`,
    },
    {
      id: `q-${Date.now()}-4`,
      type: 'MCQ',
      question: `Which approach yields optimal results when debugging complex issues in ${topic}?`,
      options: [
        'Systematic unit testing and state inspection',
        'Restarting the server repeatedly',
        'Ignoring compiler warnings and logs',
        'Changing multiple parameters simultaneously without tracing',
      ],
      correctAnswer: 'Systematic unit testing and state inspection',
      explanation: 'Disciplined inspection and step-by-step verification identify bugs rapidly.',
    },
    {
      id: `q-${Date.now()}-5`,
      type: 'Code Output',
      question: `What is the expected behavior when boundary edge cases are passed into ${topic} algorithms?`,
      options: [
        'Graceful handling via base cases or error boundaries',
        'Immediate kernel panic',
        'Infinite silent execution loops',
        'Corrupted memory overwrites',
      ],
      correctAnswer: 'Graceful handling via base cases or error boundaries',
      explanation: 'Robust software designs handle edge cases, empty inputs, and null references safely.',
    },
  ];

  return genericQuestions.slice(0, count);
}
