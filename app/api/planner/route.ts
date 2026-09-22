import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'user-demo-123',
      goal = 'Master Data Structures & Algorithms',
      deadlineDays = 30,
      dailyHours = 2,
      action = 'generate',
    } = body;

    const weakTopics = dbStore.getWeakTopics(userId);
    const weakNames = weakTopics.map(w => w.name);
    const durationPerDay = Math.round(dailyHours * 60);

    const goalLower = goal.toLowerCase();
    let curriculumModules: { topic: string; tasks: string[] }[] = [];

    if (goalLower.includes('web') || goalLower.includes('frontend') || goalLower.includes('react') || goalLower.includes('full stack')) {
      curriculumModules = [
        { topic: 'HTML5 & CSS3 Essentials', tasks: ['Semantic markup & accessibility', 'Flexbox & CSS Grid layouts', 'Responsive typography & media queries'] },
        { topic: 'Modern JavaScript (ES6+)', tasks: ['Closures, Scopes & Prototypes', 'Promises, Async/Await & Event Loop', 'DOM Manipulation & Event Delegation'] },
        { topic: 'React Fundamentals', tasks: ['JSX, Props & Component Lifecycle', 'Hooks: useState, useEffect, useRef', 'State Management & Custom Hooks'] },
        { topic: 'Next.js & Server Components', tasks: ['App Router & Route Handlers', 'SSR, SSG & Server Actions', 'API Integration & Middleware'] },
        { topic: 'Full Stack Integration & Database', tasks: ['REST API design & JSON contracts', 'Database schema modeling & ORM', 'Deployment, Caching & Performance Optimization'] },
      ];
    } else if (goalLower.includes('python') || goalLower.includes('ai') || goalLower.includes('machine learning') || goalLower.includes('data')) {
      curriculumModules = [
        { topic: 'Python Architecture', tasks: ['Object-Oriented Python & Dunder Methods', 'Generators, Iterators & Decorators', 'Memory Management & Collections module'] },
        { topic: 'Numerical Computing & NumPy', tasks: ['Vectorization & Broadcasting arrays', 'Matrix transformations & Linear algebra', 'Performance benchmarking'] },
        { topic: 'Data Wrangling with Pandas', tasks: ['DataFrames, GroupBy & Pivot Tables', 'Handling missing data & clean pipelines', 'Time-series analysis'] },
        { topic: 'Machine Learning Core', tasks: ['Supervised learning: Regression & Classification', 'Model evaluation metrics (ROC-AUC, F1)', 'Unsupervised clustering (K-Means, PCA)'] },
        { topic: 'Deep Learning & Neural Networks', tasks: ['Backpropagation & Gradient Descent', 'Building PyTorch/TensorFlow models', 'Fine-tuning & model deployment'] },
      ];
    } else {
      // Data Structures & Algorithms (Default)
      curriculumModules = [
        { topic: 'Arrays & Two Pointers', tasks: ['Arrays Basics & Memory Layout', 'Two Pointer Technique', 'Sliding Window Pattern'] },
        { topic: 'Linked Lists & Stacks', tasks: ['Singly & Doubly Linked List operations', 'Stack Push/Pop & Monotonic Stack', 'Queue & Deque implementations'] },
        { topic: 'Trees & Binary Search Trees', tasks: ['Tree Traversals (Pre, In, Post)', 'BST Insertion, Deletion & LCA', 'Balanced Trees (AVL/Red-Black overview)'] },
        { topic: 'Graphs (BFS & DFS)', tasks: ['Adjacency list representation', 'BFS & DFS cycle detection', 'Dijkstras Shortest Path & Topological Sort'] },
        { topic: 'Dynamic Programming', tasks: ['1D DP & Fibonacci recurrence', '2D DP: Knapsack & Grid problems', 'Longest Common Subsequence & Tabulation'] },
      ];
    }

    // Flatten into daily plan items
    const planItems: any[] = [];
    let day = 1;
    const maxDays = Math.min(14, Number(deadlineDays) || 14);

    for (const mod of curriculumModules) {
      for (const task of mod.tasks) {
        if (day > maxDays) break;

        // Prioritize weak topics if student struggles with them
        const isWeak = weakNames.some(w => mod.topic.toLowerCase().includes(w.toLowerCase()));

        planItems.push({
          id: `plan-item-${day}`,
          dayNumber: day,
          topic: isWeak ? `⚠️ ${mod.topic} (Weak Topic Priority)` : mod.topic,
          task: task,
          durationMin: isWeak ? Math.min(120, durationPerDay + 30) : durationPerDay,
          completed: day < 4,
          isWeakPriority: isWeak,
        });
        day++;
      }
      if (day > maxDays) break;
    }

    // If adapting plan, insert an explicit reinforcement session at the active position
    if (action === 'adapt' && weakNames.length > 0) {
      const weakFocus = weakNames[0];
      if (planItems.length >= 4) {
        planItems[3] = {
          ...planItems[3],
          topic: `🎯 Focused Remediation: ${weakFocus}`,
          task: `Deep dive drill on ${weakFocus} fundamentals and practice quiz`,
          durationMin: Math.max(90, durationPerDay),
          completed: false,
          isAdapted: true,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        goalTitle: goal,
        deadlineDays: maxDays,
        dailyHours,
        totalItems: planItems.length,
        items: planItems,
        weakTopicsAdapted: weakNames,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'PLAN_GEN_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
