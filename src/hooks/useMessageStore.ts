import { ChatHistory } from '@nx-chat-assignment/shared-models';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const MESSAGES_STORAGE_KEY = 'messages-storage';

interface CurentUserState {
  messages: ChatHistory | [];
  setMessages: (messages: ChatHistory | []) => void;
  loadOldMessages: () => void;
}

const useMessagesStore = create<CurentUserState>()(
  persist(
    (set, get) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      // Giả lập load tin cũ
      loadOldMessages: () => {
        const oldMessages = get().messages;
        set({ messages: [...oldMessages] });
      },
    }),
    {
      name: MESSAGES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useMessagesStore;
