import { MessageOutlined } from '@ant-design/icons';
import { User } from '@nx-chat-assignment/shared-models';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Dropdown, Skeleton, Tooltip } from 'antd';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useSocket } from '../../../components';
import {
  CURRENT_USER_STORAGE_KEY,
  MESSAGES_STORAGE_KEY,
  useUserOnline,
  useUserStore,
} from '../../../hooks';
import { userOnlineKeys } from '../../../services';
import styles from './styles.module.scss';

interface ChatNavigateSidebarProps {
  activeChat: User | null;
  setActiveChat: (user: User | null) => void;
}

const ChatNavigateSidebar = ({
  activeChat,
  setActiveChat,
}: ChatNavigateSidebarProps) => {
  const { socket } = useSocket();
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();

  const { userOnlines, isLoadingUserOnline } = useUserOnline();

  const userOthers = useMemo(
    () => userOnlines?.filter((userOnline: User) => userOnline.id !== user?.id),
    [userOnlines, user?.id]
  );

  return (
    <div className={styles.navSidebar}>
      <Button
        icon={<MessageOutlined />}
        shape="circle"
        className={styles.navIcon}
      />
      <div className={styles.divider} />
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              label: (
                <div
                  onClick={async () => {
                    if (user?.id) {
                      try {
                        socket?.disconnect();
                        setUser(null);
                        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
                        localStorage.removeItem(MESSAGES_STORAGE_KEY);
                        queryClient.invalidateQueries({
                          queryKey: userOnlineKeys.getAllUser(),
                        });
                      } catch {
                        toast.error('Server error');
                      }
                    }
                  }}
                >
                  Log out
                </div>
              ),
              key: 'log-out',
            },
          ],
        }}
        placement="bottomLeft"
      >
        <Avatar className={styles.avatarSelf}>
          {user?.username.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>

      <div className={`${styles.isMobile} ${styles.divider}`} />

      {!isLoadingUserOnline ? (
        <div className={`${styles.isMobile} ${styles.listAvatarMobile}`}>
          {userOthers?.map((u: User) => (
            <div
              key={u.id}
              className={`${
                activeChat?.username === u.username ? styles.activeUser : ''
              } ${styles.userOther}`}
            >
              <Tooltip title={u.username}>
                <Avatar
                  className={styles.avatarOther}
                  size={32}
                  onClick={() => {
                    setActiveChat(u);
                  }}
                >
                  {u.username.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            </div>
          ))}
        </div>
      ) : (
        <Skeleton avatar />
      )}
    </div>
  );
};

export default ChatNavigateSidebar;
