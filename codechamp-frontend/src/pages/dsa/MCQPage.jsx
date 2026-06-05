import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import {
  CheckCircle, XCircle, ChevronRight,
  Trophy, RotateCcw
} from 'lucide-react';
import './MCQPage.css';

const ALL_QUESTIONS = [
  // Time Complexity
  {
    id: 1,
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: "O(log n)",
    category: "Time Complexity",
    explanation: "Binary Search divides the search space in half each time, giving O(log n)."
  },
  {
    id: 2,
    question: "What is the worst case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correct: "O(n²)",
    category: "Time Complexity",
    explanation: "QuickSort worst case occurs when pivot is always smallest or largest element."
  },
  {
    id: 3,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: "O(1)",
    category: "Time Complexity",
    explanation: "Array access by index is constant time O(1) due to direct memory addressing."
  },
  {
    id: 4,
    question: "What is the time complexity of inserting an element at the beginning of a linked list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: "O(1)",
    category: "Time Complexity",
    explanation: "Inserting at the head of a linked list only requires updating one pointer."
  },
  {
    id: 5,
    question: "What is the average time complexity of HashMap get() operation?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: "O(1)",
    category: "Time Complexity",
    explanation: "HashMap uses hashing to achieve average O(1) get operations."
  },
  {
    id: 6,
    question: "What is the time complexity of Merge Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correct: "O(n log n)",
    category: "Time Complexity",
    explanation: "Merge Sort always divides into halves and merges, giving O(n log n) in all cases."
  },
  {
    id: 7,
    question: "What is the space complexity of DFS on a graph with V vertices?",
    options: ["O(V²)", "O(E)", "O(V)", "O(1)"],
    correct: "O(V)",
    category: "Time Complexity",
    explanation: "DFS uses a stack (or recursion stack) that can hold at most V vertices."
  },
  {
    id: 8,
    question: "What is the time complexity of finding an element in a balanced BST?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correct: "O(log n)",
    category: "Time Complexity",
    explanation: "A balanced BST has height log n, so search takes O(log n)."
  },

  // CS Fundamentals
  {
    id: 9,
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Heap"],
    correct: "Stack",
    category: "CS Fundamentals",
    explanation: "Stack follows LIFO — the last element pushed is the first to be popped."
  },
  {
    id: 10,
    question: "Which data structure follows FIFO (First In First Out) principle?",
    options: ["Stack", "Tree", "Queue", "Graph"],
    correct: "Queue",
    category: "CS Fundamentals",
    explanation: "Queue follows FIFO — elements are removed in the order they were added."
  },
  {
    id: 11,
    question: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2h", "2h - 1", "2^(h+1) - 1", "h²"],
    correct: "2^(h+1) - 1",
    category: "CS Fundamentals",
    explanation: "A complete binary tree of height h has 2^(h+1) - 1 maximum nodes."
  },
  {
    id: 12,
    question: "Which traversal of a BST gives nodes in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    correct: "Inorder",
    category: "CS Fundamentals",
    explanation: "Inorder traversal (Left → Root → Right) of BST gives sorted ascending order."
  },
  {
    id: 13,
    question: "What is a complete graph with n vertices called?",
    options: ["Kn", "Cn", "Pn", "Wn"],
    correct: "Kn",
    category: "CS Fundamentals",
    explanation: "A complete graph where every vertex connects to every other is called Kn."
  },
  {
    id: 14,
    question: "Which data structure is used in BFS traversal?",
    options: ["Stack", "Queue", "Heap", "Tree"],
    correct: "Queue",
    category: "CS Fundamentals",
    explanation: "BFS uses a Queue to process nodes level by level."
  },
  {
    id: 15,
    question: "What is the height of an AVL tree with n nodes?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correct: "O(log n)",
    category: "CS Fundamentals",
    explanation: "AVL trees are self-balancing, maintaining height O(log n)."
  },
  {
    id: 16,
    question: "Which of these is NOT a property of a Min Heap?",
    options: [
      "Root is the minimum element",
      "It is a complete binary tree",
      "Parent is always smaller than children",
      "Left child is always smaller than right child"
    ],
    correct: "Left child is always smaller than right child",
    category: "CS Fundamentals",
    explanation: "Heap only guarantees parent < children, not ordering between siblings."
  },

  // Algorithm Concepts
  {
    id: 17,
    question: "Which sorting algorithm is stable?",
    options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"],
    correct: "MergeSort",
    category: "Algorithm Concepts",
    explanation: "MergeSort maintains relative order of equal elements, making it stable."
  },
  {
    id: 18,
    question: "What algorithmic paradigm does Dynamic Programming use?",
    options: [
      "Divide and Conquer",
      "Greedy",
      "Overlapping subproblems + optimal substructure",
      "Backtracking"
    ],
    correct: "Overlapping subproblems + optimal substructure",
    category: "Algorithm Concepts",
    explanation: "DP solves problems by breaking into overlapping subproblems and storing results."
  },
  {
    id: 19,
    question: "What is memoization in Dynamic Programming?",
    options: [
      "Bottom-up approach",
      "Top-down approach with caching",
      "Greedy selection",
      "Recursive without caching"
    ],
    correct: "Top-down approach with caching",
    category: "Algorithm Concepts",
    explanation: "Memoization is top-down DP that stores results of already solved subproblems."
  },
  {
    id: 20,
    question: "Which algorithm finds the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
    correct: "BFS",
    category: "Algorithm Concepts",
    explanation: "BFS finds shortest path in unweighted graphs by exploring level by level."
  },
  {
    id: 21,
    question: "What is the key idea behind the Two Pointer technique?",
    options: [
      "Use two stacks simultaneously",
      "Use two indices moving toward each other",
      "Use two queues for BFS",
      "Divide array into two halves"
    ],
    correct: "Use two indices moving toward each other",
    category: "Algorithm Concepts",
    explanation: "Two pointers move from both ends toward center to solve problems in O(n)."
  },
  {
    id: 22,
    question: "Which technique is best for finding subarrays with a given sum?",
    options: ["Two Pointers", "Sliding Window", "Binary Search", "DFS"],
    correct: "Sliding Window",
    category: "Algorithm Concepts",
    explanation: "Sliding Window maintains a window of elements to efficiently find subarrays."
  },
  {
    id: 23,
    question: "What does Kadane's Algorithm solve?",
    options: [
      "Longest common subsequence",
      "Maximum subarray sum",
      "Shortest path",
      "Minimum spanning tree"
    ],
    correct: "Maximum subarray sum",
    category: "Algorithm Concepts",
    explanation: "Kadane's Algorithm finds the maximum sum contiguous subarray in O(n) time."
  },
  {
    id: 24,
    question: "Which data structure is used in Dijkstra's shortest path algorithm?",
    options: ["Stack", "Queue", "Min Heap/Priority Queue", "Deque"],
    correct: "Min Heap/Priority Queue",
    category: "Algorithm Concepts",
    explanation: "Dijkstra uses a Min Heap to always process the vertex with minimum distance."
  },
  {
    id: 25,
    question: "What is the time complexity of Floyd-Warshall algorithm?",
    options: ["O(V²)", "O(V³)", "O(E log V)", "O(VE)"],
    correct: "O(V³)",
    category: "Algorithm Concepts",
    explanation: "Floyd-Warshall uses 3 nested loops over V vertices giving O(V³)."
  },
  {
    id: 26,
    question: "Which sorting algorithm has best average case performance?",
    options: ["Bubble Sort", "Insertion Sort", "QuickSort", "Selection Sort"],
    correct: "QuickSort",
    category: "Algorithm Concepts",
    explanation: "QuickSort has average O(n log n) and is fastest in practice due to cache performance."
  },
  {
    id: 27,
    question: "What is topological sorting used for?",
    options: [
      "Sorting numbers efficiently",
      "Finding cycles in graphs",
      "Ordering tasks with dependencies",
      "Finding shortest path"
    ],
    correct: "Ordering tasks with dependencies",
    category: "Algorithm Concepts",
    explanation: "Topological sort orders vertices so that for every edge u→v, u comes before v."
  },
  {
    id: 28,
    question: "Which problem type is solved by backtracking?",
    options: [
      "Single solution optimization",
      "Exploring all possible solutions",
      "Greedy selection",
      "Dynamic subproblems"
    ],
    correct: "Exploring all possible solutions",
    category: "Algorithm Concepts",
    explanation: "Backtracking explores all possibilities by building solutions incrementally and pruning invalid ones."
  },
  {
    id: 29,
    question: "What is the purpose of a Union-Find data structure?",
    options: [
      "Sort elements efficiently",
      "Find shortest path",
      "Detect cycles and merge disjoint sets",
      "Store key-value pairs"
    ],
    correct: "Detect cycles and merge disjoint sets",
    category: "Algorithm Concepts",
    explanation: "Union-Find efficiently tracks connected components and detects cycles."
  },
  {
    id: 30,
    question: "Which algorithm is used to find Minimum Spanning Tree?",
    options: [
      "Dijkstra",
      "Kruskal or Prim",
      "Bellman-Ford",
      "Floyd-Warshall"
    ],
    correct: "Kruskal or Prim",
    category: "Algorithm Concepts",
    explanation: "Both Kruskal's and Prim's algorithms find the Minimum Spanning Tree of a graph."
  }
];

