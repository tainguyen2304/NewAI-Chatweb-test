import { OnlineUsers, User } from '@nx-chat-assignment/shared-models';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Route, USER_LOGIN, USER_ONLINE } from '../../constants';
import { useUserStore, useUserOnline } from '../../hooks';
import { userOnlineKeys } from '../../services';
import { resSocket } from '../../types';
import styles from './styles.module.scss';

import { useSocket } from '../../components';

const { Title } = Typography;

export default function Login() {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');

  const navigate = useNavigate();
  const { userOnlines } = useUserOnline();
  const { socket, isConnected } = useSocket();
  const { setUser, user } = useUserStore();

  const handleLogin = () => {
    if (!isConnected || !username.trim()) {
      return;
    }

    const existingUser = userOnlines.find(
      (user: User) => user.username === username
    );

    if (existingUser) {
      toast.warning(`Username: ${username} already exists`);
      return;
    }

    socket?.emit(USER_LOGIN, username);

    socket?.on(USER_ONLINE, ({ data }: resSocket<OnlineUsers>) => {
      const currentUser = data.find((user: User) => user.username === username);
      if (currentUser) {
        setUser(currentUser);
        queryClient.invalidateQueries({
          queryKey: userOnlineKeys.getAllUser(),
        });
        navigate(Route.Homepage);
      }
    });
  };

  if (user?.username) {
    navigate(Route.Homepage);
    return;
  }

  return (
    <div className={styles.loginPage}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Đăng nhập
        </Title>
        <Input
          placeholder="Nhập tên"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <Button type="primary" onClick={handleLogin} className={styles.button}>
          Đăng nhập
        </Button>
      </Card>
    </div>
  );
}
