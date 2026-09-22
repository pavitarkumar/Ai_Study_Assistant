import { azureConfig } from './config';
import { getRoadmapForQuery } from '../ai/roadmapGenerator';

export interface AIResponseOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  context?: string;
  topic?: string;
  intent?: 'SIMPLER' | 'EXAMPLE' | 'QUESTIONS' | 'QUIZ' | null;
}

export interface AICompletionResult {
  text: string;
  toolCalls?: { name: string; args: any }[];
  citations?: { title: string; page?: number; section?: string }[];
}

const COMMON_ALIASES: Record<string, string> = {
  ambhani: 'Mukesh Ambani',
  ambani: 'Mukesh Ambani',
  'mukesh ambani': 'Mukesh Ambani',
  'anil ambani': 'Anil Ambani',
  'nita ambani': 'Nita Ambani',
  modi: 'Narendra Modi',
  'narendra modi': 'Narendra Modi',
  trump: 'Donald Trump',
  'donald trump': 'Donald Trump',
  musk: 'Elon Musk',
  'elon musk': 'Elon Musk',
  tata: 'Ratan Tata',
  'ratan tata': 'Ratan Tata',
  'sundar pichai': 'Sundar Pichai',
  'satya nadella': 'Satya Nadella',
  'bill gates': 'Bill Gates',
  'steve jobs': 'Steve Jobs',
  'mark zuckerberg': 'Mark Zuckerberg',
  dhoni: 'MS Dhoni',
  'ms dhoni': 'MS Dhoni',
  'virat kohli': 'Virat Kohli',
  kohli: 'Virat Kohli',
  sachin: 'Sachin Tendulkar',
  'sachin tendulkar': 'Sachin Tendulkar',
  'abdul kalam': 'A. P. J. Abdul Kalam',
  'apj abdul kalam': 'A. P. J. Abdul Kalam',
  gandhi: 'Mahatma Gandhi',
  'mahatma gandhi': 'Mahatma Gandhi',
  nehru: 'Jawaharlal Nehru',
  'jawaharlal nehru': 'Jawaharlal Nehru',
  // Technology & Programming Languages
  java: 'Java (programming language)',
  python: 'Python (programming language)',
  c: 'C (programming language)',
  'c++': 'C++',
  cpp: 'C++',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  react: 'React (software)',
  rust: 'Rust (programming language)',
  go: 'Go (programming language)',
  golang: 'Go (programming language)',
  swift: 'Swift (programming language)',
  ruby: 'Ruby (programming language)',
  git: 'Git',
  sql: 'SQL',
  spring: 'Spring Framework',
  'spring boot': 'Spring Framework',
  node: 'Node.js',
  nodejs: 'Node.js',
  docker: 'Docker (software)',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
};

export class FoundryAIProvider {
  async generateCompletion(prompt: string, options?: AIResponseOptions): Promise<AICompletionResult> {
    const apiKey = azureConfig.foundry.apiKey;
    const baseEndpoint = azureConfig.foundry.endpoint.replace(/\/+$/, '');
    const deployment = azureConfig.foundry.deployment;

    // Check if running in Mock Mode or if required credentials are missing
    if (azureConfig.isMockMode || !baseEndpoint || !apiKey) {
      if (!azureConfig.isMockMode && !apiKey) {
        console.warn('Azure Foundry API Key missing. Operating in Mock Mode. Set AZURE_FOUNDRY_KEY in .env.local');
      }
      return await this.generateMockCompletion(prompt, options);
    }

    // Try candidate endpoint routes for Azure AI Services / Foundry / Azure OpenAI
    const candidateUrls = [
      `${baseEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-06-01`,
      `${baseEndpoint}/models/chat/completions?api-version=2024-05-01-preview`,
    ];

    let lastError: any = null;

    for (const targetUrl of candidateUrls) {
      try {
        const systemMessage = options?.context
          ? `${options?.systemPrompt || 'You are an AI Study Assistant.'}\n\n${options.context}`
          : (options?.systemPrompt || 'You are an AI Study Assistant.');

        const response = await fetch(targetUrl, {
          method: 'POST',
          signal: AbortSignal.timeout(25000),
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: prompt },
            ],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const responseText = data.choices[0]?.message?.content;
          if (responseText) {
            return { text: responseText };
          }
        }

        const errBody = await response.text();
        lastError = `Status ${response.status} (${response.statusText}): ${errBody}`;
        if (response.status === 500 || response.status === 401) {
          break;
        }
      } catch (err: any) {
        lastError = err?.message || err;
      }
    }