const getDailyQuestions = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 + today.getDate();

  const seededRandom = (s) => {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const shuffled = [...ALL_QUESTIONS].sort((a, b) =>
    seededRandom(seed + a.id) - seededRandom(seed + b.id)
  );

  return shuffled.slice(0, 10);
};

const MCQPage = () => {
  const [questions] = useState(getDailyQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const current = questions[currentIdx];

  const handleAnswer = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    const isCorrect = option === current.correct;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, {
      question: current,
      selected: option,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
    setAnswers([]);
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return 'mcq-option';
    if (option === current.correct) return 'mcq-option correct';
    if (option === selectedAnswer && option !== current.correct)
      return 'mcq-option wrong';
    return 'mcq-option disabled';
  };

  const getScoreMessage = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return { msg: 'Perfect Score!', color: 'var(--easy)' };
    if (pct >= 80) return { msg: 'Excellent!', color: 'var(--easy)' };
    if (pct >= 60) return { msg: 'Good Job!', color: 'var(--medium)' };
    if (pct >= 40) return { msg: 'Keep Practicing!', color: 'var(--medium)' };
    return { msg: 'Need More Practice', color: 'var(--hard)' };
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Time Complexity') return 'var(--primary)';
    if (cat === 'CS Fundamentals') return 'var(--easy)';
    return 'var(--medium)';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  if (completed) {
    const { msg, color } = getScoreMessage();
    return (
      <Layout>
        <div className="mcq-page">
          <div className="mcq-result-card card">
            <div className="mcq-result-header">
              <Trophy size={48} strokeWidth={1.5} color={color} />
              <h1 style={{color}}>{msg}</h1>
              <p>Daily Challenge Complete — {today}</p>
            </div>

            <div className="mcq-score-circle"
              style={{borderColor: color}}>
              <span className="mcq-score-num" style={{color}}>
                {score}
              </span>
              <span className="mcq-score-den">
                /{questions.length}
              </span>
            </div>

            <div className="mcq-result-stats">
              <div className="mcq-stat">
                <span className="mcq-stat-num correct-text">
                  {score}
                </span>
                <span>Correct</span>
              </div>
              <div className="mcq-stat">
                <span className="mcq-stat-num wrong-text">
                  {questions.length - score}
                </span>
                <span>Wrong</span>
              </div>
              <div className="mcq-stat">
                <span className="mcq-stat-num" style={{color}}>
                  {Math.round((score/questions.length)*100)}%
                </span>
                <span>Accuracy</span>
              </div>
            </div>

            <div className="mcq-answers-review">
              <h3>Review Answers</h3>
              {answers.map((a, i) => (
                <div key={i}
                  className={`mcq-review-row ${a.isCorrect ? 'correct' : 'wrong'}`}>
                  <div className="mcq-review-icon">
                    {a.isCorrect
                      ? <CheckCircle size={16} strokeWidth={2}
                          color="var(--easy)" />
                      : <XCircle size={16} strokeWidth={2}
                          color="var(--hard)" />
                    }
                  </div>
                  <div className="mcq-review-info">
                    <span className="mcq-review-title">
                      {a.question.question}
                    </span>
                    <span className="mcq-review-meta">
                      Your answer: <strong>{a.selected}</strong>
                      {!a.isCorrect && (
                        <span> → Correct:{' '}
                          <strong style={{color:'var(--easy)'}}>
                            {a.question.correct}
                          </strong>
                        </span>
                      )}
                    </span>
                    <span className="mcq-explanation">
                      💡 {a.question.explanation}
                    </span>
                  </div>
                  <span
                    className="mcq-category-tag"
                    style={{
                      color: getCategoryColor(a.question.category),
                      background: 'var(--surface2)'
                    }}>
                    {a.question.category}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="btn-primary mcq-restart"
              onClick={handleRestart}>
              <RotateCcw size={16} strokeWidth={2} />
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mcq-page">

        <div className="mcq-header">
          <div>
            <h1>Daily Challenge</h1>
            <p>{today}</p>
          </div>
          <div className="mcq-progress-info">
            <span className="mcq-current">{currentIdx + 1}</span>
            <span className="mcq-total">/{questions.length}</span>
          </div>
        </div>

        <div className="mcq-progress-bar">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{width:`${(currentIdx/questions.length)*100}%`}}>
            </div>
          </div>
          <span className="mcq-score-live">
            Score: {score}/{currentIdx}
          </span>
        </div>

        <div className="card mcq-question-card">
          <div className="mcq-question-header">
            <span
              className="mcq-category-badge"
              style={{color: getCategoryColor(current.category)}}>
              {current.category}
            </span>
            <span className="mcq-q-number">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <h2 className="mcq-question-text">
            {current.question}
          </h2>

          <div className="mcq-options">
            {current.options.map((option, idx) => (
              <button
                key={idx}
                className={getOptionClass(option)}
                onClick={() => handleAnswer(option)}>
                <span className="mcq-option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="mcq-option-text">
                  {option}
                </span>
                {isAnswered && option === current.correct && (
                  <CheckCircle size={18} strokeWidth={2}
                    color="var(--easy)"
                    style={{marginLeft:'auto', flexShrink:0}} />
                )}
                {isAnswered && option === selectedAnswer
                  && option !== current.correct && (
                  <XCircle size={18} strokeWidth={2}
                    color="var(--hard)"
                    style={{marginLeft:'auto', flexShrink:0}} />
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className={`mcq-feedback ${selectedAnswer === current.correct ? 'correct' : 'wrong'}`}>
              <span>
                {selectedAnswer === current.correct
                  ? <CheckCircle size={15} strokeWidth={2} />
                  : <XCircle size={15} strokeWidth={2} />
                }
                {selectedAnswer === current.correct
                  ? `Correct! `
                  : `Wrong! Correct answer: ${current.correct}. `
                }
                {current.explanation}
              </span>
            </div>
          )}

          {isAnswered && (
            <button
              className="btn-primary mcq-next-btn"
              onClick={handleNext}>
              {currentIdx + 1 >= questions.length
                ? 'See Results'
                : 'Next Question'}
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MCQPage;