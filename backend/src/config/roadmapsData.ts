export interface RoadmapPhase {
  name: string;
  topics: string[];
  estimatedTime: string;
}

export interface CareerLevelRoadmap {
  phases: RoadmapPhase[];
  recommendedProjects: string[];
  interviewPrepTopics: string[];
  practiceQuestions: string[];
}

export interface CareerTrackRoadmaps {
  Beginner: CareerLevelRoadmap;
  Intermediate: CareerLevelRoadmap;
  Advanced: CareerLevelRoadmap;
}

export const CAREER_ROADMAPS: Record<string, CareerTrackRoadmaps> = {
  'software engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Programming Fundamentals', topics: ['Basic Syntax & Variables', 'Control Flow & Loops', 'Basic Input/Output'], estimatedTime: '2 weeks' },
        { name: 'Phase 2: Object-Oriented Programming', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Encapsulation & Abstraction'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Basic Data Structures', topics: ['Arrays & Lists', 'Stacks & Queues', 'Time Complexity (Big O)'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Simple Projects & Prep', topics: ['Calculator App', 'File Reader/Writer', 'Basic Algorithms Practice'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['CLI Command Calculator', 'Local Text Database File Reader'],
      interviewPrepTopics: ['OOP Pillars explained', 'Array vs Linked List structures'],
      practiceQuestions: ['Implement a Stack using an Array', 'Find duplicate characters in a String']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Advanced DSA & Recursion', topics: ['Trees & Graphs traversal', 'Dynamic Programming basics', 'Binary Search & Sorting algorithms'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Database Systems & SQL', topics: ['Relational Database Basics', 'SQL Joins & Indexing', 'Transaction ACID properties'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Web Protocols & APIs', topics: ['HTTP/HTTPS methods', 'REST API Architecture', 'Basic JSON Parsing'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Intermediate Projects', topics: ['Build a RESTful Task Manager', 'URL Shortener with database lookup', 'Git version branch logs'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Task Manager API with Express/SQL', 'URL Shortener with Redis cache lookup'],
      interviewPrepTopics: ['Database indexing details', 'Explain dynamic programming vs memoization'],
      practiceQuestions: ['Detect a loop in a Linked List', 'Find lowest common ancestor in BST']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: System Design & Scaling', topics: ['Load Balancers & Reverse Proxies', 'Horizontal vs Vertical Scaling', 'Database Sharding & Replication'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Microservices & Concurrency', topics: ['Microservices Design Patterns', 'Multi-threading & Thread Pools', 'Distributed Transactions'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Cloud & Observability', topics: ['Containerization with Docker', 'Kubernetes basics', 'Monitoring & APMs (Grafana/Prometheus)'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Advanced Systems Prep', topics: ['Designing Rate Limiters', 'Designing Twitter/Uber-like systems', 'Mock Architectural reviews'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Distributed Chat Server with WebSockets', 'Real-time Analytics Dashboard using Kafka'],
      interviewPrepTopics: ['CAP Theorem & Distributed Consensus', 'Cache coherence & CDN caching strategies'],
      practiceQuestions: ['Design a Rate Limiter system', 'Design a URL Shortener at scale']
    }
  },
  'full stack developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Frontend Basics', topics: ['HTML5 Structuring', 'CSS3 Layouts & Flexbox', 'Basic JS DOM manipulation'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Backend & Web Servers', topics: ['Node.js runtime', 'Express.js servers', 'Routing and Middleware'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Simple Databases', topics: ['MongoDB document stores', 'SQL CRUD operations', 'ORM/ODM basics'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Full Stack Integration', topics: ['Connecting forms to APIs', 'Deploying on Vercel/Render', 'Git fundamentals'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Full Stack Note Taking App', 'Personal Portfolio with feedback form'],
      interviewPrepTopics: ['Client-server model', 'HTTP Request-Response lifecycle'],
      practiceQuestions: ['How does a GET request differ from POST?', 'Explain CSS Flexbox alignments']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: React & SPA Frameworks', topics: ['React Components & Props', 'React Hooks (useState, useEffect)', 'State Management basics'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Database Joins & Schemas', topics: ['Relational Joins', 'Mongoose aggregation pipelines', 'Database migrations'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Auth & Security', topics: ['JWT Token validation', 'Session-based cookies', 'CORS & CORS policies'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: E-commerce Mock', topics: ['Building shopping cart endpoints', 'Integrating payment APIs', 'Unit testing with Jest'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['E-commerce store front with auth', 'Real-time collaborative markdown workspace'],
      interviewPrepTopics: ['JWT Authentication structure', 'SQL Joins vs NoSQL aggregations'],
      practiceQuestions: ['What is the virtual DOM in React?', 'How do you secure endpoints using JWT?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: SSR & Next.js Framework', topics: ['Server-Side Rendering (SSR)', 'Static Site Generation (SSG)', 'Next.js App Router rules'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: System Architecture & GraphQL', topics: ['GraphQL API structures', 'WebSockets for two-way communication', 'SQL Performance tuning'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: CI/CD & Cloud Orchestration', topics: ['Dockerizing Fullstack apps', 'GitHub Actions automation pipelines', 'AWS Deployments (ECS/RDS)'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Production Auditing', topics: ['Lighthouse Auditing and speed indexing', 'Web Security (OWASP Top 10 prevention)', 'API rate limiting implementation'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['SaaS platform with subscription plans', 'Real-time multiplayer gaming lobby dashboard'],
      interviewPrepTopics: ['SSR vs Client-Side rendering performance', 'OAuth2 and SSO structures'],
      practiceQuestions: ['Describe how to prevent SQL injection & XSS attacks', 'Design a scalable notification service']
    }
  },
  'frontend developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Modern HTML & CSS', topics: ['HTML5 semantic layout tags', 'CSS Layouts (Grid & Flexbox)', 'CSS responsive breakpoints'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Modern JavaScript', topics: ['ES6 Array methods', 'Async/Await & Promises', 'API requests (fetch/axios)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Git & Packages', topics: ['Git checkout and branches', 'npm package installations', 'Build tools like Vite'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: UI Project', topics: ['Responsive dashboard static template', 'Form validator page', 'Vite deployment'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Vite Landing Page', 'Interactive Quote Board'],
      interviewPrepTopics: ['CSS selectors specificity', 'DOM tree manipulation and events'],
      practiceQuestions: ['Explain event delegation in JS', 'How does flex-grow work?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: React Basics & State', topics: ['JSX & Component architecture', 'State vs Props management', 'Lifecycle Hook overrides'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Advanced React & Routing', topics: ['React Router Setup', 'Context API & Zustand state management', 'Controlled vs Uncontrolled Forms'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: CSS Frameworks & Styles', topics: ['TailwindCSS utility structures', 'Styled Components', 'Framer Motion micro-animations'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Complex Frontend Practice', topics: ['Building multi-step form flow', 'State persistence in LocalStorage', 'Webpack configurations'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Weather App with search history', 'Personalized kanban board dashboard'],
      interviewPrepTopics: ['React virtual DOM reconciliation', 'CSS container queries vs media queries'],
      practiceQuestions: ['What is the difference between useEffect and useLayoutEffect?', 'Explain React render optimizations']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Server Components & Next.js', topics: ['React Server Components (RSC)', 'Next.js App directory rules', 'Streaming & Suspense page loads'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Frontend Performance', topics: ['Code Splitting & Lazy loading', 'Image optimization & Webp', 'Virtualizing long arrays'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Testing & Type-safety', topics: ['TypeScript interface declarations', 'Unit Testing components with Jest', 'Cypress E2E integrations'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Web Security & Architecture', topics: ['XSS and CSRF preventions', 'Client caching headers', 'Design Systems & Component Libraries'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Next.js SaaS Landing with multi-theme panels', 'Real-time collaborative whiteboard app'],
      interviewPrepTopics: ['Web Vitals (LCP, FID, CLS) optimization', 'React fiber architecture'],
      practiceQuestions: ['Explain hydration errors and how to solve them', 'Design a scalable design system component package']
    }
  },
  'backend developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Server Basics', topics: ['Node.js runtime framework', 'Express.js routing structure', 'JSON request parsing'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Relational Databases', topics: ['Introduction to PostgreSQL', 'Simple SQL tables & values', 'Primary Keys & Relationships'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Middleware & CORS', topics: ['Express middleware setup', 'Handling CORS headers', 'API Error wrapper structures'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple REST App', topics: ['Building CLI API tools', 'Todo application database endpoints', 'Environment configuration'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Simple Book Registry API', 'Contact List Database API'],
      interviewPrepTopics: ['REST API HTTP codes mappings', 'SQL Primary Key vs Foreign Key'],
      practiceQuestions: ['What is Express middleware?', 'Explain differences between HTTP 200, 201, 400, 401, 500']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Database Joins & Indexes', topics: ['Relational database Joins', 'SQL Indexing strategies', 'Database transaction rollbacks'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Token-based Security', topics: ['Password hashing with bcryptjs', 'JWT signing & middleware checks', 'Role-based access lists (RBAC)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: NoSQL Database Storage', topics: ['MongoDB document stores', 'Mongoose schema declarations', 'Aggregation pipeline arrays'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: API Testing & Docs', topics: ['Documenting APIs using Swagger', 'Unit testing routes with Supertest', 'Git merge and PR structures'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Blog Platform Backend API with User Roles', 'Chat Server API utilizing MongoDB'],
      interviewPrepTopics: ['SQL vs NoSQL scaling constraints', 'Password encryption flow details'],
      practiceQuestions: ['How does database indexing work?', 'What is a SQL Injection vulnerability?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Distributed Caching & Scaling', topics: ['Redis caching layer configurations', 'Rate limiting request bounds', 'Distributed Session management'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Event-Driven Architecture', topics: ['Message queues (RabbitMQ/Kafka)', 'Pub-Sub design models', 'Asynchronous task workers'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Containerization & Cloud', topics: ['Dockerizing node backend services', 'Kubernetes orchestrations', 'AWS ECS deployments'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: System Scaling Prep', topics: ['Designing distributed tracking IDs', 'API Gateway patterns', 'Performance load testing (K6)'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Scalable Real-time Messaging API with Kafka', 'SaaS billing backend with stripe integration'],
      interviewPrepTopics: ['Microservices transaction consistency (Saga pattern)', 'SQL Isolation Levels'],
      practiceQuestions: ['Design a distributed task scheduler', 'How do you handle high database write loads?']
    }
  },
  'java developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Java Fundamentals', topics: ['Variables, Types, and Arrays', 'Control statements & loops', 'Strings and StringBuilders'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: OOP & Interfaces', topics: ['Classes and inheritance', 'Interface contracts', 'Java Exception Handling'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Java Collections', topics: ['List, Set, Map implementations', 'Generics syntax', 'Build utilities (Maven/Gradle)'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple Java Apps', topics: ['File parser console tool', 'Calculator system OOP', 'JUnit basics'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Inventory Tracker Console App', 'Student Registry System'],
      interviewPrepTopics: ['Java OOP principles', 'Abstract Class vs Interface'],
      practiceQuestions: ['What is the difference between == and equals()?', 'Explain Java Exception hierarchy']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Spring Boot & MVC', topics: ['Spring IoC & Dependency Injection', 'Spring RestControllers', 'Spring Beans scope'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Persistence with Hibernate', topics: ['JPA & Hibernate mapping', 'Spring Data JPA repositories', 'Entity relationships (@OneToMany)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Java Streams & Threads', topics: ['Java Streams API', 'Lambda expressions', 'Basic Multithreading (Runnable)'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Secure Spring App', topics: ['Spring Security with JWT', 'H2 databases integrations', 'Unit testing Spring Boot controllers'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Library Management REST API', 'Online Quiz Backend with Auth'],
      interviewPrepTopics: ['Spring bean lifecycle', 'Java Collection performance limits'],
      practiceQuestions: ['Explain dependency injection in Spring Boot', 'How do Java Streams work under the hood?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Spring Cloud & Microservices', topics: ['Spring Cloud Gateway', 'Service Discovery (Eureka)', 'Config Server configuration'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Concurrency & JVM Tuning', topics: ['JVM Memory Architecture (Heap/Stack)', 'Garbage Collection algorithms', 'ExecutorService & ThreadPools'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Advanced DB & Messaging', topics: ['SQL Query optimization in Hibernate', 'Kafka integrations with Spring', 'Distributed transaction Saga patterns'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: JVM Enterprise Auditing', topics: ['Dockerizing Spring Boot jars', 'Monitoring using Actuator & Prometheus', 'Performance tuning JVM heap parameters'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Scalable Microservices Banking API', 'Kafka Event processor with Spring Data'],
      interviewPrepTopics: ['Java Garbage Collection tuning parameters', 'Spring Boot Autoconfiguration mechanics'],
      practiceQuestions: ['How do you debug a Java memory leak?', 'Design a Spring Boot microservice with circuit breaker (Resilience4j)']
    }
  },
  'python developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Python Core', topics: ['Variables, Tuples, and Lists', 'Loops & List comprehensions', 'Function declarations & arguments'], estimatedTime: '2 weeks' },
        { name: 'Phase 2: Python OOP', topics: ['Classes, methods, and inheritances', 'File IO & exception checks', 'Virtual environments (pip/venv)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Scripting & Web API basics', topics: ['Requests module for REST calls', 'Web scraping basics (BeautifulSoup)', 'Flask framework basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Project & PyTest', topics: ['CLI Scraper pipeline', 'Simple Flask REST app', 'PyTest basic assertions'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['CLI Web Scraper', 'Flask Note Keeper API'],
      interviewPrepTopics: ['Python Mutable vs Immutable data structures', 'List Comprehensions syntax'],
      practiceQuestions: ['How do lists differ from tuples in Python?', 'Explain the use of virtual environments']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Django Web Framework', topics: ['Django MVC/MVT structure', 'Django ORM schema management', 'Django Admin customizations'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: FastAPI & Async Python', topics: ['FastAPI REST API design', 'Pydantic schemas validation', 'Async/Await structures in Python'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Databases & SQL', topics: ['PostgreSQL connector setups', 'SQLAlchemy ORM integration', 'Database migrations (Alembic)'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Django REST Integration', topics: ['Django Rest Framework (DRF)', 'JWT auth configurations', 'Unit testing Python endpoints'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Django REST Blogging API', 'FastAPI Task Scheduler with SQL DB'],
      interviewPrepTopics: ['Async vs Sync execution in Python', 'Django ORM query optimization (select_related)'],
      practiceQuestions: ['What is the Global Interpreter Lock (GIL) in Python?', 'How do you perform database migrations in Django?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Multiprocessing & Scaling', topics: ['Multiprocessing vs Threading in Python', 'Celery async task runners', 'Redis cache layer integration'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Python MLOps & Data tools', topics: ['Dockerizing Python microservices', 'Pandas & NumPy data processing optimizations', 'WebSockets in FastAPI'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: AWS & CI/CD deployment', topics: ['AWS Lambda Python deploy', 'GitHub Actions build pipelines', 'Monitoring Python apps using Sentry'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: High-Scale Python Architectures', topics: ['API Gateway connections', 'Distributed task management pipelines', 'Python memory profile audits'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Real-time Image processing API', 'SaaS backend with FastAPI, Celery, and Redis'],
      interviewPrepTopics: ['Python decorators & generator patterns', 'WSGI vs ASGI specifications'],
      practiceQuestions: ['How does Python handle memory allocation (Garbage Collection)?', 'Design an asynchronous web crawler at scale']
    }
  },
  'mern stack developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Front-End Basics (HTML/CSS/JS)', topics: ['HTML & CSS Layouts', 'ES6 JavaScript methods', 'Vite & Frontend tools'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: React Fundamentals', topics: ['React Components and props', 'State & Hook usages (useState, useEffect)', 'API requests via axios'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Backend Node/Express', topics: ['Node.js servers', 'Express Routing middleware', 'CORS policies'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: MERN CRUD project', topics: ['Connecting React to Express APIs', 'Basic Git workflow', 'Deployment on Render'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['MERN Contact Registry App', 'Fullstack Todo app with Vite'],
      interviewPrepTopics: ['MERN structure diagram', 'React DOM state flows'],
      practiceQuestions: ['Explain state vs props in React', 'What is routing middleware in Express?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Mongoose schemas & MongoDB', topics: ['MongoDB document structure', 'Mongoose schema validation', 'Mongoose Joins ($lookup/populate)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: React Router & state', topics: ['React Router setups', 'Context API & Zustand state tools', 'JWT auth client wrappers'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: REST JWT Authentication', topics: ['Password hashing using bcryptjs', 'Express auth middleware verification', 'HTTP-only cookies'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: MERN Social App', topics: ['Handling profile setups', 'Unit testing backend controllers with Jest', 'MERN app optimization'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['MERN Social Media dashboard with auth', 'MERN Kanban Board with drag-drop'],
      interviewPrepTopics: ['JWT Token cycle in MERN', 'MongoDB indexing benefits'],
      practiceQuestions: ['What is the difference between localState and Context state?', 'How do you handle passwords securely?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Next.js & Server Components', topics: ['Migrating MERN to Next.js', 'React Server Components', 'Next.js API route configs'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: WebSockets & GraphQL', topics: ['Socket.io fullstack setup', 'GraphQL queries & mutations', 'Apollo Client integrations'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Dockerizing MERN Stack', topics: ['Dockerfiles for Client & Server', 'Docker Compose configurations', 'CI/CD pipeline triggers'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Production deployments', topics: ['AWS deployments (ECS/Fargate)', 'Web Security audits (helmet, sanitizers)', 'Server-side caching policies'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Real-time MERN collaborative workspace', 'Next.js E-commerce SaaS portal'],
      interviewPrepTopics: ['React hydration issues & SSR', 'OAuth2 flows & SSO login integrations'],
      practiceQuestions: ['Explain MERN security checks for XSS prevention', 'Design a scalable multi-room chat app using Socket.io']
    }
  },
  'data analyst': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Spreadsheet Fundamentals', topics: ['Excel VLOOKUP & INDEX/MATCH', 'Excel Pivot Tables & Charts', 'Excel text parsing functions'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Database Basics & SQL', topics: ['Introduction to Relational databases', 'Basic SELECT, WHERE, and LIMIT', 'SQL order and sorting'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Basic Statistics', topics: ['Mean, Median, and Mode', 'Standard Deviation & Variance', 'Understanding Normal distribution'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Visual Report Project', topics: ['Building Excel analytics report', 'Creating basic SQL queries', 'Presentation structures'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Sales Report spreadsheet', 'Basic Customer SQL queries report'],
      interviewPrepTopics: ['Spreadsheet pivot charts', 'SQL queries select structures'],
      practiceQuestions: ['How does VLOOKUP differ from INDEX/MATCH?', 'What is standard deviation?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Intermediate SQL', topics: ['SQL INNER/LEFT/RIGHT Joins', 'SQL GROUP BY & HAVING aggregates', 'SQL Window Functions (ROW_NUMBER)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Tableau & Power BI', topics: ['Creating dashboard charts', 'DAX syntax in Power BI', 'Data modeling relationships'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Python for Analytics', topics: ['Pandas DataFrame setups', 'NumPy operations', 'Matplotlib visualizations'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Real-time Analytics Mock', topics: ['Building Power BI dashboard', 'SQL optimization tests', 'Reporting stats insights'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Power BI Sales Performance Tracker', 'Python Data Cleaning Pipeline'],
      interviewPrepTopics: ['SQL Joins performance', 'DAX vs Excel formulas'],
      practiceQuestions: ['Explain the SQL HAVING clause', 'How does ROW_NUMBER() work in SQL windowing?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Advanced SQL & Warehousing', topics: ['Writing CTEs & Subqueries', 'Data Warehousing concepts (Star schema)', 'Database query optimization'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Statistical Modeling', topics: ['Hypothesis Testing & P-values', 'A/B Testing design', 'Linear Regression basics'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Automated ETL Pipelines', topics: ['Building ETL pipelines', 'Airflow basics', 'Python pandas automation scripts'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Enterprise Analytics Prep', topics: ['Executive Dashboard presentation', 'Advanced data extraction audits', 'Business Metrics KPIs mapping'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['A/B Testing results analysis report', 'End-to-End SQL & Power BI logistics dashboard'],
      interviewPrepTopics: ['A/B testing pitfalls and biases', 'Star vs Snowflake data warehouse schemas'],
      practiceQuestions: ['How do you explain a high P-value to business stakeholders?', 'Optimize a slow GROUP BY database query']
    }
  },
  'data scientist': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Mathematics & Linear Algebra', topics: ['Vectors & Matrices', 'Calculus derivatives', 'Probability distributions'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Python Data tools', topics: ['NumPy array operations', 'Pandas DataFrame data frames', 'Matplotlib chart plotting'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Exploratory Data Analysis (EDA)', topics: ['Data cleaning strategies', 'Correlation matrices', 'Handling missing data values'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Linear Regression App', topics: ['CLI EDA reports builder', 'Linear Regression using Scikit-Learn', 'Git repositories'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['House Price Prediction (Linear Regression)', 'Exploratory Data Analysis on Customer Churn'],
      interviewPrepTopics: ['EDA pipelines', 'Correlation vs Causation'],
      practiceQuestions: ['What is the difference between covariance and correlation?', 'How do you handle null values in Pandas?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Supervised ML models', topics: ['Logistic Regression & Classifiers', 'Decision Trees & Random Forests', 'Support Vector Machines (SVM)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Model Validation & Tuning', topics: ['Train-Test split, Cross-Validation', 'Overfitting vs Underfitting', 'Hyperparameter tuning (GridSearchCV)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Feature Engineering', topics: ['One-Hot encoding, Label encoding', 'Feature scaling (StandardScaler)', 'Dimensionality Reduction (PCA)'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: ML Classification mock', topics: ['Credit scoring model', 'Evaluation metrics (ROC-AUC, F1-score)', 'Saving model jars (pickle/joblib)'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Credit Risk Classification Engine', 'Customer Segmentations with PCA'],
      interviewPrepTopics: ['Precision vs Recall trade-offs', 'Random Forest ensemble principles'],
      practiceQuestions: ['What is the ROC-AUC curve?', 'Explain the Bias-Variance tradeoff']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Deep Learning & NLP', topics: ['Neural Networks & Backpropagation', 'Natural Language Processing (NLP)', 'Deep Learning frameworks (PyTorch)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: MLOps & Deployments', topics: ['FastAPI model serving', 'Dockerizing ML endpoints', 'Model drift and tracking (MLflow)'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Big Data architectures', topics: ['Apache Spark big data analytics', 'ETL pipelines scaling', 'Cloud ML deployment (AWS SageMaker)'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Advanced Model Reviews', topics: ['Designing recommendation systems', 'Designing search relevance models', 'Deep learning mock reviews'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['FastAPI Predictive Model Deploy in Docker', 'Big Data Log Processor with Spark'],
      interviewPrepTopics: ['Vanishing gradient problem solutions', 'Recommendation system design patterns'],
      practiceQuestions: ['Design an anomaly detection model for credit cards', 'Explain backpropagation in deep neural networks']
    }
  },
  'machine learning engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Math & Python Basics', topics: ['Calculus & Linear Algebra', 'Python OOP syntax', 'NumPy & Pandas'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Intro to Machine Learning', topics: ['Supervised learning concepts', 'Scikit-Learn ML classifiers', 'Evaluating models (Accuracy/MSE)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Data Pipelines', topics: ['Data ingestion & SQL query runs', 'Feature standardizations', 'Feature selections'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple ML App', topics: ['CLI classification scripts', 'Model validation setups', 'Git pipelines'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Iris Dataset Classification model', 'Car Price Regression predictor'],
      interviewPrepTopics: ['Linear Algebra matrix dot products', 'Supervised vs Unsupervised classification'],
      practiceQuestions: ['What is gradient descent?', 'How do you check for outliers in data?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Advanced ML Models', topics: ['XGBoost & Gradient Boosting', 'Ensemble classifiers models', 'SVM & Kernels'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Neural Networks & PyTorch', topics: ['PyTorch tensors configurations', 'Multi-layer perceptron (MLP)', 'Loss functions & Adam optimizers'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Feature Stores & DBs', topics: ['Feature Stores configurations', 'Database caching for data pipelines', 'Feature extraction algorithms'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Model API deploy', topics: ['Saving PyTorch checkpoint weights', 'FastAPI backend model wrappers', 'Unit testing code endpoints'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['XGBoost Fraud Classification API', 'FastAPI Image Classifier endpoint'],
      interviewPrepTopics: ['Backpropagation mathematics', 'Regularization (L1/L2) checks'],
      practiceQuestions: ['What is the difference between L1 and L2 regularization?', 'Explain the concept of learning rate scheduling']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: ML System Design & Scale', topics: ['Distributed training (horovod)', 'ML model inference latencies optimizations', 'GPU acceleration (CUDA)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: MLOps & Pipelines', topics: ['KubeFlow, MLflow setups', 'Docker Container deployment in Kubernetes', 'Inference caching layers'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Specialized Neural Networks', topics: ['Transformers & Self-Attention', 'CNNs for visual processing', 'RNNs & LSTMs for time series'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Enterprise ML Systems', topics: ['Designing recommendation systems at scale', 'Designing real-time search scoring models', 'ML Security audits'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['SaaS ML Inference API in Kubernetes', 'Large Language Model (LLM) fine-tuning pipeline'],
      interviewPrepTopics: ['Self-Attention mechanism logic', 'High-throughput low-latency inference setups'],
      practiceQuestions: ['How do you optimize an ML model for edge device deployments?', 'Design a real-time recommendation ranker']
    }
  },
  'ai engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Python Core & Math', topics: ['Python OOP basics', 'Linear Algebra & matrices', 'JSON configuration parses'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: API integrations & LLMs', topics: ['OpenAI API requests', 'Prompt Engineering structures', 'JSON parsing API output'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Basic NLP', topics: ['Tokenization & word lists', 'Stopword removals', 'Vector space models'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple Chat Agent', topics: ['Building CLI OpenAI agent', 'Chat history memory management', 'GitHub repo setups'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['CLI ChatGPT Clone with chat logs', 'Simple AI Auto-Responder script'],
      interviewPrepTopics: ['Prompt engineering systems', 'Token limitations on GPT APIs'],
      practiceQuestions: ['What is zero-shot prompting?', 'How does token pricing influence prompt limits?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: LangChain & Vector DBs', topics: ['LangChain chains & agents', 'Vector Embeddings (OpenAI embeddings)', 'Vector databases (Pinecone, Chroma)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Retrieval-Augmented Generation (RAG)', topics: ['Document parsing pipelines', 'Chunking algorithms configurations', 'Contextual injection loops'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Semantic Search & Audits', topics: ['Semantic search vs keyword matches', 'JSON validations for LLM output', 'Moderation API setups'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Enterprise RAG App', topics: ['Building RAG API with FastAPI', 'Mocking embeddings endpoints', 'Testing latency constraints'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['SaaS RAG Chatbot over Custom Knowledge Base', 'AI Document Screening portal'],
      interviewPrepTopics: ['RAG architecture flows', 'Semantic embedding distances'],
      practiceQuestions: ['Explain chunking size trade-offs in RAG setups', 'How do vector databases perform indexing?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: LLM Fine-Tuning & Weights', topics: ['Fine-tuning vs Prompting RAG', 'LoRA & QLoRA methodologies', 'Dataset formatting parameters'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: AI Agents & Graph execution', topics: ['LangGraph workflows', 'Stateful agent cycles', 'Tool-calling execution modules'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Model Serving & Quantization', topics: ['Serving open weights (Ollama, vLLM)', 'Model weight Quantization (4-bit, 8-bit)', 'GPU resource scaling'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Autonomous Systems Prep', topics: ['Designing autonomous code agents', 'Guardrail frameworks configurations', 'Enterprise LLM billing limits'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Autonomous QA testing agent using LangGraph', 'vLLM hosted custom chatbot API'],
      interviewPrepTopics: ['LoRA adapters mechanics', 'Agentic system loop patterns'],
      practiceQuestions: ['How does model quantization affect accuracy and latency?', 'Design a multi-agent workflow for legal document summaries']
    }
  },
  'devops engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Linux Administration', topics: ['Bash CLI file operators', 'Permissions (chmod/chown)', 'Shell Scripting basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Git & CI/CD Intro', topics: ['Git commits & merges', 'GitHub Actions workflow configurations', 'Build jobs configurations'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Docker Basics', topics: ['Writing Dockerfiles', 'Docker build & run commands', 'Docker networking basics'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Automated Build App', topics: ['CLI build check scripts', 'Dockerizing simple web app', 'Local deployment scripts'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Automated Bash Backup Script', 'Dockerized React Static page deploy'],
      interviewPrepTopics: ['Docker file layered cache', 'Linux directory structure'],
      practiceQuestions: ['What is the difference between CMD and ENTRYPOINT in Docker?', 'How do you assign folder permissions in Linux?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Advanced Docker & Compose', topics: ['Docker Compose multiple containers', 'Docker Volumes mapping data', 'Multi-stage Docker builds'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Infrastructure as Code (IaC)', topics: ['Terraform provider structures', 'Terraform variables & modules', 'Ansible playbooks setups'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Kubernetes Fundamentals', topics: ['K8s Pods, Deployments, Services', 'Minikube local setups', 'kubectl command lists'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Intermediate CI/CD', topics: ['SonarQube code analysis in jobs', 'Deploying docker containers to AWS ECS', 'Unit test check pipelines'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Terraform deployed AWS infrastructure', 'Docker Compose hosted multi-container app'],
      interviewPrepTopics: ['Terraform state tracking file safety', 'Kubernetes Pod lifecycle'],
      practiceQuestions: ['What is a Kubernetes Service and why is it needed?', 'How does Terraform tracking state work?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Kubernetes at Scale', topics: ['K8s Ingress Controller rules', 'Helm Charts templates structure', 'Kubernetes HPA (Horizontal Pod Autoscaler)'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Monitoring & Observability', topics: ['Prometheus server setups', 'Grafana metric plotting sheets', 'Log stack (ELK/EFK) aggregations'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: GitOps & Service Mesh', topics: ['ArgoCD continuous sync configs', 'Service Mesh patterns (Istio)', 'Zero downtime deployments (Blue/Green)'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: DevOps Security (DevSecOps)', topics: ['Container vulnerability check scans', 'Securing HashiCorp Vault variables', 'Kubernetes NetworkPolicies'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['ArgoCD GitOps deployment in Kubernetes', 'Kubernetes cluster monitoring using Prometheus'],
      interviewPrepTopics: ['Rolling updates vs Blue/Green deployment', 'Istio sidecar injection mechanics'],
      practiceQuestions: ['Design a CI/CD pipeline with auto-rollback triggers', 'How do you secure secrets in Git pipelines?']
    }
  },
  'cloud engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Cloud Core Concepts', topics: ['IaaS vs PaaS vs SaaS definitions', 'Public vs Private vs Hybrid models', 'Basic Linux CLI commands'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: AWS Basics', topics: ['AWS console overview', 'EC2 VM configuration and setup', 'S3 storage buckets permissions'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Basic Networking', topics: ['IP Address structures', 'Public vs Private subnets', 'Virtual Private Cloud (VPC) basics'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple AWS Website', topics: ['Static HTML deployment on S3', 'Setting up security groups', 'Git setups'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['AWS Hosted static webpage', 'S3 Bucket files backup cron task'],
      interviewPrepTopics: ['AWS S3 bucket security', 'VPC subnets structure'],
      practiceQuestions: ['What are security groups in AWS?', 'How does static web hosting on S3 work?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: AWS Advanced Services', topics: ['AWS RDS database clusters', 'AWS Autoscaling Groups setups', 'Elastic Load Balancer (ELB) configuration'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Infrastructure as Code (IaC)', topics: ['Terraform AWS provider resources', 'CloudFormation YAML configurations', 'State management basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Serverless Cloud', topics: ['AWS Lambda triggers', 'API Gateway integrations', 'DynamoDB database tables'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Cloud deployment Mock', topics: ['Designing multi-AZ database configurations', 'IAM policies checks and audits', 'Cost calculations'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Serverless REST API with AWS Lambda & DynamoDB', 'Terraform deployed VPC & EC2 servers'],
      interviewPrepTopics: ['Autoscaling group metrics', 'IAM Principle of Least Privilege'],
      practiceQuestions: ['What is the difference between AWS IAM Role and IAM User?', 'How do you route traffic across multi-AZ configurations?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Multi-Cloud Architectures', topics: ['GCP Core engine services', 'Azure Active Directory setups', 'Hybrid cloud setups using VPN'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Cloud security & compliance', topics: ['AWS KMS key management service', 'VPC Peering rules & transit gateways', 'Compliance checks (GDPR/HIPAA/SOC2)'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Container Orchestration', topics: ['AWS EKS Kubernetes integrations', 'Docker container optimization in cloud', 'CI/CD cloud pipelines'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Enterprise Cloud systems', topics: ['Disaster Recovery (DR) backups configurations', 'Infrastructure migration pipelines', 'Cloud cost optimization reports'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Kubernetes cluster on AWS EKS with Terraform', 'Cloud Migration pipeline simulator'],
      interviewPrepTopics: ['RTO (Recovery Time Objective) vs RPO (Recovery Point Objective)', 'Direct Connect vs VPN performance'],
      practiceQuestions: ['Design a highly available database system with replica failover', 'Explain transit gateways in cloud routing']
    }
  },
  'cyber security analyst': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Networking Security basics', topics: ['TCP/IP model protocols', 'DNS, DHCP, SSL/TLS handshakes', 'Port scanning basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Linux Administration & Commands', topics: ['Linux folder structures', 'Linux access logs reading', 'SSH key setups'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Intro to Security Tools', topics: ['Wireshark packet captures', 'Nmap scan parameter options', 'Basic firewall configurations'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Audits project', topics: ['Nmap network mapping project', 'Analyzing Wireshark packet capture logs', 'Security reporting'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Local Network Scanner report', 'Wireshark HTTP log dissection'],
      interviewPrepTopics: ['TCP 3-way handshake sequence', 'Symmetric vs Asymmetric cryptography'],
      practiceQuestions: ['What ports are used by HTTP, HTTPS, SSH, DNS?', 'Explain how a basic firewall screens packets']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: SIEM & Monitoring logs', topics: ['Splunk search syntax queries', 'Log analysis patterns', 'Intrusion Detection System (IDS) alerts'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Web Vulnerabilities (OWASP)', topics: ['SQL injection vulnerabilities checks', 'Cross-Site Scripting (XSS) analysis', 'Cross-Site Request Forgery (CSRF)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Cryptography & Certificates', topics: ['AES, RSA algorithm basics', 'SSL certificate chain validation', 'Hashing (SHA-256) implementations'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Web Application Scan Mock', topics: ['Running scans using OWASP ZAP', 'Analyzing vulnerability reports', 'Mitigation script designs'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Web Application Vulnerability report', 'Splunk Dashboard for failed login audits'],
      interviewPrepTopics: ['XSS prevention protocols', 'IDS vs IPS systems'],
      practiceQuestions: ['What is the difference between stored and reflected XSS?', 'How does a SIEM collect network logs?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Incident Response & Forensics', topics: ['Malware file behaviors audits', 'Memory extraction analysis', 'Phishing email headers audits'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Cloud security configurations', topics: ['AWS IAM policy vulnerabilities', 'VPC network flow logs security checks', 'IAM security guidelines compliance'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Penetration Testing Basics', topics: ['Metasploit exploit utilities', 'Buffer overflow scripts inspection', 'Web authentication bypass checks'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Security Architecture reviews', topics: ['Zero Trust Network architectures design', 'Designing enterprise IAM topologies', 'Incident response runbooks'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Intrusion Response incident workbook', 'Vulnerability exploit lab in sandbox env'],
      interviewPrepTopics: ['Zero Trust framework components', 'Kerberos authentication protocol details'],
      practiceQuestions: ['How do you handle a ransomware incident within an organization?', 'Explain how to secure AWS VPC network flow logs']
    }
  },
  'network engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Network Fundamentals', topics: ['OSI 7 Layer specifications', 'IPv4 Addressing & Subnetting', 'Basic LAN/WAN switches'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Routing Protocols Core', topics: ['Static Routing vs Dynamic Routing', 'OSPF route configurations', 'VLAN setups and tagging'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Network Diagnostics', topics: ['Ping, Traceroute utilities', 'ARP cache operations', 'Cisco IOS CLI commands basics'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Cisco Packet Tracer Mock', topics: ['Setting up 3 switches network', 'Configuring inter-VLAN routing', 'Testing connectivity'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Subnet allocation table generator', 'Inter-VLAN Packet Tracer setup'],
      interviewPrepTopics: ['OSI Layer tasks description', 'Switch vs Router functions'],
      practiceQuestions: ['Explain the difference between TCP and UDP', 'How do you subnet a /24 IP range into 4 equal subnets?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: WAN Routing & BGP', topics: ['BGP peering rules', 'EIGRP routing protocol setup', 'NAT & PAT configuration'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Network Services & Security', topics: ['DHCP Server scopes', 'DNS resolution workflows', 'Access Control Lists (ACLs)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Wireless & VPNs', topics: ['IPsec VPN tunnel setups', 'WPA2/WPA3 security profiles', 'Wireless LAN Controller configuration'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Router security mock', topics: ['Configuring SSH access on routers', 'Designing firewall ACLs', 'Monitoring interface status'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['IPsec VPN Tunnel configuration model', 'Enterprise router ACL firewall script'],
      interviewPrepTopics: ['BGP path selections attributes', 'NAT vs PAT translation'],
      practiceQuestions: ['What is the purpose of OSPF area 0?', 'How does an IPsec VPN encrypt network packets?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Software-Defined Networking', topics: ['SDN controllers framework', 'SD-WAN architectures setup', 'Network API integrations'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Automation & Scripting', topics: ['Netmiko library scripting in Python', 'Ansible network automation playbooks', 'RESTCONF & NETCONF APIs'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Data Center Networks', topics: ['Spine-Leaf network topologies', 'VXLAN overlays configurations', 'BGP EVPN setups'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: High Available Networks design', topics: ['Designing redundant router configurations (HSRP/VRRP)', 'Designing WAN failover pathways', 'Traffic path reviews'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Python script to automate router backup tasks', 'Spine-Leaf network setup simulation'],
      interviewPrepTopics: ['Spine-Leaf fabric vs 3-Tier topology', 'VRRP router failover mechanism'],
      practiceQuestions: ['How do you automate bulk switch configuration using Ansible?', 'Design a redundant corporate WAN with dual ISPs']
    }
  },
  'android developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Kotlin Programming', topics: ['Kotlin Syntax & Variables', 'Null safety features', 'Functions and Lambdas'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: UI Layouts & XML', topics: ['ConstraintLayout layouts', 'RecyclerView list adapter configurations', 'Jetpack Compose basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Android Components', topics: ['Android Activities & Intents', 'Android Fragment cycles', 'Shared Preferences storage'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple Android App', topics: ['Task tracker local UI app', 'Click event animations', 'Deploying APK locally'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Android Notes App', 'Local Inventory Tracker UI'],
      interviewPrepTopics: ['Activity lifecycle overrides', 'Implicit vs Explicit intents'],
      practiceQuestions: ['What are the stages of the Android Activity lifecycle?', 'How does RecyclerView reuse views?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Jetpack Compose & State', topics: ['Composable function structures', 'State hoistings and flows', 'Compose layout constraints'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Networking & REST API', topics: ['Retrofit client configurations', 'Coroutines async execution pools', 'Serialization (Moshi/Gson)'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Room Database Persistence', topics: ['Room SQL entity declarations', 'Room DAOs query functions', 'Repository pattern setups'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Android App integration', topics: ['Building news listing Compose app', 'ViewModel state management configurations', 'Unit testing ViewModels'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['MVI-based News app with local Room database', 'Recipe Finder using Retrofit APIs'],
      interviewPrepTopics: ['Android Room migrations', 'Coroutines dispatchers configurations'],
      practiceQuestions: ['Explain the MVVM architecture in Android apps', 'What is LiveData vs Flow in Kotlin?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Dependency Injection', topics: ['Dagger-Hilt setup injections', 'Hilt ViewModel injection rules', 'Interface bindings in Hilt'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Android Performance & Audio', topics: ['Profiling CPU and Memory leaks', 'Background tasks (WorkManager)', 'Audio & Camera API integrations'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Testing & Build optimizations', topics: ['Mocking repositories with Mockk', 'Gradle build task optimizations', 'Kotlin Multiplatform (KMP) basics'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Play Store Auditing', topics: ['Android App Bundles (AAB)', 'ProGuard code shrinking rules', 'Offline caching state strategies'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Enterprise App utilizing Hilt, Room, and Retrofit', 'Real-time Android Audio Recorder app'],
      interviewPrepTopics: ['Dagger Hilt bindings configurations', 'Memory leak detection using LeakCanary'],
      practiceQuestions: ['How does WorkManager differ from JobScheduler?', 'Explain how ProGuard optimizes Kotlin bytecodes']
    }
  },
  'ios developer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Swift Fundamentals', topics: ['Swift Variables, Optionals, and Control', 'Swift Closures & Structures', 'Swift Enums and Classes'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: SwiftUI Layouts', topics: ['SwiftUI Views hierarchy', 'Stacks (HStack, VStack, ZStack)', 'List view rendering'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: iOS SDK Core', topics: ['ViewController lifecycles', 'UIKit basics for legacy support', 'UserDefaults for local storage'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Simple Swift app', topics: ['Habits tracker UI application', 'Button actions and navigation', 'Simulators checks'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['iOS Habit Counter app', 'Apple Simulator Calculator UI'],
      interviewPrepTopics: ['Swift Value types vs Reference types', 'UserDefaults limitations'],
      practiceQuestions: ['Explain the difference between Class and Struct in Swift', 'What are Swift optionals?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Advanced SwiftUI & State', topics: ['@State, @Binding, @StateObject', 'Combine framework data pipelines', 'SwiftUI Animations basics'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Networking & URLSession', topics: ['URLSession API requests', 'Codable serialization structures', 'Async/Await structures in Swift'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: CoreData Local Persistence', topics: ['CoreData Entities configurations', 'CoreData context management', 'Database migrations'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: iOS App integration mock', topics: ['Building weather app with core maps', 'MVVM architecture implementations', 'XCTest unit assertions'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['iOS Weather app with CoreData logs', 'Movie search dashboard using SwiftUI'],
      interviewPrepTopics: ['Swift ARC (Automatic Reference Counting)', 'CoreData entity synchronization'],
      practiceQuestions: ['How do you prevent retain cycles in Swift closures?', 'What is the difference between @StateObject and @ObservedObject?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Custom UI & CoreGraphics', topics: ['CoreGraphics rendering rules', 'SwiftUI custom layouts', 'Swift concurrency actors'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: iOS Performance tuning', topics: ['Instruments allocations profiling', 'GCD (Grand Central Dispatch) setups', 'Offline synchronization patterns'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: App modularity & Frameworks', topics: ['Creating Swift Package Manager (SPM) modules', 'Testing mock mocks (Quick/Nimble)', 'CoreML basics'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: App Store Submissions', topics: ['TestFlight configuration flows', 'App Store Connect publishing pipelines', 'App thinning & binary optimizations'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Modularized iOS SaaS client', 'Audio Processing iOS app using CoreAudio'],
      interviewPrepTopics: ['Swift Actors & Thread-safety', 'App Thinning & Asset catalogs optimizations'],
      practiceQuestions: ['Explain how Grand Central Dispatch handles priority queues', 'Design a offline-first sync cache for iOS']
    }
  },
  'qa/test engineer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Testing Basics', topics: ['Software Development Lifecycle (SDLC)', 'Test case documentation models', 'Bug reporting & tracking systems (Jira)'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Manual Testing', topics: ['Black Box testing techniques', 'Smoke testing, regression testing checklists', 'Boundary Value Analysis'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Web Diagnostics basics', topics: ['Browser inspector tools (DevTools)', 'Inspect DOM elements', 'REST API request manual testing (Postman)'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Test Suite project', topics: ['Writing test plans for web application', 'Postman manual test suites', 'Jira bug tracking mock logs'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['E-commerce Web App Test Plan', 'Postman API Test Suite'],
      interviewPrepTopics: ['Boundary Value Analysis explained', 'Bug report critical elements'],
      practiceQuestions: ['What is the difference between severity and priority of a bug?', 'How do you design test cases for a login page?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Automation with Selenium', topics: ['Selenium WebDriver API calls', 'Page Object Model (POM) design', 'XPath & CSS selectors locators'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: PyTest / TestNG framework', topics: ['Writing automated assertions', 'Test parameters & data loops', 'HTML test execution reports'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: API Test Automation', topics: ['RestAssured (Java) or Requests (Python)', 'Validating JSON API responses', 'API authentication check scripts'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: CI/CD integration mock', topics: ['Running selenium tests in headless browser', 'Integrating tests in GitHub Actions', 'Report publishers setups'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Automated Selenium E-commerce test framework', 'Postman Automated Runner collection'],
      interviewPrepTopics: ['Page Object Model benefits', 'Implicit vs Explicit waits in Selenium'],
      practiceQuestions: ['How does a Page Object Model improve automation code?', 'How do you solve synchronization issues in automation?']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Modern JS Automation', topics: ['Playwright automation frameworks', 'Cypress test runs configurations', 'Visual Regression testing tools'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Performance & Load Testing', topics: ['JMeter load scenarios creation', 'K6 script automation loops', 'Performance bottlenecks analysis'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Security & DB testing', topics: ['SQL database state validations', 'API fuzzing tests configurations', 'OWASP scan integration tools'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Enterprise QA Strategy', topics: ['Test automation metrics (coverage)', 'Designing distributed test execution grids', 'Quality assurance roadmap audits'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Playwright end-to-end framework', 'K6 load testing script for e-commerce API'],
      interviewPrepTopics: ['Cypress vs Playwright execution speeds', 'Load testing thread limits'],
      practiceQuestions: ['Design a performance load test setup for a ticketing system', 'How do you perform visual regression audits automated?']
    }
  },
  'business analyst': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Introduction to Business Analysis', topics: ['BA role in SDLC methodologies', 'Software requirements types (Functional vs Non-Functional)', 'Jira requirements backlogs'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Excel & Reporting', topics: ['Excel VLOOKUP & SUMIFS', 'Excel pivot tables charts', 'Creating data spreadsheets'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Requirements Elicitation', topics: ['Interview structures with stakeholders', 'User Story writing syntax', 'Acceptance Criteria patterns'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: User Stories project', topics: ['Writing User Stories for feature requests', 'Business Analyst workbook setup', 'Presentation slides'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Product Requirement Document (PRD)', 'Stakeholder Interview analysis report'],
      interviewPrepTopics: ['Functional vs Non-Functional requirements', 'User Stories structure'],
      practiceQuestions: ['What is the difference between business requirements and system requirements?', 'How do you write a good user story?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Process Modeling & BPMN', topics: ['BPMN 2.0 notation flowcharts', 'Swimlane diagram designs', 'As-Is vs To-Be process models'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: SQL & Basic Data tools', topics: ['SQL INNER JOIN, LEFT JOIN queries', 'SQL GROUP BY aggregations', 'Tableau data dashboard connections'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Agile & Scrum frameworks', topics: ['Product backlog refinement sessions', 'Sprints planning and velocity metrics', 'Confluence document layouts'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Process mapping mock', topics: ['Modeling checkout flow with swimlanes', 'Analyzing transaction step bottlenecks', 'Reporting improvements'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Checkout Flow BPMN Process Swimlane', 'SQL-based Customer conversion report'],
      interviewPrepTopics: ['BPMN flowchart notations', 'Agile sprint cycles tasks'],
      practiceQuestions: ['How do you map a To-Be process flow for checkout?', 'Explain the purpose of product backlog refinement.']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Enterprise Architecture', topics: ['UML Use Case diagrams', 'UML Activity & State diagrams', 'Data flow mapping models'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Advanced Statistics & Analytics', topics: ['Product KPI tracking models', 'Customer feedback text sentiment analytics', 'A/B testing basics for BAs'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Stakeholder management at scale', topics: ['Managing conflicting product requirements', 'Risk analysis strategies', 'Change management frameworks'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: SaaS Product auditing', topics: ['Designing SaaS dashboard KPIs', 'Regulatory compliance assessments', 'SaaS PRD mock presentation reviews'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['Enterprise SaaS Product metrics dashboard design', 'Change Management project workbook'],
      interviewPrepTopics: ['UML diagrams vs BPMN flows', 'Managing scope creep strategies'],
      practiceQuestions: ['How do you manage conflicting requirements from two key stakeholders?', 'Design an activity diagram for an enterprise CRM system']
    }
  },
  'product manager': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Introduction to PM', topics: ['Product lifecycle stages', 'Agile vs Waterfall methodologies', 'Jira backlog fundamentals'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: User Research basics', topics: ['Creating user survey lists', 'User persona outlines', 'Competitive product matrix reviews'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: Product Specs', topics: ['Writing User Story cards', 'Writing acceptance criteria definitions', 'Confluence documentation basics'], estimatedTime: '2.5 weeks' },
        { name: 'Phase 4: Simple PRD project', topics: ['Creating first PRD document', 'Wireframing basic concepts', 'Presentation structures'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Mobile App PRD', 'Competitor Analysis spreadsheet'],
      interviewPrepTopics: ['Product lifecycle stages', 'Acceptance criteria Star methods'],
      practiceQuestions: ['What is the role of a PM in sprint planning?', 'How do you define user personas?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Prioritization Frameworks', topics: ['RICE prioritization matrix', 'MoSCoW criteria selections', 'Kano Model satisfaction checks'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Product Metrics & KPI', topics: ['AARRR Pirate metrics systems', 'North Star Metric selectors', 'Google Analytics setup basics'], estimatedTime: '3.5 weeks' },
        { name: 'Phase 3: UI UX Design & Wireframes', topics: ['Figma canvas layouts', 'Low-fidelity wireframing flows', 'User testing interview questions'], estimatedTime: '3 weeks' },
        { name: 'Phase 4: Product roadmap mock', topics: ['Building product roadmaps in Jira', 'Stakeholder alignment slide deck', 'Prerender launch checklist'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Product Launch Roadmap Presentation', 'RICE Matrix prioritizations spreadsheet'],
      interviewPrepTopics: ['Pirate metrics AARRR tracking', 'Handling technical debt decisions'],
      practiceQuestions: ['How do you select your product North Star metric?', 'Explain how you prioritize features using RICE.']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Business Model & Pricing', topics: ['SaaS pricing models structure', 'Unit economics calculation models (CAC, LTV)', 'Product-led growth (PLG) strategies'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Product Strategy & Scale', topics: ['Market sizing evaluations (TAM/SAM/SOM)', 'Product internationalization roadmap', 'A/B Testing statistical checks'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Tech Architecture for PMs', topics: ['System design load bottlenecks', 'API structures & data sync formats', 'Database schema fundamentals'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Product Portfolio Audits', topics: ['Designing multi-product portfolios', 'Enterprise launch checklists and compliance', 'Product strategy workbook review'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['TAM calculations and Go-to-Market Strategy deck', 'E-commerce checkout AB test report'],
      interviewPrepTopics: ['LTV to CAC ratio details', 'Product Led Growth vs Sales Led Growth'],
      practiceQuestions: ['How do you handle a scenario where LTV drops below CAC?', 'Design a roadmap for internationalizing a video SaaS']
    }
  },
  'ui/ux designer': {
    Beginner: {
      phases: [
        { name: 'Phase 1: Design Principles', topics: ['Color theory & palettes', 'Typography & hierarchy', 'Grid layouts & spacing'], estimatedTime: '3 weeks' },
        { name: 'Phase 2: Figma Basics', topics: ['Figma vector tools canvas', 'Figma components & instances', 'Auto-Layout constraints basics'], estimatedTime: '3 weeks' },
        { name: 'Phase 3: User Flow Basics', topics: ['User journey mappings', 'Low-fidelity sketches wireframes', 'Information architecture structures'], estimatedTime: '2 weeks' },
        { name: 'Phase 4: Portfolio Project', topics: ['Figma landing page wireframe', 'Clickable prototype demo', 'Design system style guide'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Figma Landing Page UI Design', 'Interactive Mobile App mockup Prototype'],
      interviewPrepTopics: ['Color hierarchy structures', 'User Journey map layouts'],
      practiceQuestions: ['Explain the difference between UX and UI', 'How do you construct a typography scale?']
    },
    Intermediate: {
      phases: [
        { name: 'Phase 1: Advanced Figma systems', topics: ['Figma variables & properties', 'Design system token systems', 'Interactive component animations'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: UX Research & testing', topics: ['Stakeholder usability tests', 'Card sorting methodology', 'A/B visual testing setups'], estimatedTime: '3.5 weeks' },
        { name: 'Phase 3: Design to Developer Handoff', topics: ['Redlining layouts specs', 'CSS export parameter inspections', 'Design system style documentation'], estimatedTime: '3.5 weeks' },
        { name: 'Phase 4: Complex dashboard layout', topics: ['Figma dashboard with dark theme', 'Figma library setups', 'Usability reports writing'], estimatedTime: '2 weeks' }
      ],
      recommendedProjects: ['Figma SaaS Dashboard Design System', 'Usability Testing & Redesign report'],
      interviewPrepTopics: ['Auto Layout constraints', 'Responsive grids alignments'],
      practiceQuestions: ['How do you structure a Figma handoff file?', 'Explain how component variants improve design systems.']
    },
    Advanced: {
      phases: [
        { name: 'Phase 1: Advanced Interaction Design', topics: ['Micro-interactions design models', 'Framer motion prototyping code', 'Lottie animation configurations'], estimatedTime: '4 weeks' },
        { name: 'Phase 2: Accessibility (WCAG)', topics: ['WCAG AA/AAA compliance checks', 'Color contrast ratio tools', 'Keyboard navigation layout flows'], estimatedTime: '4 weeks' },
        { name: 'Phase 3: Product UX Strategy', topics: ['UX KPI metrics (conversion, drop-off)', 'Growth design patterns loops', 'Design system maintenance at scale'], estimatedTime: '4 weeks' },
        { name: 'Phase 4: Enterprise Design Audits', topics: ['Enterprise website accessibility audits', 'Design leadership workbook reviews', 'Portfolio case studies preparations'], estimatedTime: '3 weeks' }
      ],
      recommendedProjects: ['WCAG AA Audited E-commerce redesign prototype', 'Advanced Interaction design micro-library in Framer'],
      interviewPrepTopics: ['WCAG AA compliance guidelines', 'Design Token system structures'],
      practiceQuestions: ['How do you audit an app for WCAG AA accessibility compliance?', 'Design an onboarding sequence optimized for maximum conversion']
    }
  }
};
