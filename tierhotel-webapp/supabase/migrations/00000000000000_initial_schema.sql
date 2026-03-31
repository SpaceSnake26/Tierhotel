-- Enum for user roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'employee', 'screen');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'done');
CREATE TYPE absence_type AS ENUM ('sick', 'vacation', 'other');
CREATE TYPE absence_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE note_status AS ENUM ('draft', 'published');

-- Table: profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'employee'::user_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: shifts
CREATE TABLE public.shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  role_label TEXT NOT NULL, -- e.g., 'Morgenschicht'
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: absences
CREATE TABLE public.absences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type absence_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status absence_status DEFAULT 'pending'::absence_status,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium'::task_priority,
  due_date TIMESTAMPTZ,
  status task_status DEFAULT 'open'::task_status,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: daily_notes
CREATE TABLE public.daily_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status note_status DEFAULT 'draft'::note_status,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: events
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date_time TIMESTAMPTZ NOT NULL,
  internal_only BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Basic RLS for Profiles
CREATE POLICY "Public profiles are viewable by authenticated users." 
  ON public.profiles FOR SELECT TO authenticated USING (true);
  
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- (Further granular RLS policies for shifts, tasks depending on roles can be added here)

-- RLS for Shifts
CREATE POLICY "Authenticated users can view all shifts."
  ON public.shifts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert shifts."
  ON public.shifts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own shifts; admins can update all."
  ON public.shifts FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can delete shifts."
  ON public.shifts FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- RLS for Absences
CREATE POLICY "Users can view their own absences; admins can view all."
  ON public.absences FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Users can insert their own absences."
  ON public.absences FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update absences."
  ON public.absences FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can delete absences."
  ON public.absences FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- RLS for Tasks
CREATE POLICY "Authenticated users can view all tasks."
  ON public.tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tasks."
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks they created or are assigned to."
  ON public.tasks FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Users can delete tasks they created; admins can delete all."
  ON public.tasks FOR DELETE TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- RLS for Daily Notes
CREATE POLICY "Authenticated users can view all notes."
  ON public.daily_notes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert notes."
  ON public.daily_notes FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can update notes."
  ON public.daily_notes FOR UPDATE TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Authors and admins can delete notes."
  ON public.daily_notes FOR DELETE TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- RLS for Events
CREATE POLICY "Authenticated users can view all events."
  ON public.events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert events."
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators and admins can update events."
  ON public.events FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Creators and admins can delete events."
  ON public.events FOR DELETE TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Indexes for foreign key columns (performance)
CREATE INDEX idx_shifts_user_id ON public.shifts(user_id);
CREATE INDEX idx_absences_user_id ON public.absences(user_id);
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_daily_notes_author_id ON public.daily_notes(author_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
