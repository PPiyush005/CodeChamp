package com.codechamp;

import com.codechamp.dsa.pattern.Pattern;
import com.codechamp.dsa.pattern.PatternRepository;
import com.codechamp.dsa.question.Question;
import com.codechamp.dsa.question.QuestionRepository;
import com.codechamp.dsa.topic.Topic;
import com.codechamp.dsa.topic.TopicRepository;
import com.codechamp.roadmap.track.RoadmapTrack;
import com.codechamp.roadmap.track.RoadmapTrackRepository;
import com.codechamp.roadmap.step.RoadmapStep;
import com.codechamp.roadmap.step.RoadmapStepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final PatternRepository patternRepository;
    private final QuestionRepository questionRepository;
    private final RoadmapTrackRepository roadmapTrackRepository;
    private final RoadmapStepRepository roadmapStepRepository;

    @Override
    public void run(String... args) {
        seedTopics();
        seedPatterns();
        seedRoadmaps();
        // Questions are seeded via SQL script
        // DO NOT seed questions from here
    }

    private void seedTopics() {
        if (topicRepository.count() > 0) return;

        String[][] topics = {
                {"Arrays", "Linear data structure with indexed elements"},
                {"Strings", "Sequence of characters and string manipulation"},
                {"Linked List", "Linear structure with nodes and pointers"},
                {"Stack", "LIFO data structure"},
                {"Queue", "FIFO data structure"},
                {"Trees", "Hierarchical data structure with nodes"},
                {"Graphs", "Network of nodes connected by edges"},
                {"Dynamic Programming", "Optimization using memoization"},
                {"Greedy", "Locally optimal choices for global solution"},
                {"Recursion", "Function calling itself"},
                {"Backtracking", "Explore all possibilities recursively"},
                {"Binary Search", "Efficient search on sorted data"},
                {"Hashing", "Key-value mapping for O(1) lookup"},
                {"Heap", "Complete binary tree with heap property"},
                {"Sorting", "Arranging elements in order"}
        };

        for (String[] t : topics) {
            topicRepository.save(
                    Topic.builder()
                            .name(t[0])
                            .description(t[1])
                            .build()
            );
        }
        System.out.println("✅ Topics seeded");
    }

    private void seedPatterns() {
        if (patternRepository.count() > 0) return;

        String[][] patterns = {
                {"Sliding Window",
                        "Fixed or variable window over array/string"},
                {"Two Pointers",
                        "Two indices moving toward each other"},
                {"Fast and Slow Pointers",
                        "Detecting cycles in linked lists"},
                {"Binary Search Pattern",
                        "Search on sorted or monotonic space"},
                {"BFS Pattern",
                        "Level order traversal using queue"},
                {"DFS Pattern",
                        "Depth traversal using recursion or stack"},
                {"Dynamic Programming Pattern",
                        "Break into subproblems, store results"},
                {"Backtracking Pattern",
                        "Explore all paths, prune invalid ones"},
                {"Greedy Pattern",
                        "Pick best local choice at each step"},
                {"Merge Intervals",
                        "Overlapping interval problems"}
        };

        for (String[] p : patterns) {
            patternRepository.save(
                    Pattern.builder()
                            .name(p[0])
                            .description(p[1])
                            .build()
            );
        }
        System.out.println("✅ Patterns seeded");
    }

    private void seedQuestions() {
        if (questionRepository.count() > 0) return;

        Topic arrays = topicRepository
                .findByNameIgnoreCase("Arrays").get();
        Topic strings = topicRepository
                .findByNameIgnoreCase("Strings").get();
        Topic linkedList = topicRepository
                .findByNameIgnoreCase("Linked List").get();
        Topic trees = topicRepository
                .findByNameIgnoreCase("Trees").get();
        Topic dp = topicRepository
                .findByNameIgnoreCase("Dynamic Programming").get();
        Topic binarySearch = topicRepository
                .findByNameIgnoreCase("Binary Search").get();
        Topic graphs = topicRepository
                .findByNameIgnoreCase("Graphs").get();

        Pattern slidingWindow = patternRepository
                .findByNameIgnoreCase("Sliding Window").get();
        Pattern twoPointers = patternRepository
                .findByNameIgnoreCase("Two Pointers").get();
        Pattern bfs = patternRepository
                .findByNameIgnoreCase("BFS Pattern").get();
        Pattern dfs = patternRepository
                .findByNameIgnoreCase("DFS Pattern").get();
        Pattern dpPattern = patternRepository
                .findByNameIgnoreCase(
                        "Dynamic Programming Pattern").get();
        Pattern binarySearchPattern = patternRepository
                .findByNameIgnoreCase(
                        "Binary Search Pattern").get();

        // Arrays Questions
        saveQuestion("Two Sum", Question.Difficulty.EASY,
                arrays, twoPointers,
                "https://leetcode.com/problems/two-sum/");
        saveQuestion("Best Time to Buy and Sell Stock",
                Question.Difficulty.EASY,
                arrays, slidingWindow,
                "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/");
        saveQuestion("Contains Duplicate",
                Question.Difficulty.EASY,
                arrays, null,
                "https://leetcode.com/problems/contains-duplicate/");
        saveQuestion("Maximum Subarray",
                Question.Difficulty.MEDIUM,
                arrays, null,
                "https://leetcode.com/problems/maximum-subarray/");
        saveQuestion("3Sum",
                Question.Difficulty.MEDIUM,
                arrays, twoPointers,
                "https://leetcode.com/problems/3sum/");
        saveQuestion("Product of Array Except Self",
                Question.Difficulty.MEDIUM,
                arrays, null,
                "https://leetcode.com/problems/product-of-array-except-self/");
        saveQuestion("Trapping Rain Water",
                Question.Difficulty.HARD,
                arrays, twoPointers,
                "https://leetcode.com/problems/trapping-rain-water/");

        // Strings Questions
        saveQuestion("Valid Anagram",
                Question.Difficulty.EASY,
                strings, null,
                "https://leetcode.com/problems/valid-anagram/");
        saveQuestion("Valid Palindrome",
                Question.Difficulty.EASY,
                strings, twoPointers,
                "https://leetcode.com/problems/valid-palindrome/");
        saveQuestion("Longest Substring Without Repeating",
                Question.Difficulty.MEDIUM,
                strings, slidingWindow,
                "https://leetcode.com/problems/longest-substring-without-repeating-characters/");
        saveQuestion("Longest Palindromic Substring",
                Question.Difficulty.MEDIUM,
                strings, null,
                "https://leetcode.com/problems/longest-palindromic-substring/");
        saveQuestion("Minimum Window Substring",
                Question.Difficulty.HARD,
                strings, slidingWindow,
                "https://leetcode.com/problems/minimum-window-substring/");

        // Linked List Questions
        saveQuestion("Reverse Linked List",
                Question.Difficulty.EASY,
                linkedList, null,
                "https://leetcode.com/problems/reverse-linked-list/");
        saveQuestion("Merge Two Sorted Lists",
                Question.Difficulty.EASY,
                linkedList, twoPointers,
                "https://leetcode.com/problems/merge-two-sorted-lists/");
        saveQuestion("Linked List Cycle",
                Question.Difficulty.EASY,
                linkedList, null,
                "https://leetcode.com/problems/linked-list-cycle/");
        saveQuestion("Remove Nth Node From End",
                Question.Difficulty.MEDIUM,
                linkedList, twoPointers,
                "https://leetcode.com/problems/remove-nth-node-from-end-of-list/");

        // Trees Questions
        saveQuestion("Invert Binary Tree",
                Question.Difficulty.EASY,
                trees, dfs,
                "https://leetcode.com/problems/invert-binary-tree/");
        saveQuestion("Maximum Depth of Binary Tree",
                Question.Difficulty.EASY,
                trees, dfs,
                "https://leetcode.com/problems/maximum-depth-of-binary-tree/");
        saveQuestion("Validate Binary Search Tree",
                Question.Difficulty.MEDIUM,
                trees, dfs,
                "https://leetcode.com/problems/validate-binary-search-tree/");
        saveQuestion("Level Order Traversal",
                Question.Difficulty.MEDIUM,
                trees, bfs,
                "https://leetcode.com/problems/binary-tree-level-order-traversal/");
        saveQuestion("Binary Tree Maximum Path Sum",
                Question.Difficulty.HARD,
                trees, dfs,
                "https://leetcode.com/problems/binary-tree-maximum-path-sum/");

        // Dynamic Programming Questions
        saveQuestion("Climbing Stairs",
                Question.Difficulty.EASY,
                dp, dpPattern,
                "https://leetcode.com/problems/climbing-stairs/");
        saveQuestion("House Robber",
                Question.Difficulty.MEDIUM,
                dp, dpPattern,
                "https://leetcode.com/problems/house-robber/");
        saveQuestion("Coin Change",
                Question.Difficulty.MEDIUM,
                dp, dpPattern,
                "https://leetcode.com/problems/coin-change/");
        saveQuestion("Longest Common Subsequence",
                Question.Difficulty.MEDIUM,
                dp, dpPattern,
                "https://leetcode.com/problems/longest-common-subsequence/");
        saveQuestion("Word Break",
                Question.Difficulty.MEDIUM,
                dp, dpPattern,
                "https://leetcode.com/problems/word-break/");

        // Binary Search Questions
        saveQuestion("Binary Search",
                Question.Difficulty.EASY,
                binarySearch, binarySearchPattern,
                "https://leetcode.com/problems/binary-search/");
        saveQuestion("Find Minimum in Rotated Array",
                Question.Difficulty.MEDIUM,
                binarySearch, binarySearchPattern,
                "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/");
        saveQuestion("Search in Rotated Sorted Array",
                Question.Difficulty.MEDIUM,
                binarySearch, binarySearchPattern,
                "https://leetcode.com/problems/search-in-rotated-sorted-array/");

        // Graph Questions
        saveQuestion("Number of Islands",
                Question.Difficulty.MEDIUM,
                graphs, bfs,
                "https://leetcode.com/problems/number-of-islands/");
        saveQuestion("Clone Graph",
                Question.Difficulty.MEDIUM,
                graphs, bfs,
                "https://leetcode.com/problems/clone-graph/");
        saveQuestion("Course Schedule",
                Question.Difficulty.MEDIUM,
                graphs, bfs,
                "https://leetcode.com/problems/course-schedule/");

        System.out.println("✅ Questions seeded");
    }

    private void saveQuestion(
            String title,
            Question.Difficulty difficulty,
            Topic topic,
            Pattern pattern,
            String url) {
        questionRepository.save(
                Question.builder()
                        .title(title)
                        .difficulty(difficulty)
                        .topic(topic)
                        .pattern(pattern)
                        .leetcodeUrl(url)
                        .build()
        );
    }

    private void seedRoadmaps() {
        if (roadmapTrackRepository.count() > 0) return;

        // Web Development Track
        RoadmapTrack web = roadmapTrackRepository.save(
                RoadmapTrack.builder()
                        .name("Web Development")
                        .description(
                                "From HTML basics to full stack web apps")
                        .estimatedWeeks(16)
                        .build()
        );

        String[][] webSteps = {
                {"HTML Fundamentals",
                        "Tags, forms, semantic HTML", "Beginner"},
                {"CSS Fundamentals",
                        "Selectors, box model, flexbox, grid", "Beginner"},
                {"JavaScript Basics",
                        "Variables, functions, DOM manipulation", "Beginner"},
                {"JavaScript Advanced",
                        "Promises, async/await, ES6+", "Intermediate"},
                {"React Basics",
                        "Components, props, state, hooks", "Intermediate"},
                {"React Advanced",
                        "Context, Redux, React Router", "Intermediate"},
                {"Node.js & Express",
                        "REST APIs, middleware, routing", "Intermediate"},
                {"Databases",
                        "SQL basics, MongoDB, ORM/ODM", "Intermediate"},
                {"Authentication",
                        "JWT, sessions, OAuth basics", "Advanced"},
                {"Deployment",
                        "Git, Docker basics, cloud deployment", "Advanced"}
        };

        int order = 1;
        for (String[] s : webSteps) {
            roadmapStepRepository.save(
                    RoadmapStep.builder()
                            .track(web)
                            .title(s[0])
                            .description(s[1])
                            .phase(s[2])
                            .stepOrder(order++)
                            .build()
            );
        }

        // Java Full Stack Track
        RoadmapTrack java = roadmapTrackRepository.save(
                RoadmapTrack.builder()
                        .name("Java Full Stack")
                        .description(
                                "Java backend with Spring Boot and React frontend")
                        .estimatedWeeks(20)
                        .build()
        );

        String[][] javaSteps = {
                {"Java Basics",
                        "OOP, collections, exception handling", "Beginner"},
                {"Java Advanced",
                        "Generics, streams, lambdas", "Intermediate"},
                {"Spring Boot Basics",
                        "REST APIs, dependency injection", "Intermediate"},
                {"Spring Data JPA",
                        "Entities, repositories, relationships", "Intermediate"},
                {"Spring Security",
                        "Authentication, JWT, authorization", "Advanced"},
                {"React Frontend",
                        "Build UI to connect with Spring Boot", "Intermediate"},
                {"MySQL Database",
                        "Schema design, queries, joins", "Intermediate"},
                {"Testing",
                        "JUnit, Mockito, integration tests", "Advanced"},
                {"Microservices Basics",
                        "Service decomposition, REST communication", "Advanced"},
                {"Deployment",
                        "Docker, AWS/GCP basics", "Advanced"}
        };

        order = 1;
        for (String[] s : javaSteps) {
            roadmapStepRepository.save(
                    RoadmapStep.builder()
                            .track(java)
                            .title(s[0])
                            .description(s[1])
                            .phase(s[2])
                            .stepOrder(order++)
                            .build()
            );
        }

        // Android Development Track
        RoadmapTrack android = roadmapTrackRepository.save(
                RoadmapTrack.builder()
                        .name("Android Development")
                        .description(
                                "Build native Android apps with Kotlin")
                        .estimatedWeeks(18)
                        .build()
        );

        String[][] androidSteps = {
                {"Kotlin Basics",
                        "Variables, functions, OOP in Kotlin", "Beginner"},
                {"Android Fundamentals",
                        "Activities, layouts, views", "Beginner"},
                {"UI Development",
                        "RecyclerView, fragments, navigation", "Intermediate"},
                {"Jetpack Compose",
                        "Modern declarative UI", "Intermediate"},
                {"Networking",
                        "Retrofit, REST API integration", "Intermediate"},
                {"Local Storage",
                        "Room database, SharedPreferences", "Intermediate"},
                {"Architecture",
                        "MVVM, ViewModel, LiveData", "Advanced"},
                {"Publishing",
                        "Signing, Play Store deployment", "Advanced"}
        };

        order = 1;
        for (String[] s : androidSteps) {
            roadmapStepRepository.save(
                    RoadmapStep.builder()
                            .track(android)
                            .title(s[0])
                            .description(s[1])
                            .phase(s[2])
                            .stepOrder(order++)
                            .build()
            );
        }

        System.out.println("✅ Roadmaps seeded");
    }
}