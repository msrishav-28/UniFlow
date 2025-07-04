// Mock Supabase client for development
// Replace with actual Supabase client when ready

interface MockSupabase {
  from: (table: string) => {
    insert: (data: any) => Promise<{ error: null }>;
  };
}

export const supabase: MockSupabase = {
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log(`Mock insert to ${table}:`, data);
      // Simulate successful insertion
      return { error: null };
    }
  })
};
