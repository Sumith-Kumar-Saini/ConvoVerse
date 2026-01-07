# ConvoVerse

`🟡 In Process`

ConvoVerse is an AI-powered chat system designed to provide users with a seamless, real-time communication platform. It uses the Gemini 2.0 Flash AI to generate intelligent responses and integrates the MERN stack (MongoDB, Express.js, React.js, Node.js) with Socket.io for real-time messaging, Redis for session management, and JWT for authentication.

## Project Structure

```

root/
├── client/                       # React frontend
│   ├── public/                   # Public files (e.g., index.html)
│   ├── src/                      # React source code
│   │   ├── components/           # React components
│   │   ├── styles/               # Global styles
│   │   ├── store/                # Redux store setup
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point for React
│   ├── package.json              # Frontend dependencies
│   └── vite.config.ts            # Vite config for frontend
├── server/                       # Backend (Express + Socket.IO + Redis)
│   ├── package.json              # Backend dependencies
│   └── src/                      # Source code for the server
│       ├── app.ts                # Express app initialization
│       ├── server.ts             # Server entry point
│       ├── configs/              # Environment & DB configurations
│       ├── controllers/          # Route handlers for various features
│       ├── middlewares/          # Global middlewares (logging, validation, errors)
│       ├── models/               # Mongoose (or ORM) data models
│       ├── routers/              # Express route definitions
│       ├── schemas/              # Zod validation schemas
│       ├── services/             # Business logic (e.g., JWT, token handling)
│       ├── sockets/              # Socket.IO server logic
│       │   ├── core/             # Socket.IO core logic
│       │   ├── handlers/         # Event handlers (chat, message, etc.)
│       │   ├── interfaces/       # Socket types & contracts
│       │   └── middlewares/      # Socket-level middleware
│       ├── types/                # TypeScript type definitions
│       └── utils/                # Utility functions and helpers
│           └── logger/           # Logger setup using transports and formatters
├── package.json                  # Root project dependencies
└── README.md                     # Project documentation

```

## Features

- **Real-Time Chat**: Instant communication between users via Socket.io.
- **AI Integration**: Powered by Gemini 2.0 Flash AI, providing dynamic and context-aware responses.
- **Authentication**: JWT-based authentication with Redis for session management.
- **Room Management**: Users can create, join, and leave chat rooms.
- **Direct Messaging**: Private one-on-one conversations between users.
- **Scalable Architecture**: Built with the MERN stack, ensuring scalability and flexibility.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (or MongoDB Atlas)
- Redis (for session management)

### 1. Clone the repository

```bash
git clone https://github.com/Sumith-Kumar-Saini/convoverse.git
cd convoverse
```

### 2. Install dependencies

- For both **client** and **server**:

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root of both **client** and **server** directories, and add the necessary environment variables for Redis, MongoDB, and JWT tokens.

Example for **server** `.env`:

```
MONGODB_URI=mongodb://localhost:27017/convoverse
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
```

### 4. Run the application

- Start the **server**:

```bash
cd server
npm run dev
```

- Start the **client**:

```bash
cd client
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
