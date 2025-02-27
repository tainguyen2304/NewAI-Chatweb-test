import { OnlineUsers, User } from '@nx-chat-assignment/shared-models';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';
import { USER_LOGIN, USER_ONLINE } from '../../constants';
import { useUserStore } from '../../hooks';
import { userOnlineKeys } from '../../services';
import { resSocket } from '../../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const socketInstance: Socket = ClientIO(import.meta.env.VITE_BASE_SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!isConnected) {
      socketInstance.connect();
    }

    socketInstance.on('connect', () => {
      // nếu load lại sẽ tự động login lại
      if (user?.username.trim()) {
        socketInstance.emit(USER_LOGIN, user?.username);

        socketInstance.on(USER_ONLINE, ({ data }: resSocket<OnlineUsers>) => {
          const currentUser = data.find(
            (u: User) => u.username === user?.username
          );

          if (currentUser) {
            setUser(currentUser);
          }

          queryClient.invalidateQueries({
            queryKey: userOnlineKeys.getAllUser(),
          });
        });
      }

      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
    };
  }, [user, queryClient]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;
