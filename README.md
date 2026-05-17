<p align="center">
  <img src="logo.png" alt="Bhumi AI Logo" width="180"/>
</p>

# Bhumi AI Backend

AI-powered backend server for Bhumi AI — a modern AI assistant application built using Node.js, Express.js, OpenAI API, Firebase, and Serper API.

Bhumi AI supports intelligent chat responses, image understanding, web search, PDF/DOC generation, and real-time AI-powered features.

---

# Features

## AI Chat System
- OpenAI-powered conversational AI
- Human-like responses
- Context-aware conversations
- Fast API response handling

## Web Search Integration
- Real-time search using Serper API
- Internet-based answers
- Latest information retrieval

## Image Understanding
- Upload and analyze images
- AI-generated image descriptions
- Visual recognition support

## PDF & DOC Generation
- Generate downloadable PDF files
- Generate DOC documents
- AI-generated formatted content export

## Authentication Support
- Firebase Authentication integration
- Google Sign-In support
- Secure login system

## Backend Security
- Environment variable protection
- API key protection
- CORS security
- Helmet security middleware
- Rate limiting support

## Deployment Ready
- Render compatible
- Railway compatible
- VPS compatible
- Production-ready Express server

---

# Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Backend runtime |
| Express.js | API framework |
| OpenAI API | AI responses |
| Serper API | Web search |
| Firebase | Authentication |
| JavaScript | Backend language |
| Render | Deployment |

---

# Project Structure

```bash
bhumi-backend/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── logo.png
└── README.md

# Installation & Setup

1. Clone Repository
git clone https://github.com/Kunalkumarxyz/bhumi-backend.git

2. Open Project Folder
cd bhumi-backend

3. Install Dependencies
Make sure Node.js is installed on your system.

Then run:
npm install

This command will install all required packages and dependencies.

4. Create Environment Variables
Create a .env file in the root directory.

## Add the following variables:
OPENAI_API_KEY=your_openai_api_key
SERPER_API_KEY=your_serper_api_key

5. Start Backend Server
Run the following command:

node server.js

or

npm start

6. Server Running
Backend server will start on:

http://localhost:3000

7. Requirements
Node.js v18+
npm
OpenAI API Key
Serper API Key

8. Deployment
This backend can be deployed on:

Render
Railway
Any Node.js hosting platform
