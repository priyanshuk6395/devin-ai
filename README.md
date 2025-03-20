# Devin-AI 🤖
A collaborative AI-powered development environment with real-time code execution and pair programming capabilities.
## 📂 Project Structure

### Backend (Node.js/Express)
```
backend/
├── controllers/    # Route controllers
├── models/         # MongoDB models
├── routes/         # Express routes
├── services/       # Business logic
├── middlewares/    # Auth middleware
├── db/             # Database config
├── app.js          # Express app config
├── server.js       # Server entry point
├── package.json
└── .env            # Environment variables
```

### Frontend (React)
```
frontend/
├── public/         # Static assets
├── src/            # React components
├── package.json
├── tailwind.config.js # Tailwind config
└── vite.config.js  # Vite config
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB v6.0+
- Redis v7+
- Google Generative AI API Key

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/priyanshuk6395/devin-ai.git
cd devin-ai
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Update with your credentials
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
cp .env.example .env  # Set API endpoints
```

## ⚙️ Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/devin-ai
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_google_ai_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## 🧠 Tech Stack

| Category       | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | React, Tailwind CSS, Vite, WebContainers |
| **Backend**    | Node.js, Express, MongoDB, Redis     |
| **AI Core**    | Google Generative AI                  |
| **Auth**       | JWT, bcryptjs                         |
| **Dev Tools**  | ESLint, Prettier                      |

## 🔥 Features

- Real-time collaborative code editing
- AI-powered code suggestions
- In-browser code execution via WebContainers
- JWT-based authentication
- Project version history
- Multi-user collaboration

## 🛠 Development

### Running the Application

1. **Start Backend**
```bash
cd backend
npm start
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

### Key Scripts

**Backend**
```bash
npm run start     # Start production server
npm run dev      # Start dev server (nodemon)
npm run test     # Run test suite
```

**Frontend**
```bash
npm run dev      # Start Vite dev server
npm run build    # Create production build
npm run preview  # Preview production build
```

## 🤝 Contributing

1. Create your feature branch
```bash
git checkout -b feature/amazing-feature
```

2. Commit changes
```bash
git commit -m 'Add some amazing feature'
```

3. Push to branch
```bash
git push origin feature/amazing-feature
```

4. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Priyanshu Kumar**  