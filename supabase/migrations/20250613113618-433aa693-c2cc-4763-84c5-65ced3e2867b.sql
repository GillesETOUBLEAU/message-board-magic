
-- Enable RLS on projection_settings table (if not already enabled)
ALTER TABLE public.projection_settings ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Policy: Allow admin users to have full access to projection settings
CREATE POLICY "Admins can manage all projection settings" 
ON public.projection_settings 
FOR ALL 
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- Policy: Allow all authenticated users to read projection settings (for projection page)
CREATE POLICY "All users can read projection settings" 
ON public.projection_settings 
FOR SELECT 
TO authenticated
USING (true);

-- Policy: Allow anonymous users to read projection settings (for public projection page)
CREATE POLICY "Anonymous users can read projection settings" 
ON public.projection_settings 
FOR SELECT 
TO anon
USING (true);
