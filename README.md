# FlowForge

A modern workflow automation platform that combines AI-powered task management with real-time collaboration capabilities. FlowForge enables users to create, manage, and automate complex workflows using an intuitive drag-and-drop interface.

## Features

- **AI-Powered Automation**: Leverage Google Gemini and OpenAI APIs for intelligent workflow automation
- **Visual Workflow Builder**: Drag-and-drop interface for creating complex workflows
- **Real-Time Collaboration**: Work together with team members in real-time
- **WhatsApp Integration**: Trigger and manage workflows via WhatsApp
- **User Authentication**: Secure authentication with JWT, OAuth (Google, Apple)
- **MongoDB Integration**: Persistent data storage with MongoDB
- **Email Notifications**: Automated email notifications using Nodemailer
- **Scheduled Tasks**: Cron-based task scheduling with node-cron

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Flow** - Visual workflow builder
- **React DnD** - Drag and drop functionality
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Google Generative AI** - AI integration
- **Nodemailer** - Email service
- **node-cron** - Task scheduling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
FlowForge/
├── frontend/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express backend server
│   ├── controllers/          # Request handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── middleware/           # Custom middleware
│   ├── config/               # Configuration files
│   ├── package.json
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- API keys for:
  - Google Gemini
  - OpenAI (optional)
  - Google OAuth (optional)
  - Apple OAuth (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FlowForge
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Backend:**
```bash
cd backend
npm run server    # Development with nodemon
# or
npm start         # Production
```

The backend will run on `http://localhost:4000`

**Frontend:**
```bash
cd frontend
npm run dev       # Development server
# or
npm run build     # Production build
npm run preview   # Preview production build
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/flowforge` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `AI_PROVIDER` | AI provider to use | `gemini` or `openai` |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `OPENAI_API_KEY` | OpenAI API key | - |

### Frontend (.env)

Configure API endpoints and other frontend settings as needed.

## API Endpoints

The backend provides RESTful API endpoints for:
- User authentication and management
- Workflow CRUD operations
- Task execution and monitoring
- Real-time updates

Refer to the backend routes directory for detailed endpoint documentation.

## Development

### Code Style

- Use ESLint for code quality (frontend)
- Follow Node.js best practices (backend)
- Use meaningful commit messages

### Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
```

## Deployment

### Frontend
- Build: `npm run build`
- Deploy the `dist/` folder to your hosting service (Netlify, Vercel, etc.)

### Backend
- Ensure all environment variables are set
- Deploy to your server or cloud platform (Heroku, AWS, DigitalOcean, etc.)
- Ensure MongoDB is accessible from your deployment environment

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Advanced workflow templates
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Enhanced analytics and reporting
- [ ] Webhook integrations
- [ ] Custom plugin system
