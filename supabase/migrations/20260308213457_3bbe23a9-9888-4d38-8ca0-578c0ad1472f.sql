
-- Spam words table (admin-managed)
CREATE TABLE public.spam_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  added_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.spam_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage spam words" ON public.spam_words
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read spam words" ON public.spam_words
  FOR SELECT TO authenticated
  USING (true);

-- Spam violations tracking
CREATE TABLE public.spam_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  word_matched text NOT NULL,
  content_type text NOT NULL DEFAULT 'post',
  content_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spam_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all violations" ON public.spam_violations
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert violations" ON public.spam_violations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own violations" ON public.spam_violations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Spam bans table
CREATE TABLE public.spam_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  violation_count int NOT NULL DEFAULT 0,
  ban_until timestamptz,
  is_permanent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spam_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage spam bans" ON public.spam_bans
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own ban" ON public.spam_bans
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own ban" ON public.spam_bans
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ban" ON public.spam_bans
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
