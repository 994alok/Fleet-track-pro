import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire server-side application
export function createServerSupabaseClient() {
  // Check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Instead of throwing an error, log a warning and use mock functionality
    console.warn("Supabase environment variables are missing. Using mock functionality.")

    // Return a mock client that won't throw errors
    return createMockSupabaseClient()
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Add a mock client function that returns a dummy client with the same interface
function createMockSupabaseClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: { id: `mock-${Date.now()}` },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({ error: null }),
      }),
      delete: () => ({
        eq: () => ({ error: null }),
      }),
    }),
  }
}

// Create a singleton client for client-side usage
let clientSideClient: ReturnType<typeof createClient> | null = null

export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  if (!clientSideClient) {
    clientSideClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return clientSideClient
}
