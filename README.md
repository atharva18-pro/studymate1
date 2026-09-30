# StudyMate

A mobile-friendly student study dashboard built with React + Vite.

## Included

- Student profile basics
- Subjects and chapters
- Personal weekly timetable
- Home dashboard
- Tasks and assignments
- Notes
- AI Study Assistant interface
- Learn / Practice / Test / Revision modes
- Built-in 25-minute focus timer
- Test scoring and history
- Progress dashboard
- Light/dark mode
- Local persistence with localStorage
- Responsive mobile layout

## Run locally

Install Node.js, then:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Important: real AI

The current project contains a working AI-study UI and a local demo response so the app runs immediately without an API key.

For production, connect the `send()` function in `src/App.jsx` to a secure backend endpoint such as `/api/ai`.

Do NOT put an AI API key directly into React/browser code.

A secure backend should:
1. Receive the student's question and selected class/board/subject/chapter.
2. Call your chosen AI provider.
3. Return the AI response to the frontend.
4. Keep the provider API key in server-side environment variables.

## Moving to Lovable

You can upload/import this project into a compatible Lovable workflow, or use the specification from the chat to recreate the screens. Keep the backend/API key server-side.

## Data

This starter uses localStorage for simplicity. For multiple users/accounts and cloud sync, replace the local data layer with a real database/auth system.
