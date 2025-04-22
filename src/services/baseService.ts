
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create a mock Supabase client if credentials are missing (for dev purposes)
// This will not throw errors but will log operations and return empty results
const createMockClient = () => {
  const mockMethods = {
    from: (table: string) => ({
      insert: (data: any) => {
        console.log(`Mock insert to ${table}:`, data);
        return {
          select: undefined, // This is intentionally undefined to indicate it's a mock
          data: null,
          error: new Error('Mock Supabase client - No credentials provided')
        };
      },
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => {
            console.log(`Mock select from ${table} where ${column}=${value} order by ${column} ${ascending ? 'asc' : 'desc'}`);
            return Promise.resolve({ data: [], error: null });
          },
          limit: (limit: number) => {
            console.log(`Mock select from ${table} where ${column}=${value} limit ${limit}`);
            return Promise.resolve({ data: [], error: null });
          },
          maybeSingle: () => {
            console.log(`Mock select from ${table} where ${column}=${value} maybeSingle`);
            return Promise.resolve({ data: null, error: null });
          }
        }),
        limit: (limit: number) => {
          console.log(`Mock select from ${table} limit ${limit}`);
          return Promise.resolve({ data: [], error: null });
        },
        order: (column: string, { ascending }: { ascending: boolean }) => {
          console.log(`Mock select from ${table} order by ${column} ${ascending ? 'asc' : 'desc'}`);
          return Promise.resolve({ data: [], error: null });
        }
      })
    })
  };
  
  console.warn('Using mock Supabase client. Data operations will not work.');
  return mockMethods;
};

// Create the actual client or fallback to mock
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : createMockClient() as any;
