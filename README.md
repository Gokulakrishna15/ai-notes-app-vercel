# AI Notes App

A full-stack note-taking application with AI-powered features built with Next.js, MongoDB, and Google Gemini AI.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Secure sign-in/sign-up with Clerk
- ✅ **Notes Management** - Create, read, update, and delete notes
- ✅ **Search Functionality** - Search notes by title, content, or tags
- ✅ **AI-Powered Features**:
  - **AI Summary** - Generate concise summaries of long notes
  - **AI Improve** - Enhance grammar and clarity
  - **AI Tags** - Auto-generate relevant tags
- ✅ **Dark/Light Theme** - Toggle between themes
- ✅ **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide Icons

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose ODM
- Google Gemini AI API

**Authentication:**
- Clerk

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini AI
GOOGLE_API_KEY=your_google_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Sign Up/Sign In** - Create an account or log in
2. **Create Note** - Click "New Note" button
3. **Use AI Features**:
   - Write content and click "Summary" to generate a summary
   - Click "Improve" to enhance the text
   - Click "Tags" to auto-generate relevant tags
4. **Save Note** - Save your note with AI-generated metadata
5. **Search** - Use the search bar to find notes
6. **Edit/Delete** - Manage your notes with edit and delete options

## 📁 Project Structure
```
ai-notes-app/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── summarize/route.ts
│   │   │   ├── improve/route.ts
│   │   │   └── tags/route.ts
│   │   └── notes/route.ts
│   ├── sign-in/
│   ├── sign-up/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── db.ts
├── models/
│   └── Note.ts
├── middleware.ts
└── .env.local
```

## 🔒 Security

- Protected routes with Clerk middleware
- User-specific data isolation
- Environment variables for sensitive data
- Server-side API key protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Environment Variables Required:
- `MONGODB_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GOOGLE_API_KEY`

## 📝 API Endpoints

- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes` - Update note
- `DELETE /api/notes?id=<note_id>` - Delete note
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/improve` - Improve content
- `POST /api/ai/tags` - Generate tags

## 👨‍💻 Author

Gokulakrishna

## 📄 License

MIT License