# ConvoVerse

ConvoVerse is an AI-powered chat system designed to provide users with a seamless, real-time communication platform. It uses the Gemini 2.0 Flash AI to generate intelligent responses and integrates the MERN stack (MongoDB, Express.js, React.js, Node.js) with Socket.io for real-time messaging, Redis for session management, and JWT for authentication.

## Project Structure

```

root/
├── client/                     # React frontend
│   ├── public/                 # Public files (e.g., index.html)
│   ├── src/                    # React source code
│   │   ├── components/         # React components
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point for React
│   │   ├── store/              # Redux store setup
│   │   └── styles/             # Global styles
│   ├── package.json            # Frontend dependencies
│   └── vite.config.ts          # Vite config for frontend
├── server/                     # Express.js backend
│   ├── src/                    # Backend source code
│   │   ├── controllers/        # API controllers
│   │   ├── middlewares/        # Authentication & socket middleware
│   │   ├── sockets/            # Socket.io event handling
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json            # Backend dependencies
├── package.json                # Root project dependencies
└── README.md                   # Project documentation

````

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
````

### 2. Install dependencies

* For both **client** and **server**:

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

* Start the **server**:

```bash
cd server
npm run dev
```

* Start the **client**:

```bash
cd client
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.