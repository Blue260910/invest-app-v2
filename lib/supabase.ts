import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Your Supabase project URL and anon key
// In production, these should be environment variables
// For this demo, we're hardcoding them
export const supabaseUrl = 'https://oziwendirtmqquvqkree.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aXdlbmRpcnRtcXF1dnFrcmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA4MzksImV4cCI6MjA2MjY2NjgzOX0.PjysWhT8Y32PldsP3OsAefhiKfxjF8naRDhrrSddRVQ';

// Custom storage implementation using expo-secure-store for native platforms
// and localStorage for web
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return window.localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});