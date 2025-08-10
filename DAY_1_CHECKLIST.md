# 📅 DAY 1 CHECKLIST - Project Setup & Environment

**Date**: ___________  
**Time Allocated**: 2 hours  
**Goal**: Initialize clean codebase and development environment  
**Deliverable**: Working Next.js app with Supabase connection

---

## ⏰ HOUR 1: Repository & Base Setup

### 🚀 Task 1: Create Next.js Project (15 minutes)
- [ ] Open terminal in your workspace directory
- [ ] Run: `npx create-next-app@latest contentcraft-ai --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] Navigate to project: `cd contentcraft-ai`
- [ ] Initialize git repository: `git init`
- [ ] Create initial commit: `git add . && git commit -m "Initial Next.js setup"`

### 📦 Task 2: Install Core Dependencies (10 minutes)
- [ ] Install Supabase: `npm install @supabase/supabase-js`
- [ ] Install shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install additional UI components: `npx shadcn-ui@latest add button input card form label textarea select`
- [ ] Install utilities: `npm install zod react-hook-form @hookform/resolvers`
- [ ] Install date utilities: `npm install date-fns`

### 📁 Task 3: Set Up Folder Structure (10 minutes)
Create the following directories in `src/`:
- [ ] Create `src/actions/` directory
- [ ] Create `src/lib/` directory  
- [ ] Create `src/types/` directory
- [ ] Create `src/hooks/` directory
- [ ] Verify `src/app/` and `src/components/` exist
- [ ] Create `src/components/ui/` (if not exists from shadcn)

### 🎨 Task 4: Configure Tailwind & Styles (15 minutes)
- [ ] Verify `tailwind.config.ts` exists and is properly configured
- [ ] Update `src/app/globals.css` with shadcn base styles
- [ ] Add custom CSS variables for your brand colors
- [ ] Test Tailwind is working by adding some utility classes to a component
- [ ] Create a simple test page to verify styling works

### 🔧 Task 5: Environment Variables Setup (10 minutes)
- [ ] Create `.env.local` file in project root
- [ ] Create `.env.example` template with placeholders:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  GEMINI_API_KEY=your_gemini_key
  STABILITY_API_KEY=your_stability_key
  ```
- [ ] Add `.env.local` to `.gitignore`
- [ ] Document environment setup in README

---

## ⏰ HOUR 2: Supabase Configuration

### 🏗️ Task 1: Create Supabase Project (15 minutes)
- [ ] Go to [supabase.com](https://supabase.com) and sign up/login
- [ ] Click "New Project"
- [ ] Choose organization and enter project details:
  - Name: "ContentCraft AI"
  - Database Password: Generate strong password (save it!)
  - Region: Choose closest to your users
- [ ] Wait for project to be created (2-3 minutes)
- [ ] Copy Project URL and anon key to `.env.local`

### 🗃️ Task 2: Database Schema Setup (20 minutes)
Open Supabase SQL Editor and run these table creation scripts:

- [ ] Create users table (if not auto-created):
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

- [ ] Create blogs table:
```sql
-- Blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  tone TEXT NOT NULL,
  style TEXT NOT NULL,
  length TEXT NOT NULL,
  content TEXT DEFAULT '',
  outline JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  hero_image_url TEXT,
  hero_image_prompt TEXT,
  hero_image_caption TEXT,
  hero_image_alt TEXT,
  seo_score JSONB,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

- [ ] Create media table:
```sql
-- Media table for image storage
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🔐 Task 3: Configure Authentication (10 minutes)
- [ ] In Supabase Dashboard, go to Authentication > Settings
- [ ] Enable "Enable email confirmations" 
- [ ] Set Site URL to `http://localhost:3000`
- [ ] Add redirect URLs: `http://localhost:3000/auth/callback`
- [ ] Configure email templates (optional for now)
- [ ] Test that auth is properly configured

### 🔗 Task 4: Test Database Connection (10 minutes)
- [ ] Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] Create a simple test page to verify connection
- [ ] Test basic query (like `SELECT NOW()`)
- [ ] Verify no connection errors in browser console

### 🛡️ Task 5: Row Level Security Setup (5 minutes)
Enable RLS policies for security:

- [ ] Enable RLS on profiles table:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

- [ ] Enable RLS on blogs table:
```sql
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blogs" ON blogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blogs" ON blogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blogs" ON blogs
  FOR DELETE USING (auth.uid() = user_id);
```

- [ ] Enable RLS on media table:
```sql
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media" ON media
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own media" ON media
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## ✅ End of Day 1 Checklist

### 🎯 Verification Steps
- [ ] Next.js app runs without errors: `npm run dev`
- [ ] Tailwind styles are working
- [ ] Supabase connection is established
- [ ] Database tables are created
- [ ] Environment variables are configured
- [ ] RLS policies are in place
- [ ] Git repository is initialized with clean commit history

### 📝 Success Criteria
- ✅ **Working Next.js app** - App loads at `http://localhost:3000`
- ✅ **Supabase connected** - No connection errors in console
- ✅ **Database ready** - All tables created with proper schema
- ✅ **Security enabled** - RLS policies protect user data
- ✅ **Development environment** - Ready for Day 2 development

### 🚨 Troubleshooting
**If Next.js won't start:**
- Check for syntax errors in config files
- Verify all dependencies installed correctly
- Clear `.next` folder and restart

**If Supabase connection fails:**
- Verify environment variables are correct
- Check Project URL and anon key in Supabase dashboard
- Ensure `.env.local` is in project root

**If database queries fail:**
- Check RLS policies allow your operations
- Verify table schemas match exactly
- Test with Supabase SQL editor first

---

## 📋 Daily Progress Log

**Time Started**: ___________  
**Time Finished**: ___________  
**Total Time**: _____ hours

**Completed Tasks**: 
- [ ] Hour 1: Repository & Base Setup
- [ ] Hour 2: Supabase Configuration

**Challenges Faced**:
- Challenge 1: ________________
  - Solution: ________________
- Challenge 2: ________________
  - Solution: ________________

**Notes for Tomorrow**:
- Priority 1: ________________
- Priority 2: ________________
- Don't forget: _______________

**Day 1 Success Rating**: ___/10

---

## 🚀 Ready for Day 2?

Once you complete Day 1, you'll have:
- ✅ Solid foundation with Next.js + TypeScript
- ✅ Supabase backend with proper security
- ✅ Database schema ready for content
- ✅ Development environment configured

**Day 2 Preview**: Database schema refinement, TypeScript types, and validation setup.

Great job getting started! 🎉
