# Evolving 360 — Deployment Guide
# Total time: ~15 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Create a Supabase Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://supabase.com and sign in (or create a free account).
2. Click "New project".
3. Give it a name — e.g. "e360-review".
4. Choose a region close to you.
5. Set a database password (save it somewhere safe).
6. Click "Create new project" and wait ~2 minutes for it to provision.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Run the Database Migration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar.
2. Click "New query".
3. Open the file "supabase_migration.sql" from this folder.
4. Copy the entire contents and paste into the SQL Editor.
5. Click "Run" (or press Cmd+Enter / Ctrl+Enter).
6. You should see "Success. No rows returned" — this means all tables were
   created and all questions were seeded successfully.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Get Your Supabase Credentials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. In your Supabase project, click "Project Settings" (gear icon, bottom left).
2. Click "API" in the settings menu.
3. Copy two values — you'll need both for the next steps:
   - "Project URL"  →  looks like https://abcdefgh.supabase.co
   - "anon public"  →  a long string under "Project API keys"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Push Code to GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vercel deploys from a GitHub repository.

1. Go to https://github.com/new and create a new repository.
   Name it "e360-review". Keep it private.
2. On your computer, open a terminal in the e360-app folder.
3. Run these commands:

   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/e360-review.git
   git push -u origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Deploy to Vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://vercel.com and sign in with your GitHub account.
2. Click "Add New Project".
3. Find and import your "e360-review" repository.
4. Vercel will auto-detect it as a Vite project. Leave all build settings
   as-is (Build Command: "vite build", Output Directory: "dist").
5. Before clicking Deploy, click "Environment Variables" and add:

   Name:   VITE_SUPABASE_URL
   Value:  (paste your Project URL from Step 3)

   Name:   VITE_SUPABASE_ANON_KEY
   Value:  (paste your anon public key from Step 3)

6. Click "Deploy".
7. Wait ~1 minute. Vercel will give you a live URL like:
   https://e360-review.vercel.app

That URL is your tool. Share it with your partners.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Test It
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open the Vercel URL in your browser.
2. Enter a name and confirm.
3. Navigate to a section, vote on a question.
4. Open a second browser tab (or incognito), enter a different name,
   vote on the same question — you should see both votes in the tally.
5. Check your Supabase dashboard > Table Editor to see the data live.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUTURE UPDATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Any changes you push to the GitHub main branch will automatically
redeploy to Vercel within ~1 minute. No manual steps needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOCAL DEVELOPMENT (optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To run the app locally:

1. Copy .env.example to .env.local
2. Fill in your Supabase URL and anon key
3. Run:
   npm install
   npm run dev
4. Open http://localhost:5173
