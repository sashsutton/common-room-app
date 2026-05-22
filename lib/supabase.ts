import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Database } from './database.types';

const CHUNK_SIZE = 2048;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const chunkCount = await SecureStore.getItemAsync(`${key}_chunkCount`);
    if (!chunkCount) return SecureStore.getItemAsync(key);
    const chunks: string[] = [];
    for (let i = 0; i < parseInt(chunkCount, 10); i++) {
      const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`);
      if (chunk === null) return null;
      chunks.push(chunk);
    }
    return chunks.join('');
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const total = Math.ceil(value.length / CHUNK_SIZE);
    await SecureStore.setItemAsync(`${key}_chunkCount`, String(total));
    for (let i = 0; i < total; i++) {
      await SecureStore.setItemAsync(
        `${key}_chunk_${i}`,
        value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      );
    }
  },
  removeItem: async (key: string): Promise<void> => {
    const chunkCount = await SecureStore.getItemAsync(`${key}_chunkCount`);
    if (!chunkCount) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    const total = parseInt(chunkCount, 10);
    await SecureStore.deleteItemAsync(`${key}_chunkCount`);
    for (let i = 0; i < total; i++) {
      await SecureStore.deleteItemAsync(`${key}_chunk_${i}`);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
