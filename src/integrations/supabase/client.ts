// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jjsqtstfjodtaclulwtu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3F0c3Rmam9kdGFjbHVsd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzEyNjAsImV4cCI6MjA2MDAwNzI2MH0.UWKSGCqPJMVaWkp7IPtDEVIcHYnOHzWsE-ZRilGnUe8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);