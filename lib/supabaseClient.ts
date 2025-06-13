import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edepzscxoocasfawxsnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZXB6c2N4b29jYXNmYXd4c25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTAyODYsImV4cCI6MjA2NTM4NjI4Nn0.HzVL3mYof07CxEtj3RCYL2ZZCfpUSZl9EHiIgdWn1xY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 