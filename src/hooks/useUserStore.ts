import { User } from '@nx-chat-assignment/shared-models';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const CURRENT_USER_STORAGE_KEY = 'current-user-storage';

interface CurentUserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<CurentUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: CURRENT_USER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUserStore;