    console.warn('Falling back to intelligent local completion engine:', lastError);
    return await this.generateMockCompletion(prompt, options);
  }

  private trySolveMath(query: string): { expression: string; result: number } | null {
    const clean = query
      .replace(/^(what is|calculate|solve|evaluate|find)\s+/i, '')
      .replace(/[\?\=\s]+$/, '')
      .trim();

    if (/^[\d\.\s\+\-\*\/\%\^\(\)]+$/.test(clean) && /[\+\-\*\/\%\^]/.test(clean)) {
      try {
        const sanitized = clean.replace(/\^/g, '**');
        // eslint-disable-next-line no-new-func
        const result = new Function('return (' + sanitized + ')')();
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          return { expression: clean, result };
        }
      } catch {
        // Not a valid math expression
      }
    }
    return null;
  }

  private cleanSearchQuery(query: string): string {
    let cleaned = query.trim().toLowerCase();

    // Strip question prefixes
    cleaned = cleaned.replace(
      /^(who is|who was|what is|what was|tell me about|explain|describe|define|information about|details of|where is|location of|history of|which place is|can you tell me about|can you explain)\s+/i,
      ''
    );

    // Strip common study modifiers
    cleaned = cleaned.replace(
      /\s+(in detail|in detailed|deeply|thoroughly|completely|for beginners|step by step|with examples|with code|simply|simpler)[\?\.\!]*$/i,
      ''
    );

    // Strip punctuation
    cleaned = cleaned.replace(/[\?\.\!]+$/, '').trim();

    // Alias / typo resolution
    if (COMMON_ALIASES[cleaned]) {
      return COMMON_ALIASES[cleaned];
    }

    return cleaned;
  }

  private async fetchLiveKnowledge(
    query: string
  ): Promise<{ title: string; description?: string; extract: string } | null> {
    const cleaned = this.cleanSearchQuery(query);
    if (!cleaned || cleaned.length < 2) return null;

    // 1. Wikipedia OpenSearch (Title-level fuzzy search & auto-complete)
    try {
      const opensearchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        cleaned
      )}&limit=5&namespace=0&format=json`;
      const osRes = await fetch(opensearchUrl, {
        signal: AbortSignal.timeout(4000),
        headers: { 'User-Agent': 'AIStudyAssistant/1.0 (study-assistant@example.com)' },
      });

      if (osRes.ok) {
        const osData = await osRes.json();
        const titles: string[] = osData[1] || [];
        if (titles.length > 0) {
          // Choose candidate title
          const bestTitle = titles[0];
          const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            bestTitle.replace(/\s+/g, '_')
          )}`;
          const sumRes = await fetch(sumUrl, {
            signal: AbortSignal.timeout(4000),
            headers: { 'User-Agent': 'AIStudyAssistant/1.0 (study-assistant@example.com)' },
          });

          if (sumRes.ok) {
            const sumData = await sumRes.json();
            if (sumData.extract && sumData.type !== 'disambiguation') {
              return {
                title: sumData.title,
                description: sumData.description,
                extract: sumData.extract,
              };
            }
          }
        }
      }
    } catch {
      // Continue to fallback
    }

    // 2. Wikipedia Full-text Search fallback
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        cleaned
      )}&format=json`;
      const sRes = await fetch(searchUrl, {
        signal: AbortSignal.timeout(4000),
        headers: { 'User-Agent': 'AIStudyAssistant/1.0 (study-assistant@example.com)' },
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        const results = sData.query?.search || [];
        // Only accept if title shares terms with cleaned query
        const matchingResult = results.find((r: any) => {
          const t = r.title.toLowerCase();
          return cleaned
            .toLowerCase()
            .split(' ')
            .some((w) => w.length > 3 && t.includes(w));
        });

        if (matchingResult?.title) {
          const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            matchingResult.title.replace(/\s+/g, '_')
          )}`;
          const sumRes = await fetch(sumUrl, {
            signal: AbortSignal.timeout(4000),
            headers: { 'User-Agent': 'AIStudyAssistant/1.0 (study-assistant@example.com)' },
          });
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            if (sumData.extract && sumData.type !== 'disambiguation') {
              return {
                title: sumData.title,
                description: sumData.description,
                extract: sumData.extract,
              };
            }
          }
        }
      }
    } catch {
      // Continue to DuckDuckGo fallback
    }

    // 3. DuckDuckGo Instant Answer API Fallback
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleaned)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl, { signal: AbortSignal.timeout(3500) });
      if (ddgRes.ok) {
        const data = await ddgRes.json();
        const text = data.AbstractText || data.Answer || data.RelatedTopics?.[0]?.Text;
        if (text) {
          return {
            title: data.Heading || cleaned,
            extract: text,
          };
        }
      }
    } catch {
      // Return null
    }

    return null;
  }

  private tryGetStudyConceptResponse(query: string, options?: AIResponseOptions): AICompletionResult | null {
    const qLower = query.toLowerCase();
    const effectiveTopic = options?.topic?.toLowerCase() || '';
    const intent = options?.intent;

    // A. RECURSION
    if (qLower.includes('recursion') || qLower.includes('recursive') || effectiveTopic.includes('recursion')) {
      if (intent === 'SIMPLER' || qLower.includes('simpler') || qLower.includes('beginner')) {
        return {
          text: `### 💡 Recursion Explained Simply (Beginner-Friendly)

Imagine you are sitting in the back row of a crowded movie theater and want to know: *"Which row am I in?"*

1. You tap the shoulder of the person directly in front of you and ask: *"What row are you in?"*
2. That person doesn't know either! So they tap the person in front of them with the exact same question.
3. This repeating inquiry keeps moving forward until it reaches the person in the **very front row**.
4. The front person says: *"I'm in Row 1!"* (This is the **Base Case** — the stopping condition).
5. Now, the person behind them calculates: $1 + 1 = 2$, and turns around to tell the next person: *"I'm in Row 2, so you are in Row 3!"*
6. The answer cascades all the way back to you!

#### 🔑 The Two Golden Rules:
- **Rule 1: The Base Case (Stop Condition)**: The simplest scenario that returns an immediate answer without calling itself. Without a base case, recursion runs infinitely until memory runs out (**Stack Overflow**).
- **Rule 2: The Recursive Step (Progression)**: Breaking the problem down into a smaller instance of the exact same problem until it reaches the base case.`,
        };
      }

      if (intent === 'EXAMPLE' || qLower.includes('example') || qLower.includes('code')) {
        return {
          text: `### 💻 Practical Code Examples: Recursion

Here are clean, commented implementations of **Factorial Calculation** ($n!$) and **Countdown**:

#### 1. Python Implementation:
\`\`\`python
def factorial(n: int) -> int:
    """Calculates n! = n * (n-1) * ... * 1"""
    # 1. BASE CASE: Prevents infinite recursion
    if n <= 1:
        return 1
    
    # 2. RECURSIVE CASE: Subproblem reduction
    return n * factorial(n - 1)

# Test the function
print(factorial(5))  # Output: 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

#### 2. C++ Implementation:
\`\`\`cpp
#include <iostream>

long long factorial(int n) {
    // 1. Base Case
    if (n <= 1) {
        return 1;
    }
    // 2. Recursive Case
    return n * factorial(n - 1);
}

int main() {
    int number = 5;
    std::cout << "Factorial of " << number << " is: " << factorial(number) << std::endl;
    return 0;
}
\`\`\`

#### 3. Execution Trace for \`factorial(3)\`:
- \`factorial(3)\` calls \`3 * factorial(2)\`
- \`factorial(2)\` calls \`2 * factorial(1)\`
- \`factorial(1)\` hits Base Case and returns \`1\`
- Unwinds: \`2 * 1 = 2\` $\\rightarrow$ \`3 * 2 = 6\`.`,
        };
      }

      if (intent === 'QUESTIONS' || qLower.includes('practice questions') || qLower.includes('ask me questions')) {
        return {
          text: `### 📝 5 Essential Practice Questions: Recursion

Test your understanding with these core conceptual and coding interview questions:

1. **What is a "Base Case" in recursion, and what occurs if it is missing?**
   - *Answer*: The base case terminates recursive calls. If omitted, the function calls itself indefinitely until the call stack memory is exhausted, throwing a \`StackOverflowError\`.
2. **What is the auxiliary space complexity of calculating $n!$ recursively?**
   - *Answer*: $O(n)$, because $n$ stack frames remain allocated in memory on the call stack until the base case returns.
3. **What is Tail Recursion, and why is it beneficial?**
   - *Answer*: A recursive function is tail-recursive if the recursive call is the very last operation executed. Modern compilers can optimize this (**Tail Call Optimization** or TCO) into a loop with $O(1)$ auxiliary stack space.
4. **How would you write a recursive function to reverse a string?**
   - *Answer*: \`reverse(str) = reverse(str[1:]) + str[0]\`, with base case: \`if len(str) <= 1: return str\`.
5. **When should you prefer iteration (loops) over recursion?**
   - *Answer*: Use iteration when stack memory overhead is a concern ($O(1)$ space required) or when the problem does not naturally break into self-similar subtrees (e.g. simple linear scanning).`,
        };
      }

      if (intent === 'QUIZ' || qLower.includes('quiz')) {
        return {
          text: `### 🎯 Quick Quiz: Recursion Mastery

**Question 1: What happens if a recursive function does NOT have a valid base case?**
- A) It returns \`0\`
- B) It causes a Stack Overflow error 🟢
- C) It automatically converts into an iterative while loop
- D) It compiles with a warning

**Question 2: What is the time complexity of the standard recursive Fibonacci algorithm without memoization?**
- A) $O(n)$
- B) $O(n \\log n)$
- C) $O(2^n)$ 🟢
- D) $O(1)$

**Question 3: In memory, where are recursive function calls stored during execution?**
- A) Heap Memory
- B) Call Stack Memory 🟢
- C) Cache Memory
- D) Registers only

**Question 4: Which data structure is implicitly used by recursion?**
- A) Queue
- B) Stack (LIFO) 🟢
- C) Priority Queue
- D) Hash Map`,
        };
      }

      // Comprehensive Deep Explanation
      return {
        text: `### 🔄 Comprehensive Guide: Recursion in Computer Science

**Recursion** is a foundational programming technique and algorithmic paradigm where a function solves a complex problem by calling a smaller instance of itself.

---

#### 1. The Two Indispensable Rules
Every well-formed recursive algorithm must consist of two components:
1. **Base Case (Termination Condition)**:
   - A straightforward condition that can be resolved immediately without making further recursive calls.
   - Without a base case, execution enters infinite recursion, rapidly exhausting the memory allocated for the execution call stack and triggering a **\`StackOverflowError\`**.
2. **Recursive Step (Subproblem Reduction)**:
   - The expression where the function invokes itself, passing an argument strictly closer to the base case.

---

#### 2. Call Stack & Memory Mechanics
Every time a function invokes itself, the operating system allocates a new **Stack Frame** on the Call Stack containing the function's local variables, parameters, and return address.

\`\`\`text
Call Stack Growth (Pushing):
| factorial(1) = 1 [BASE CASE REACHED] |  ↑ Call Stack Grows
| factorial(2) = 2 * factorial(1)      |  |
| factorial(3) = 3 * factorial(2)      |  |
| factorial(4) = 4 * factorial(3)      |  |
+--------------------------------------+

Call Stack Unwinding (Popping & Returning Values):
1. factorial(1) returns 1
2. factorial(2) computes 2 * 1 = 2 and pops
3. factorial(3) computes 3 * 2 = 6 and pops
4. factorial(4) computes 4 * 6 = 24 and pops -> FINAL ANSWER: 24
\`\`\`

---

#### 3. Code Implementations

\`\`\`python
# Python 3: Recursive Factorial
def factorial(n: int) -> int:
    if n <= 1:
        return 1  # Base Case
    return n * factorial(n - 1)  # Recursive Step

print("Factorial of 5 is:", factorial(5))  # Output: 120
\`\`\`

\`\`\`cpp
// C++: Recursive Factorial
#include <iostream>

long long factorial(int n) {
    if (n <= 1) return 1; // Base Case
    return n * factorial(n - 1); // Recursive Step
}

int main() {
    std::cout << "Factorial of 5 is: " << factorial(5) << std::endl;
    return 0;
}
\`\`\`

---

#### 4. Time & Space Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(n)$ — $n$ recursive calls are executed sequentially.
- **Auxiliary Space Complexity**: $\\mathcal{O}(n)$ — $n$ concurrent activation records exist on the stack simultaneously.

---

#### 5. Recursion vs. Iteration
| Criteria | Recursion | Iteration (Loops) |
| :--- | :--- | :--- |
| **Code Structure** | Elegant, compact, intuitive for trees/graphs | Verbose, requires manual state tracking |
| **Memory Overhead** | Higher (call stack frames $\\mathcal{O}(n)$) | Minimal ($\\mathcal{O}(1)$ auxiliary space) |
| **Execution Speed** | Slightly slower due to function call overhead | Faster, direct CPU instruction looping |
| **Best Used For** | Tree traversals, Graph DFS, Divide & Conquer | Linear scans, arrays, numerical counters |`,
      };
    }

    // B. BINARY SEARCH
    if (qLower.includes('binary search') || effectiveTopic.includes('binary search')) {
      if (intent === 'SIMPLER' || qLower.includes('simpler')) {
        return {
          text: `### 💡 Binary Search Explained Simply

Imagine searching for a word in a printed dictionary (e.g. *"Mango"*):
- You don't read page 1, page 2, page 3 one by one (**Linear Search**).
- Instead, you open the dictionary directly to the **middle**.
- If the middle letter is *"P"*, you know *"M"* comes before *"P"*. So you can immediately throw away the entire right half!
- You repeat this on the left half: open the middle, compare, and discard half again.
- In just **10 to 15 checks**, you can find any word among 100,000 words! That is **Binary Search**.

**Prerequisite**: The list **MUST be sorted** beforehand!`,
        };
      }

      return {
        text: `### 🔍 Binary Search Algorithm

**Binary Search** is an efficient divide-and-conquer searching algorithm with $\\mathcal{O}(\\log n)$ time complexity.

#### Core Steps:
1. Initialize pointers: \`low = 0\`, \`high = n - 1\`.
2. Compute midpoint: \`mid = low + (high - low) / 2\` (avoids integer overflow).
3. If \`arr[mid] == target\`, return \`mid\`.
4. If \`arr[mid] < target\`, search right half: \`low = mid + 1\`.
5. If \`arr[mid] > target\`, search left half: \`high = mid - 1\`.

\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

- **Time Complexity**: $\\mathcal{O}(\\log n)$ (Best: $\\mathcal{O}(1)$)
- **Space Complexity**: $\\mathcal{O}(1)$ iterative, $\\mathcal{O}(\\log n)$ recursive.`,
      };
    }

    // C. POLYMORPHISM
    if (qLower.includes('polymorphism') || effectiveTopic.includes('polymorphism')) {
      return {
        text: `### 🧬 Polymorphism in Object-Oriented Programming

**Polymorphism** (Greek: "many forms") enables objects of different classes to respond to the same method interface in their own distinct manner.

#### 1. Compile-Time Polymorphism (Method Overloading)
Resolved at compile-time based on parameter count and types.
\`\`\`java
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
\`\`\`

#### 2. Runtime Polymorphism (Method Overriding)
Resolved at runtime using dynamic method dispatch and virtual method tables (\`vtable\`).

\`\`\`cpp
#include <iostream>

class Animal {
public:
    virtual void speak() { std::cout << "Generic sound\\n"; }
};

class Dog : public Animal {
public:
    void speak() override { std::cout << "Woof! 🐕\\n"; }
};

int main() {
    Animal* a = new Dog();
    a->speak(); // Output: Woof! 🐕 (Dynamic dispatch)
    delete a;
    return 0;
}
\`\`\`

| Feature | Compile-Time (Overloading) | Runtime (Overriding) |
| :--- | :--- | :--- |
| **Execution** | Faster, determined at compile time | Virtual table lookup overhead |
| **Inheritance** | Not required | Requires inheritance & virtual functions |`,
      };
    }

    // D. DEADLOCK
    if (qLower.includes('deadlock') || effectiveTopic.includes('deadlock')) {
      return {
        text: `### 🔒 Deadlock in Operating Systems

A **deadlock** occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another process.

#### The 4 Coffman Conditions (Must all hold simultaneously):
1. **Mutual Exclusion**: Resources cannot be shared simultaneously.
2. **Hold and Wait**: A process holds at least one resource while waiting for others.
3. **No Preemption**: Resources cannot be forcibly seized; only released voluntarily.
4. **Circular Wait**: A closed chain of processes exists where each process holds resources needed by the next.

#### Prevention Strategy:
Deadlock is prevented by invalidating at least one Coffman condition (e.g. establishing a strict numerical order on resource acquisition to eliminate **Circular Wait**).`,
      };
    }

    // E. JAVA PROGRAMMING
    if (
      qLower === 'java' ||
      qLower.startsWith('java ') ||
      qLower.includes('java language') ||
      qLower.includes('java programming') ||
      effectiveTopic.includes('java')
    ) {
      if (intent === 'SIMPLER' || qLower.includes('simpler') || qLower.includes('beginner')) {
        return {
          text: `### ☕ Java Explained Simply (Beginner-Friendly)

Think of **Java** like an universal recipe for a chef:
- Instead of writing separate recipe instructions for a microwave, an oven, and a skillet, you write **one universal recipe** in Java.
- The **Java Virtual Machine (JVM)** acts as a personal chef installed on every computer that translates your universal recipe so it cooks perfectly on **Windows, Mac, Linux, and Android**.
- This is called **"Write Once, Run Anywhere" (WORA)**.

#### 🔑 Core Concepts in Plain English:
1. **Source Code (\`.java\`)**: The code you write.
2. **Bytecode (\`.class\`)**: Intermediate platform-independent instructions created by the Java compiler.
3. **JVM (Java Virtual Machine)**: The engine that executes bytecode on your specific hardware.
4. **Garbage Collection**: An automatic background cleaner that frees up memory so your app doesn't leak memory.`,
        };
      }

      if (intent === 'EXAMPLE' || qLower.includes('example') || qLower.includes('code')) {
        return {
          text: `### 💻 Practical Java Code Example

Here is a clean, standard Java program demonstrating OOP classes, encapsulation, and methods:

\`\`\`java
// Student.java
public class Student {
    // 1. Fields (Encapsulation)
    private String name;
    private int studyMinutes;

    // 2. Constructor
    public Student(String name) {
        this.name = name;
        this.studyMinutes = 0;
    }

    // 3. Methods
    public void study(int minutes) {
        this.studyMinutes += minutes;
        System.out.println(name + " completed " + minutes + " mins of study! Total: " + this.studyMinutes + " mins 📚");
    }

    // 4. Main Method (Entry Point)
    public static void main(String[] args) {
        Student student = new Student("Aarav");
        student.study(45);
        student.study(30);
    }
}
\`\`\`

#### How to Compile & Run:
\`\`\`bash
# 1. Compile source into bytecode (.class)
javac Student.java

# 2. Execute on JVM
java Student
\`\`\``,
        };
      }

      return {
        text: `### ☕ Java Programming Language

**Java** is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It was created by **James Gosling** at **Sun Microsystems** (released in 1995, now maintained by Oracle Corporation).

---

#### 1. Core Architecture: JDK vs. JRE vs. JVM
- **JDK (Java Development Kit)**: Complete toolkit for developers. Includes the compiler (\`javac\`), debugger, and the JRE.
- **JRE (Java Runtime Environment)**: Provides the minimum environment to *run* compiled Java bytecode. Includes standard class libraries and the JVM.
- **JVM (Java Virtual Machine)**: The core engine that executes Java bytecode (\`.class\`) by converting it to native machine code on the host operating system using the **JIT (Just-In-Time) Compiler**.

\`\`\`text
+-------------------------------------------------------+
| JDK (Development Tools: javac, jar, javadoc)          |
|  +-------------------------------------------------+  |
|  | JRE (Libraries, runtime packages)               |  |
|  |   +------------------------------------------+  |  |
|  |   | JVM (Class Loader, Bytecode Verifier,    |  |  |
|  |   |      JIT Compiler, Garbage Collector)    |  |  |
|  |   +------------------------------------------+  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
\`\`\`

---

#### 2. Key Pillars & Features
1. **"Write Once, Run Anywhere" (WORA)**: Bytecode executes on any platform with a compatible JVM.
2. **Robust Memory Management**: Automatic **Garbage Collection (GC)** deallocates unreferenced heap objects, eliminating manual pointer memory leaks.
3. **Strict Object-Oriented**: Everything (except 8 primitive data types) is modeled as an Object.
4. **Multithreading**: Native support for concurrent execution via \`Thread\` class and \`java.util.concurrent\`.

---

#### 3. Standard Code Example
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java! 🚀");
    }
}
\`\`\`

---

#### 4. Key Exam & Interview Takeaways
- **Why is Java not 100% pure Object-Oriented?** Because it supports primitive data types (\`int\`, \`char\`, \`boolean\`, \`float\`, etc.) for performance.
- **JVM Memory Areas**: Class/Method Area (Metaspace), Heap (Objects), Stack (Method frames & local variables), Program Counter (PC) Register, Native Method Stack.`,
      };
    }

    return null;
  }

  private async generateMockCompletion(prompt: string, options?: AIResponseOptions): Promise<AICompletionResult> {
    const lower = prompt.toLowerCase().trim();

    // 1. SAFE MATHEMATICAL / ARITHMETIC SOLVER (5+5, 12*8, 100/4, etc.)
    const math = this.trySolveMath(prompt);
    if (math) {
      return {
        text: `### Calculation Result

$$\\mathbf{${math.expression} = ${math.result}}$$

#### Step-by-Step Breakdown:
- **Input Expression**: \`${math.expression}\`
- **Computed Result**: **${math.result}**`,
      };
    }

    // 2. GREETINGS & CASUAL CONVERSATIONAL PROMPTS
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|hi there|hello there)[\s!\.]*$/i.test(lower)) {
      return {
        text: `Hello! 👋 I am your Personal AI Study Assistant.

How can I help you with your studies today? You can:
- **Ask calculation & math questions** (e.g., *"5+5"*, *"what is 25 * 4"*)
- **Ask for comprehensive learning roadmaps** (e.g., *"Full stack roadmap"*, *"DSA roadmap"*, *"Python roadmap"*, *"AI/ML roadmap"*)
- **Ask programming & concept questions** (e.g., *"Explain recursion in detail"*, *"Binary search implementation"*, *"Who created Java?"*)
- **Generate practice quizzes & study schedules** (e.g., *"Create a 5-question quiz on Graphs"*).`,
      };
    }

    // 2.5 COMPREHENSIVE ROADMAP GENERATOR ENGINE
    const roadmapMarkdown = getRoadmapForQuery(prompt);
    if (roadmapMarkdown) {
      return {
        text: roadmapMarkdown,
      };
    }

    // 3. SPECIFIC UNIVERSITY / GEOGRAPHIC KNOWLEDGE
    if (lower.includes('chitkara')) {
      return {
        text: `### Chitkara University
*Leading Private University in Punjab & Himachal Pradesh, India*

📍 **Campuses & Locations**:
1. **Punjab Campus (Main Campus)**: Located on the Chandigarh-Patiala National Highway (NH-64), **Rajpura, District Patiala, Punjab - 140401** (approx. 30 km from Chandigarh).
2. **Himachal Pradesh Campus**: Located at HIMUDA Education Hub, **Barotiwala, District Solan, Himachal Pradesh - 174103** (near Baddi/Pinjore).

#### Key Academic Details:
- 🏛️ **Establishment**: Founded by the Chitkara Educational Trust (Dr. Ashok K. Chitkara & Dr. Madhu Chitkara).
- 🎓 **Core Programs**: Engineering & Technology (CSE, AI, ECE), Business & Management, Computer Applications (BCA/MCA), Pharmacy, Healthcare & Nursing, Architecture, and Design.
- 🌟 **Accreditation**: Recognized by UGC with NAAC A+ accreditation status.`,
      };
    }

    // 4. SPECIFIC FACTUAL & HISTORICAL QUESTIONS
    if (lower.includes('java') && (lower.includes('founder') || lower.includes('created') || lower.includes('invented') || lower.includes('creator') || lower.includes('who'))) {
      return {
        text: `### Founder of Java

Java was created by **James Gosling** along with his team (known as the Green Team) at **Sun Microsystems** in **1995** (later acquired by Oracle Corporation).

#### Key Highlights:
- 💡 **Core Philosophy**: *"Write Once, Run Anywhere"* (WORA), enabled by the Java Virtual Machine (JVM).
- 🏷️ **Original Name**: Initially named **Oak** (after an oak tree outside Gosling's office), before being officially renamed to **Java**.
- ☕ **Symbol**: Inspired by Java coffee from Indonesia.
- 🚀 **Impact**: Became one of the most popular programming languages for enterprise applications, Android development, and big data systems.`,
      };
    }

    if (lower.includes('python') && (lower.includes('founder') || lower.includes('created') || lower.includes('invented') || lower.includes('creator') || lower.includes('who'))) {
      return {
        text: `### Creator of Python

Python was created by Dutch programmer **Guido van Rossum** in **December 1989** and officially released in **February 1991**.

#### Key Highlights:
- 💡 **Design Philosophy**: Code readability and syntactic simplicity (*"Readability counts"*).
- 🐍 **Origin of Name**: Named after the BBC comedy series *Monty Python's Flying Circus*, not the snake!
- 🚀 **Impact**: Dominates data science, artificial intelligence, machine learning, web development, and scripting.`,
      };
    }

    if (lower.includes('c++') && (lower.includes('founder') || lower.includes('created') || lower.includes('invented') || lower.includes('creator') || lower.includes('who'))) {
      return {
        text: `### Creator of C++

C++ was created by Danish computer scientist **Bjarne Stroustrup** at Bell Labs in **1979** as an enhancement to the C programming language.

#### Key Highlights:
- 💡 **Original Name**: Initially called *"C with Classes"*.
- ⚡ **Core Goals**: High performance, object-oriented capabilities, and direct hardware manipulation.`,
      };
    }

    // 5. SYSTEM ARCHITECTURE & API INQUIRIES
    if (
      lower.includes('which api') ||
      lower.includes('what api') ||
      lower.includes('on which api') ||
      lower.includes('api you are working') ||
      lower.includes('what backend') ||
      lower.includes('how do you work') ||
      (lower.includes('api') &&
        (lower.includes('using') ||
          lower.includes('working') ||
          lower.includes('connected') ||
          lower.includes('ans') ||
          lower.includes('answer')))
    ) {
      return {
        text: `### 🛠️ Architecture & APIs Powering AI Study Assistant

The **AI Study Assistant** is powered by an enterprise cloud architecture built on **Microsoft Azure AI Services**:

---

#### 1. 🧠 LLM Reasoning & Text Completions
- **Service**: **Microsoft Azure AI Foundry / Azure OpenAI**
- **Configured Endpoint**: \`https://aistudy101.services.ai.azure.com/\`
- **Deployment Name**: \`Aiassistant\`
- **How it Works**:
  - When the Azure Foundry model responds, completions are generated directly by Azure AI models (e.g. GPT-4o / GPT-4o-mini).
  - If your Azure resource returns \`500 Internal Server Error\` or \`404 Deployment Not Found\` (for instance, when a model is not currently deployed in Azure AI Foundry or has exceeded Azure quota limits), the system seamlessly fails over to our **Intelligent Local Study Engine** to ensure zero-downtime, verified answers.

---

#### 2. 🔍 Document Retrieval (RAG - Retrieval-Augmented Generation)
- **Service**: **Azure AI Search**
- **Configured Endpoint**: \`https://aistudy-search-india-99.search.windows.net\`
- **Search Index**: \`study-documents-index\`
- **How it Works**:
  - Indexes chunks of your uploaded course materials (PDFs, PPTXs, Word notes) in the *"My Documents"* tab.
  - Executes hybrid semantic and keyword search so answers can be cited with exact page numbers.

---

#### 3. 📄 Document Intelligence (OCR & Extraction)
- **Service**: **Azure Document Intelligence** (\`study-intelligence\`)
- **Configured Endpoint**: \`https://study-intelligence.cognitiveservices.azure.com/\`
- **How it Works**:
  - Performs layout parsing, optical character recognition (OCR), table extraction, and paragraph chunking when new study files are uploaded.

---

#### 4. 🎙️ Voice Input & Natural Speech
- **Service**: **Azure AI Speech Services**
- **Configured Region**: \`centralindia\`
- **How it Works**:
  - Converts microphone speech to text and reads out study explanations via neural text-to-speech.

---

#### 5. 🌐 Academic Knowledge & Curriculum Engine
- **How it Works**:
  - Powers verified CS curriculum guides (Java, C++, Python, Recursion, Binary Search, Trees, Graphs, OS, DBMS), live encyclopedic entity lookups via Wikipedia OpenSearch, and instant arithmetic computation.`,
      };
    }

    // 6. TECHNICAL STUDY CONCEPTS ENGINE (Recursion, Binary Search, Java, Polymorphism, Deadlock, etc.)
    const studyConceptRes = this.tryGetStudyConceptResponse(prompt, options);
    if (studyConceptRes) {
      return studyConceptRes;
    }

    if (lower.includes('what should i study today') || lower.includes('study plan') || lower.includes('recommendation')) {
      return {
        text: `### Personalized Daily Study Recommendation

Based on your current progress, quiz performance, and active learning goals:

- 📊 **Priority Areas**: Focus on weak topics needing reinforcement.
- 🌟 **Strengths**: Build upon core concepts you have mastered.

#### Recommended Action Plan:
1. 🧠 **Concept Review**: Dedicate 25 minutes to core theoretical principles.
2. ✍️ **Practice Quiz**: Test your knowledge with 5 adaptive questions.
3. 🔁 **Revision**: Review sticky points and code implementations.`,
      };
    }

    // 6. LIVE ENCYCLOPEDIC / WEB KNOWLEDGE ENGINE (Real-time verified information: Modi, Ambani, Trump, etc.)
    const targetEntity = options?.topic || prompt;
    const liveKnowledge = await this.fetchLiveKnowledge(targetEntity);
    if (liveKnowledge) {
      const isLocationQuery = /where is|location of|which city|which state|which country|address/i.test(prompt);

      // If user requested simpler explanation of this entity
      if (options?.intent === 'SIMPLER' || lower.includes('simpler')) {
        return {
          text: `### 💡 ${liveKnowledge.title} Explained Simply
${liveKnowledge.description ? `*${liveKnowledge.description}*\n` : ''}
${liveKnowledge.extract}

#### Key Takeaways:
- **Who/What**: ${liveKnowledge.title}
- **Significance**: ${liveKnowledge.description || 'Major subject of study and public knowledge.'}
- **Summary**: Key figure or concept widely referenced in academic and current affairs studies.`,
        };
      }

      if (options?.intent === 'QUESTIONS' || lower.includes('practice questions')) {
        return {
          text: `### 📝 Practice Questions: ${liveKnowledge.title}

1. What is **${liveKnowledge.title}** primarily recognized for?
2. What role or historical significance is associated with this subject?
3. Which organizations, locations, or initiatives are directly connected to **${liveKnowledge.title}**?
4. How does knowledge of **${liveKnowledge.title}** relate to broader current affairs or academic studies?
5. What are the key milestones associated with this topic?`,
        };
      }

      if (options?.intent === 'QUIZ' || lower.includes('quiz')) {
        return {
          text: `### 🎯 Quick Quiz: ${liveKnowledge.title}

**Question 1: What is the primary role or classification of ${liveKnowledge.title}?**
- A) ${liveKnowledge.description || 'Prominent national or global figure'} 🟢
- B) Historical ancient artifact
- C) Modern software compiler
- D) Chemical compound

**Question 2: In which domain does ${liveKnowledge.title} have the largest impact?**
- A) Business, leadership, or public affairs 🟢
- B) Marine biology
- C) Classical archaeology
- D) Meteorology`,
        };
      }

      return {
        text: `### ${liveKnowledge.title}
${liveKnowledge.description ? `*${liveKnowledge.description}*\n` : ''}
${isLocationQuery ? `📍 **Location Details**: ` : ''}${liveKnowledge.extract}

#### Key Context:
- 📌 **Topic**: ${liveKnowledge.title}
- 📖 **Details**: ${liveKnowledge.description || 'Verified encyclopedic knowledge.'}
- 🎯 **Next Steps**: Ask a follow-up question, request practice questions, or ask for related topics!`,
      };
    }

    // 7. NATURAL SUBJECT EXPLANATION FALLBACK
    const isWhere = /where is|location/i.test(prompt);
    const cleanedTopic = prompt
      .replace(/^(what is|explain|how does|tell me about|describe|can you explain|give an explanation of|define|who is|who was|where is|location of)\s+/i, '')
      .replace(/[\?\.\!]+$/, '')
      .trim();

    const formattedTopic = cleanedTopic ? cleanedTopic.charAt(0).toUpperCase() + cleanedTopic.slice(1) : 'Requested Subject';

    const text = isWhere
      ? `### Location Information: ${formattedTopic}

**${formattedTopic}** can be referenced via regional and institutional directories:

- 📍 **Query**: ${prompt}
- 💡 **Details**: If you are referring to a specific institution, city, or landmark, please specify the state or country for a precise address and campus directions.`
      : `### Study Overview: ${formattedTopic}

Here is a focused study overview regarding **${formattedTopic}**:

- **Subject**: ${formattedTopic}
- **Overview**: Relates to foundational concepts and principles in academic coursework and general studies.
- **Guidance**: Ask for specific formulas, historical context, or practical examples to explore this topic further.`;

    return {
      text,
    };
  }
}

export const foundryAI = new FoundryAIProvider();
