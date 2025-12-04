# Voice-Enabled Task Tracker

A full-stack task management application with intelligent voice input capabilities. Built with React, Node.js, Express, and MySQL.

**Demo Video**: [Link to be added]  
**GitHub Repository**: [Your repository URL]

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Project Setup](#-project-setup)
5. [API Documentation](#-api-documentation)
6. [Design Decisions & Assumptions](#-design-decisions--assumptions)
7. [AI Tools Usage](#-ai-tools-usage)
8. [Known Limitations](#-known-limitations)
9. [Future Enhancements](#-future-enhancements)

---

## 🎯 Features

### Task Management
- **Create tasks manually** with title, description, priority, status, and due date
- **Create tasks using voice input** - speak naturally and let AI extract task details
- **View tasks** in Kanban board or list view
- **Drag-and-drop** tasks between status columns (To Do → In Progress → Done)
- **Edit tasks** - update any field at any time
- **Delete tasks** with confirmation dialog
- **Search and filter** tasks by status, priority, and due date

### Voice Input (Main Differentiator) 🎤
- **Speech-to-Text** using Web Speech API (browser-native, no API key required)
- **Intelligent parsing** extracts:
  - Title from main action/purpose
  - Due dates (relative: "tomorrow", "next Monday"; absolute: "Jan 20")
  - Priority ("urgent", "high priority", "low priority")
  - Status (defaults to "To Do")
- **Review before saving** - see raw transcript alongside parsed fields
- **Edit parsed fields** before creating the task
- **Graceful handling** - missing fields use sensible defaults

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Drag-and-Drop**: @dnd-kit 6.3.1
- **HTTP Client**: Axios 1.13.2
- **Build Tool**: Vite 7.2.5
- **Animations**: Framer Motion 11.x
- **Speech-to-Text**: Web Speech API (browser-native, no API key required)

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 8.0+
- **Validation**: Joi 18.0.2
- **NLP/Date Parsing**: Chrono-node 2.9.0
- **CORS**: CORS 2.8.5

### Key Libraries
- **Chrono-node**: Natural language date parsing (handles "tomorrow", "next Monday", "Jan 20")
- **@dnd-kit**: Modern drag-and-drop for Kanban board
- **Joi**: Schema validation for API endpoints
- **Web Speech API**: Browser-native speech recognition (Chrome, Edge, Safari)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MySQL** 8.0 or higher ([Download](https://dev.mysql.com/downloads/))
- **Modern browser** with Web Speech API support (Chrome, Edge, or Safari recommended)
- **npm** (comes with Node.js)

---

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd voice-task-tracker
```

### 2. Install MySQL

- Download and install MySQL 8.0+ from https://dev.mysql.com/downloads/
- Set a root password during installation
- Ensure MySQL service is running

**Note:** The database will be created automatically when you start the backend! No manual SQL commands needed.

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=task_tracker
# DB_PORT=3306
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000

# Start the server (database auto-creates!)
npm run dev
```

**The backend will automatically:**
- ✅ Create the `task_tracker` database if it doesn't exist
- ✅ Create the `tasks` table with proper schema
- ✅ Add 6 sample tasks if the table is empty

The backend server will run on `http://localhost:5000`

**You should see:**
```
📦 Initializing database...
✅ Database 'task_tracker' ready
✅ Tasks table ready
📝 Adding sample data...
✅ Sample data added
✅ Database initialization complete

✅ Database connected successfully
🚀 Server running on port 5000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎮 Usage

### Manual Task Creation
1. Click "Add Task" button
2. Fill in the form fields
3. Click "Create Task"

### Voice Task Creation
1. Click "Voice Input" button
2. Click the microphone icon
3. Speak naturally, e.g., "Send project proposal to client by next Wednesday, high priority"
4. Review the parsed fields
5. Edit if needed
6. Click "Create Task"

### Task Management
- **View modes**: Toggle between Kanban board and list view
- **Drag-and-drop**: In Kanban view, drag tasks between columns to update status
- **Edit**: Click any task to open the edit form
- **Delete**: Click the delete icon and confirm
- **Search**: Use the search bar to filter by title or description
- **Filter**: Use dropdowns to filter by status or priority

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Endpoints

#### 1. Get All Tasks
**Method**: `GET /tasks`

**Query Parameters:**
- `status` (optional): Filter by status (`todo`, `in_progress`, `done`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `search` (optional): Search in title and description

**Example Request:**
```bash
GET /api/tasks?status=todo&priority=high
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Complete project proposal",
      "description": "Write and submit the Q1 project proposal",
      "priority": "high",
      "status": "todo",
      "due_date": "2025-12-05",
      "created_at": "2025-12-02T10:30:00.000Z",
      "updated_at": "2025-12-02T10:30:00.000Z"
    }
  ]
}
```

---

#### 2. Get Single Task
**Method**: `GET /tasks/:id`

**Path Parameters:**
- `id` (required): Task ID

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project proposal",
    "priority": "high",
    "status": "todo",
    "due_date": "2025-12-05"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task with ID 999 not found"
}
```

---

#### 3. Create Task
**Method**: `POST /tasks`

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2025-12-10"
}
```

**Field Validation:**
- `title` (required): String, 1-255 characters
- `description` (optional): String
- `priority` (optional): Enum (`low`, `medium`, `high`, `urgent`), default: `medium`
- `status` (optional): Enum (`todo`, `in_progress`, `done`), default: `todo`
- `dueDate` (optional): ISO date string (YYYY-MM-DD)

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 7,
    "title": "Task title",
    "priority": "medium",
    "status": "todo"
  }
}
```

---

#### 4. Update Task
**Method**: `PUT /tasks/:id`

**Request Body** (at least one field required):
```json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "urgent"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {...}
}
```

---

#### 5. Delete Task
**Method**: `DELETE /tasks/:id`

**Example Response:** `204 No Content`

---

#### 6. Parse Voice Transcript (Voice Input Feature)
**Method**: `POST /tasks/voice`

**Request Body:**
```json
{
  "transcript": "Send project proposal to client by next Wednesday, high priority"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Transcript parsed successfully",
  "data": {
    "transcript": "Send project proposal to client by next Wednesday, high priority",
    "parsed": {
      "title": "Send project proposal to client",
      "description": null,
      "priority": "high",
      "status": "todo",
      "dueDate": "2025-12-10"
    }
  }
}
```

**Note:** This endpoint only parses the transcript. The frontend displays the parsed data for user review, then calls `POST /tasks` to create the task.

---

### HTTP Status Codes

- `200 OK`: Successful GET or PUT request
- `201 Created`: Successful POST request (resource created)
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error or malformed request
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## 🏗 Project Structure

```
voice-task-tracker/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   └── nlpParser.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── DraggableTaskCard.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── VoiceTaskReview.jsx
│   │   │   └── SearchFilter.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── taskService.js
│   │   ├── types/
│   │   │   └── task.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🎨 Design Decisions & Assumptions

### Architecture Decisions

#### 1. Separation of Concerns
- **Frontend**: React SPA with component-based architecture
- **Backend**: Express.js with MVC pattern (Models, Controllers, Services)
- **Database**: MySQL with proper schema design and indexes
- **Rationale**: Clear separation makes the codebase maintainable, testable, and scalable

#### 2. RESTful API Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format across all endpoints
- Proper status codes (200, 201, 204, 400, 404, 500)
- **Rationale**: Predictable, industry-standard API design

#### 3. Component-Based UI
- Modular React components (TaskBoard, TaskCard, TaskForm, etc.)
- Reusable components with props
- Single responsibility principle
- **Rationale**: Easier to maintain, test, and extend

### Voice Input Decisions

#### 1. Web Speech API
- **Choice**: Browser-native Web Speech API
- **Alternatives Considered**: Google Cloud Speech-to-Text, AWS Transcribe
- **Rationale**: 
  - No API keys or costs required
  - Low latency (real-time processing)
  - Good accuracy for English
  - Simpler setup for users

#### 2. Chrono-node for Date Parsing
- **Choice**: Chrono-node library
- **Rationale**:
  - Robust natural language date parsing
  - Handles relative dates ("tomorrow", "next Monday", "in 3 days")
  - Handles absolute dates ("Jan 20", "15th December")
  - Well-maintained with good documentation

#### 3. User Review Before Save
- **Decision**: Always show raw transcript alongside parsed fields
- **Rationale**:
  - Transparency: Users see exactly what was captured
  - Accuracy: Users can correct any parsing errors
  - Trust: Users understand how the system interpreted their input

#### 4. NLP Parser Design
- **Approach**: Regex-based extraction with Chrono-node for dates
- **Extraction Order**: 
  1. Due dates (using Chrono-node)
  2. Priority keywords (urgent, high, low, medium)
  3. Status keywords (in progress, done, todo)
  4. Title (remove dates, priorities, filler words)
- **Rationale**: Simple, fast, and effective for the scope of this project

### Database Decisions

#### 1. MySQL
- **Choice**: MySQL 8.0+
- **Alternatives Considered**: PostgreSQL, MongoDB
- **Rationale**:
  - Reliable and well-documented
  - Suitable for structured task data
  - ACID compliance for data integrity
  - Easy to set up and manage

#### 2. Schema Design
- Single `tasks` table with proper data types
- Indexes on frequently queried fields (status, priority, due_date)
- Timestamps for created_at and updated_at
- **Rationale**: Simple, efficient, and meets all requirements

#### 3. Automatic Database Setup
- **Decision**: Backend auto-creates database and tables on startup
- **Rationale**: Simplifies setup for users, reduces manual steps

### UI/UX Decisions

#### 1. Dual View Modes
- **Kanban Board**: Visual, drag-and-drop interface
- **List View**: Detailed table view with all fields
- **Rationale**: Different users prefer different views for different tasks

#### 2. Dark Mode
- **Decision**: Implement complete dark theme
- **Rationale**: 
  - Modern UX expectation
  - Reduces eye strain
  - Professional appearance

#### 3. Drag-and-Drop
- **Library**: @dnd-kit
- **Rationale**: Modern, accessible, better performance than alternatives

### Assumptions

#### User Assumptions
1. **Single-user application**: No authentication or multi-user support needed
2. **English language**: Voice input and NLP parsing optimized for English
3. **Desktop-first**: Primary use case is desktop (mobile is responsive but not optimized)
4. **Modern browser**: Users have Chrome, Edge, or Safari with Web Speech API support

#### Technical Assumptions
1. **Internet connection**: Required for Web Speech API (uses Google's servers)
2. **Microphone access**: Users will grant microphone permissions
3. **Date context**: Relative dates are interpreted from current date
4. **Time zones**: All dates use server's local timezone

#### Voice Input Assumptions
1. **Clear speech**: Users speak clearly with minimal background noise
2. **Natural phrasing**: Users speak naturally (e.g., "Send email by tomorrow, high priority")
3. **Reasonable length**: Transcripts are typically 10-50 words
4. **Editing capability**: Users will review and edit parsed fields if needed

#### Data Assumptions
1. **Task titles**: Typically 5-50 characters
2. **Descriptions**: Optional, typically 0-500 characters
3. **Due dates**: Usually within next 30 days
4. **Priority distribution**: Most tasks are medium priority

### Known Limitations

1. **Web Speech API**: Requires internet connection, accuracy varies with accent
2. **Date parsing**: May not handle all edge cases (e.g., "the day after the day after tomorrow")
3. **Language support**: Only English is supported
4. **Browser compatibility**: Limited to browsers with Web Speech API
5. **No offline mode**: Application requires internet connection
6. **Single-user**: No authentication or task sharing

## 🤖 AI Tools Usage

### Tools Used

#### 1. Claude (Anthropic) - Primary AI Assistant
- **Usage**: Extensive use throughout the project
- **Role**: Architecture guidance, code generation, problem-solving

#### 2. GitHub Copilot - Code Completion
- **Usage**: During development for code suggestions
- **Role**: Autocomplete, boilerplate generation

### What AI Tools Helped With

#### Architecture & Design
- **Full-stack architecture**: Guidance on separating frontend, backend, and database layers
- **Component structure**: Suggestions for React component organization
- **API design**: RESTful endpoint structure and naming conventions
- **Database schema**: Table design, indexes, and relationships

#### Code Generation
- **Boilerplate code**: React components, Express routes, middleware
- **Validation schemas**: Joi validation rules for all API endpoints
- **Error handling**: Try-catch blocks, error middleware, user-friendly messages
- **NLP parser**: Logic for extracting task details from voice transcripts
- **SQL queries**: Database operations with proper error handling

#### Problem Solving
- **Voice input parsing**: Regex patterns for extracting priorities, dates, and titles
- **Date parsing**: Integration of Chrono-node for natural language dates
- **Drag-and-drop**: Implementation with @dnd-kit library
- **Dark mode**: Tailwind CSS dark mode classes across all components
- **Bug fixes**: 
  - Priority parsing bug ("low priority" incorrectly detected as "high")
  - Drag-and-drop status update bug
  - Multiple delete modals glitch

#### Documentation
- **README**: Comprehensive setup instructions and API documentation
- **Code comments**: Explaining complex logic, especially in NLP parser
- **API documentation**: Request/response examples for all endpoints
- **Design decisions**: Documenting architectural choices and rationale

### Notable Prompts & Approaches

#### 1. NLP Parser Development
**Prompt**: "Create a parser that extracts task title, due date, priority, and status from natural language. Handle relative dates like 'tomorrow' and 'next Monday', and priority keywords like 'urgent' and 'high priority'."

**Result**: Comprehensive NLP parser using Chrono-node and regex patterns

#### 2. Drag-and-Drop Implementation
**Prompt**: "Implement drag-and-drop for Kanban board using @dnd-kit. Tasks should move between columns and update status in the database."

**Result**: Smooth drag-and-drop with proper state management and API calls

#### 3. Dark Mode Implementation
**Prompt**: "Add complete dark mode support using Tailwind CSS. Include theme toggle with persistent preference."

**Result**: Full dark theme across all components with localStorage persistence

#### 4. Bug Fixing
**Prompt**: "The priority parser is detecting 'low priority' as 'high'. Fix the regex pattern."

**Result**: Reordered regex checks and removed ambiguous keywords

### What I Learned

#### Technical Skills
1. **Full-stack development**: Building a complete application from database to UI
2. **React hooks**: useState, useEffect, useRef for state management
3. **Web Speech API**: Browser-native speech recognition
4. **Natural language processing**: Using Chrono-node for date parsing
5. **Drag-and-drop**: Modern drag-and-drop with @dnd-kit
6. **REST API design**: Proper HTTP methods, status codes, and response formats
7. **Input validation**: Joi schemas for backend validation
8. **Error handling**: Comprehensive error handling on both frontend and backend
9. **Tailwind CSS**: Rapid UI development with utility classes
10. **Dark mode**: Implementing theme switching with Tailwind

#### Best Practices
1. **Separation of concerns**: Clear boundaries between layers
2. **Component modularity**: Reusable, single-responsibility components
3. **Error handling**: Always handle errors gracefully with user-friendly messages
4. **Input validation**: Validate on both client and server
5. **API design**: Consistent response format, proper status codes
6. **Code organization**: Logical folder structure, clear naming conventions
7. **Documentation**: Comprehensive README with setup instructions

#### Problem-Solving Approaches
1. **Iterative development**: Build features incrementally, test frequently
2. **Debugging**: Use console.log, browser DevTools, and error messages
3. **Research**: Read library documentation (Chrono-node, @dnd-kit)
4. **Testing**: Manual testing of all features and edge cases
5. **Refactoring**: Improve code quality after initial implementation

### How AI Tools Changed My Approach

#### Before AI Tools
- Would spend hours researching libraries and best practices
- Write boilerplate code manually
- Struggle with complex regex patterns
- Take longer to debug issues

#### With AI Tools
- Quickly get architecture recommendations
- Generate boilerplate code rapidly
- Get regex patterns and NLP logic suggestions
- Debug faster with AI-suggested solutions
- Focus more on business logic and UX

### Limitations of AI Tools

1. **Not always correct**: AI suggestions sometimes need debugging
2. **Context limitations**: AI doesn't always understand full project context
3. **Outdated information**: Some library versions or APIs may have changed
4. **Over-reliance risk**: Important to understand the code, not just copy it

### Key Takeaway

AI tools are **powerful accelerators** but not replacements for understanding. They helped me:
- Build faster (saved ~40% development time)
- Learn more (exposed to best practices and patterns)
- Focus on UX (less time on boilerplate, more on user experience)
- Debug efficiently (quick suggestions for common issues)

The key is to **use AI as a learning tool**, not just a code generator. Always understand what the code does and why.

## ⚠️ Known Limitations

### Voice Input Limitations
1. **Internet Required**: Web Speech API uses Google's servers, requires internet connection
2. **Accuracy Varies**: Recognition accuracy depends on:
   - Accent and pronunciation
   - Background noise
   - Microphone quality
   - Speaking speed and clarity
3. **Browser Support**: Limited to Chrome, Edge, and Safari (no Firefox support)
4. **Language**: Only English is supported

### Date Parsing Limitations
1. **Edge Cases**: May not handle complex relative dates (e.g., "the day after the day after tomorrow")
2. **Ambiguity**: "Next Friday" could mean this week or next week depending on context
3. **Time Zones**: All dates use server's local timezone
4. **Past Dates**: Automatically adjusts past dates to next year (may not always be desired)

### Application Limitations
1. **Single-User**: No authentication or multi-user support
2. **No Offline Mode**: Requires internet connection for all features
3. **No Real-time Sync**: No WebSocket or real-time collaboration
4. **Desktop-First**: Mobile experience is responsive but not optimized
5. **No Task Assignment**: Cannot assign tasks to team members
6. **No Attachments**: Cannot attach files to tasks
7. **No Notifications**: No email or push notifications for due dates

### Technical Limitations
1. **No Automated Tests**: No unit tests or integration tests (manual testing only)
2. **No CI/CD**: No automated deployment pipeline
3. **No Logging**: Limited server-side logging for debugging
4. **No Analytics**: No usage tracking or analytics

---

## 🔮 Future Enhancements

### High Priority
1. **User Authentication**
   - Login/signup with email and password
   - JWT-based authentication
   - User profiles

2. **Multi-User Support**
   - Task assignment to team members
   - Shared workspaces
   - Permissions and roles

3. **Notifications**
   - Email notifications for due dates
   - Browser push notifications
   - Reminder system

4. **Mobile App**
   - React Native mobile application
   - Native voice input
   - Offline mode with sync

### Medium Priority
5. **Task Categories/Projects**
   - Organize tasks into projects
   - Color-coded categories
   - Project-level views

6. **Recurring Tasks**
   - Daily, weekly, monthly recurrence
   - Custom recurrence patterns
   - Auto-generation of recurring tasks

7. **Task Attachments**
   - File uploads (images, documents)
   - Cloud storage integration
   - Preview attachments

8. **Advanced NLP**
   - Better context understanding
   - Multi-language support
   - More complex date parsing
   - Extract descriptions from voice input

### Low Priority
9. **Analytics Dashboard**
   - Task completion rates
   - Productivity metrics
   - Time tracking

10. **Integrations**
    - Calendar sync (Google Calendar, Outlook)
    - Slack notifications
    - Email integration

11. **Collaboration Features**
    - Comments on tasks
    - Task mentions
    - Activity feed

12. **Advanced Filters**
    - Custom filter combinations
    - Saved filter presets
    - Advanced search with operators

### Technical Improvements
13. **Automated Testing**
    - Unit tests (Jest, React Testing Library)
    - Integration tests
    - E2E tests (Playwright, Cypress)

14. **Performance Optimization**
    - Code splitting
    - Lazy loading
    - Caching strategies

15. **CI/CD Pipeline**
    - Automated testing on PR
    - Automated deployment
    - Environment management

16. **Monitoring & Logging**
    - Error tracking (Sentry)
    - Performance monitoring
    - User analytics

---

## 🎥 Demo Video

**Video Link**: [To be added]

The demo video includes:
1. Application walkthrough (Kanban board, list view, filters)
2. Voice input demonstrations (3+ examples with varying complexity)
3. Brief code walkthrough (NLP parser, API structure, React components)
4. Dark mode showcase

**Duration**: 8-10 minutes  
**Platform**: Loom / Google Drive

---

## 📦 Project Structure

```
voice-task-tracker/
├── backend/
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   └── seed.sql            # Sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # MySQL connection
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── validation.js   # Joi validation
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   └── nlpParser.js    # Voice parsing logic
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── VoiceTaskReview.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── taskService.js
│   │   ├── types/
│   │   │   └── task.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 📝 License

This project is created for educational purposes as part of an SDE 1 assignment.

---

## 👤 Author

Created as part of an SDE 1 role assignment demonstrating full-stack development skills with modern web technologies.

---

## 🙏 Acknowledgments

### Libraries & Tools
- **React Team** - React framework
- **Tailwind Labs** - Tailwind CSS
- **Claudéric Demers** - @dnd-kit library
- **Wanasit Tanakitrungruang** - Chrono-node library
- **Google** - Web Speech API

### AI Assistance
- **Claude (Anthropic)** - Code generation and architecture guidance
- **GitHub Copilot** - Code completion and suggestions

---

## 📞 Support

For questions or issues:
1. Check the [Project Setup](#-project-setup) section
2. Review the [API Documentation](#-api-documentation)
3. Check [Known Limitations](#-known-limitations)

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
