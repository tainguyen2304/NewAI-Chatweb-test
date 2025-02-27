import { User } from '@nx-chat-assignment/shared-models';
import { useEffect, useState } from 'react';
import { useSocket } from '../../components';
import { MESSAGE_RECEIVE } from '../../constants';
import { useMessagesStore, useUserStore } from '../../hooks';
import ChatNavigateSidebar from './ChatNavigateSidebar';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import styles from './styles.module.scss';

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [newMessages, setNewMessages] = useState<Set<string>>(new Set());

  const { socket, isConnected } = useSocket();
  const { setMessages, messages } = useMessagesStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!isConnected) return;

    socket?.on(MESSAGE_RECEIVE, ({ data }) => {
      setMessages([...messages, data]);

      if (data.sender.id !== user?.id)
        setNewMessages((prev) => new Set(prev.add(data.sender.id)));
    });

    return () => {
      socket?.off(MESSAGE_RECEIVE);
    };
  }, [isConnected, socket, messages, user?.id]);

  return (
    <div className={styles.chatPage}>
      <ChatNavigateSidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      <ChatSidebar
        newMessages={newMessages}
        setNewMessages={setNewMessages}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      {activeChat && (
        <ChatWindow
          activeChat={activeChat}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
        />
      )}
    </div>
  );
};

export default ChatPage;
