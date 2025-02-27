import { User } from '@nx-chat-assignment/shared-models';
import { Avatar, Input, List, Skeleton, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import unidecode from 'unidecode';
import { useDebounce, useUserOnline, useUserStore } from '../../../hooks';

import styles from './styles.module.scss';

interface ChatSidebarProps {
  activeChat: User | null;
  newMessages: Set<string>;
  setNewMessages: (newMessages: Set<string>) => void;
  setActiveChat: (user: User | null) => void;
}

const ChatSidebar = ({
  activeChat,
  setActiveChat,
  newMessages,
  setNewMessages,
}: ChatSidebarProps) => {
  const [value, setValue] = useState('');
  const [users, setUsers] = useState([]);

  const { user } = useUserStore();
  const { userOnlines, isLoadingUserOnline } = useUserOnline();
  const debouncedQuery = useDebounce(value, 500);

  const handleClickUser = (chat: User) => {
    if (newMessages?.has(chat.id)) {
      const updatedMessages = new Set(newMessages);
      updatedMessages.delete(chat.id);
      setNewMessages(updatedMessages);
    }

    setActiveChat(chat);
  };

  const normalizeText = useCallback(
    (text: string) => unidecode(text).toLowerCase(),
    []
  );

  const userOthers = useMemo(
    () => userOnlines?.filter((userOnline: User) => userOnline.id !== user?.id),
    [userOnlines, user?.id]
  );

  useEffect(() => {
    setUsers(userOthers);
  }, [userOthers]);

  useEffect(() => {
    if (debouncedQuery) {
      const res = userOthers.filter((u: User) =>
        normalizeText(u.username).includes(normalizeText(debouncedQuery))
      );

      setUsers(res);
    }
  }, [debouncedQuery, normalizeText]);

  return (
    <div className={styles.sidebar}>
      <Typography.Title level={3} className={styles.title}>
        Đoạn chats
      </Typography.Title>

      <div className={styles.search}>
        <Input
          className={styles.input}
          value={value}
          placeholder="Tìm kiếm"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>

      {!isLoadingUserOnline ? (
        <List
          className={styles.listUserOthers}
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(chat: User) => (
            <List.Item
              className={`${styles.chatItem} ${
                chat.id === activeChat?.id && styles.activeChatItem
              }`}
              onClick={() => {
                handleClickUser(chat);
              }}
            >
              <List.Item.Meta
                className={styles.inforUserOnline}
                avatar={
                  <div className={styles.avatarWrapper}>
                    <Avatar className={styles.avatarOthers} size={48}>
                      {chat.username.charAt(0).toUpperCase()}
                    </Avatar>
                    {newMessages?.has(chat.id) && (
                      <div className={styles.onlineIndicator}></div> // Chấm xanh khi có tin nhắn mới
                    )}
                  </div>
                }
                title={
                  <Typography.Text
                    className={
                      newMessages?.has(chat.id) ? styles.newMessage : ''
                    }
                    strong
                  >
                    {chat.username}
                  </Typography.Text>
                }
                description={
                  <Typography.Text
                    className={
                      newMessages?.has(chat.id) ? styles.newMessage : ''
                    }
                  >
                    {newMessages?.has(chat.id) ? 'Tin nhắn mới' : 'online'}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Skeleton avatar paragraph={{ rows: 1 }} />
      )}
    </div>
  );
};

export default ChatSidebar;
