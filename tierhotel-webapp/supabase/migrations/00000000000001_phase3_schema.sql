-- Phase 3: Einsatzplan (schedule grid), Schichttypen, Arbeitsbereiche, Jahresregister

-- ─────────────────────────────────────────────
-- Extend profiles with employee scheduling fields
-- ─────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS employee_type         TEXT    DEFAULT 'EFZ',
  ADD COLUMN IF NOT EXISTS contract_hours_per_day NUMERIC(4,2) DEFAULT 8.5,
  ADD COLUMN IF NOT EXISTS vacation_entitlement_ft  NUMERIC(7,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vacation_entitlement_ftk NUMERIC(7,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active             BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order            INT     DEFAULT 0;

-- ─────────────────────────────────────────────
-- Shift types (configurable)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shift_types (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code           TEXT        NOT NULL UNIQUE,
  name           TEXT        NOT NULL,
  morning_start  TEXT        NOT NULL,
  morning_end    TEXT        NOT NULL,
  afternoon_start TEXT       NOT NULL,
  afternoon_end  TEXT        NOT NULL,
  total_hours    NUMERIC(4,2) NOT NULL,
  color          TEXT        NOT NULL DEFAULT '#3B82F6',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Work areas (configurable)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.work_areas (
  id                  UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  code                TEXT    NOT NULL UNIQUE,
  name                TEXT    NOT NULL,
  is_training_position BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Day plans — one per employee per day (core scheduling unit)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.day_plans (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id   UUID         REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date          DATE         NOT NULL,
  shift_type_id UUID         REFERENCES public.shift_types(id) ON DELETE SET NULL,
  work_area_id  UUID         REFERENCES public.work_areas(id)  ON DELETE SET NULL,
  planned_hours NUMERIC(4,2) DEFAULT 0,
  is_day_off    BOOLEAN      DEFAULT false,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- ─────────────────────────────────────────────
-- Absence markers — per-day flags linked to day_plans
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.absence_markers (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  day_plan_id UUID         REFERENCES public.day_plans(id) ON DELETE CASCADE NOT NULL,
  type        TEXT         NOT NULL,  -- FT, FTK, K, UEZ, UF, S, UEK, W, WK, UU, X, IN, EX
  hours       NUMERIC(4,2) NOT NULL DEFAULT 8.5,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Public holidays (affects Soll-Zeit calculation)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.public_holidays (
  id         UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  date       DATE  NOT NULL UNIQUE,
  name       TEXT  NOT NULL,
  year       INT   NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Event templates
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_templates (
  id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT  NOT NULL,
  description TEXT  DEFAULT '',
  category    TEXT  DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Task upgrades — add type, recurrence, category
-- ─────────────────────────────────────────────
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS task_type       TEXT     DEFAULT 'one_time',
  ADD COLUMN IF NOT EXISTS recurrence_days INT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active       BOOLEAN  DEFAULT true,
  ADD COLUMN IF NOT EXISTS category        TEXT     DEFAULT '';

-- ─────────────────────────────────────────────
-- Task assignments — employee to task
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.task_assignments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id     UUID REFERENCES public.tasks(id)    ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(task_id, employee_id)
);

-- ─────────────────────────────────────────────
-- Task instances — generated occurrences per day
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.task_instances (
  id              UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id         UUID  REFERENCES public.tasks(id)    ON DELETE CASCADE NOT NULL,
  date            DATE  NOT NULL,
  status          TEXT  NOT NULL DEFAULT 'open',
  completed_at    TIMESTAMPTZ,
  completed_by_id UUID  REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(task_id, date)
);

-- ─────────────────────────────────────────────
-- Add date column to daily_notes for one-per-day semantics
-- ─────────────────────────────────────────────
ALTER TABLE public.daily_notes
  ADD COLUMN IF NOT EXISTS note_date DATE;

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE public.shift_types    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_areas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absence_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_instances  ENABLE ROW LEVEL SECURITY;

-- shift_types
CREATE POLICY "View shift types" ON public.shift_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage shift types" ON public.shift_types FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- work_areas
CREATE POLICY "View work areas" ON public.work_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage work areas" ON public.work_areas FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- day_plans
CREATE POLICY "View day plans" ON public.day_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage day plans" ON public.day_plans FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- absence_markers
CREATE POLICY "View absence markers" ON public.absence_markers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage absence markers" ON public.absence_markers FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- public_holidays
CREATE POLICY "View holidays" ON public.public_holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage holidays" ON public.public_holidays FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- event_templates
CREATE POLICY "View event templates" ON public.event_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage event templates" ON public.event_templates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- task_assignments
CREATE POLICY "View task assignments" ON public.task_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage task assignments" ON public.task_assignments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- task_instances
CREATE POLICY "View task instances" ON public.task_instances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mark own task instances complete" ON public.task_instances FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage task instances" ON public.task_instances FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_day_plans_employee_date ON public.day_plans(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_day_plans_date          ON public.day_plans(date);
CREATE INDEX IF NOT EXISTS idx_absence_markers_plan    ON public.absence_markers(day_plan_id);
CREATE INDEX IF NOT EXISTS idx_holidays_date           ON public.public_holidays(date);
CREATE INDEX IF NOT EXISTS idx_task_instances_date     ON public.task_instances(date);
CREATE INDEX IF NOT EXISTS idx_task_assignments_emp    ON public.task_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_profiles_sort_order     ON public.profiles(sort_order, full_name);

-- ─────────────────────────────────────────────
-- Seed: shift types
-- ─────────────────────────────────────────────
INSERT INTO public.shift_types (code, name, morning_start, morning_end, afternoon_start, afternoon_end, total_hours, color)
VALUES
  ('FRUEH',     'Früh',     '06:00', '12:00', '12:45', '15:30', 8.5, '#3B82F6'),
  ('MITTEL',    'Mittel',   '07:00', '12:00', '14:00', '18:00', 8.5, '#10B981'),
  ('HALBSPAET', 'Halbspät', '09:30', '14:30', '15:15', '19:00', 8.5, '#F59E0B'),
  ('SPAET',     'Spät',     '10:30', '14:30', '15:15', '20:00', 8.5, '#EF4444')
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────
-- Seed: work areas
-- ─────────────────────────────────────────────
INSERT INTO public.work_areas (code, name, is_training_position)
VALUES
  ('A',   'Kundendienst',            false),
  ('B',   'Katzen / Kleintierdienst', false),
  ('C',   'Hundedienst',             false),
  ('D',   'Hunde-Spät',              false),
  ('E',   'Schieberdienst',          false),
  ('J',   'Joker',                   false),
  ('BUE', 'Ausbildung Büro',         true),
  ('P',   'Ausbildung Praxis',       true),
  ('EV',  'Empfang Vertretung',      false),
  ('L',   'Lehrmeister',             false)
ON CONFLICT (code) DO NOTHING;
