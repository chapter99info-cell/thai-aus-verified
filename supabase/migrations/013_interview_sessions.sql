CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interviewee_name text NOT NULL,
  business_name text,
  session_type text DEFAULT 'business',
  questions jsonb NOT NULL DEFAULT '[]',
  answers jsonb DEFAULT '[]',
  ai_post text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read interview sessions" ON public.interview_sessions;
CREATE POLICY "Public can read interview sessions"
  ON public.interview_sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can submit pending interviews" ON public.interview_sessions;
CREATE POLICY "Public can submit pending interviews"
  ON public.interview_sessions FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status = 'completed');

DROP POLICY IF EXISTS "Admin can manage interview sessions" ON public.interview_sessions;
CREATE POLICY "Admin can manage interview sessions"
  ON public.interview_sessions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));
