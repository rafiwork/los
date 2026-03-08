-- Allow authenticated users to insert their own notifications (needed for spam system)
CREATE POLICY "Users can insert own notifications" ON public.admin_notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);