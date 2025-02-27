import { ArrowDownOutlined, LikeFilled, SendOutlined } from '@ant-design/icons';
import { User } from '@nx-chat-assignment/shared-models';
import { Avatar, Button, Input, Skeleton, Spin, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSocket } from '../../../components';
import { MESSAGE_SEND } from '../../../constants';
import { useMessagesStore, useUserStore } from '../../../hooks';
import styles from './styles.module.scss';

interface ChatWinDowProps {
  activeChat: User | null;
  newMessages: Set<string>;
  setNewMessages: (newMessages: Set<string>) => void;
}

const ChatWinDow = ({
  activeChat,
  newMessages,
  setNewMessages,
}: ChatWinDowProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [messageInput, setMessageInput] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(10);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const { socket, isConnected } = useSocket();
  const { user } = useUserStore();
  const { messages, loadOldMessages } = useMessagesStore();

  const handleSendMessage = () => {
    if (!isConnected || !messageInput.trim() || !activeChat) return;

    socket?.emit(MESSAGE_SEND, {
      receiver: {
        id: activeChat.id,
        username: activeChat.username,
      },
      message: messageInput.trim(),
    });

    setMessageInput('');
  };

  const handleLike = () => {
    if (!isConnected || !activeChat) return;

    socket?.emit(MESSAGE_SEND, {
      receiver: {
        id: activeChat.id,
        username: activeChat.username,
      },
      message: '👍',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeMessagesAll = useMemo(() => {
    const filtered = messages.filter(
      (msg) =>
        (msg.sender.username === user?.username &&
          msg.receiver.username === activeChat?.username) ||
        (msg.sender.username === activeChat?.username &&
          msg.receiver.username === user?.username)
    );
    return filtered;
  }, [messages, activeChat, user]);

  const activeMessages = useMemo(
    () => activeMessagesAll.slice(-visibleMessages),
    [activeMessagesAll, visibleMessages]
  );

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      setShowScrollToBottom(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessagesAll]);

  useEffect(() => {
    if (!loadMoreRef.current || !messagesContainerRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const container = messagesContainerRef.current;
          if (!container) return;

          const previousScrollHeight = container.scrollHeight;
          const previousScrollTop = container.scrollTop;

          setIsLoadingMore(true); // Bắt đầu loading
          await new Promise((resolve) => setTimeout(resolve, 800)); // Giả lập tải dữ liệu

          setVisibleMessages((prev) => {
            if (activeMessages.length < activeMessagesAll.length) {
              return prev + 10;
            }
            return prev;
          });

          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop =
                previousScrollTop +
                (container.scrollHeight - previousScrollHeight);
            }
          });

          setIsLoadingMore(false); // Kết thúc loading
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadOldMessages, activeMessages, activeMessagesAll]);

  if (!user?.username || !activeChat?.username) {
    return (
      <div className={styles.chatArea}>Select a user to start chatting</div>
    );
  }

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <Avatar size={36} className={styles.avatar}>
          {activeChat.username.charAt(0).toUpperCase()}
        </Avatar>
        <div className={styles.chatInfo}>
          <Typography.Text className={styles.username} strong>
            {activeChat.username}
          </Typography.Text>
          <Typography.Text className={styles.status} type="secondary">
            Online
          </Typography.Text>
        </div>
      </div>

      <div className={styles.messages} ref={messagesContainerRef}>
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {isLoadingMore && (
            <Skeleton
              active
              paragraph={{
                rows: 8,
              }}
            />
          )}
        </div>
        {activeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageItem} ${
              msg.sender.username === user.username
                ? styles.selfMessage
                : styles.otherMessage
            }`}
          >
            <Typography.Text>{msg.message}</Typography.Text>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <Button
        className={`${styles.btnViewNewMessage} ${
          showScrollToBottom && styles.showBtn
        }`}
        type="text"
        shape="circle"
        icon={<ArrowDownOutlined />}
        onClick={() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }

          if (newMessages?.has(activeChat.id)) {
            const updatedMessages = new Set(newMessages);
            updatedMessages.delete(activeChat.id);
            setNewMessages(updatedMessages);
          }
        }}
      />

      <div className={styles.inputArea}>
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Aa"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected || !activeChat}
        />
        <Button
          type="text"
          shape="circle"
          className={styles.btnSubmit}
          onClick={messageInput.trim() ? handleSendMessage : handleLike}
          disabled={!isConnected}
        >
          {messageInput.trim() ? <SendOutlined /> : <LikeFilled />}
        </Button>
      </div>
    </div>
  );
};

export default ChatWinDow;
