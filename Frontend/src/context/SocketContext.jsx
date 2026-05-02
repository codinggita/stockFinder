import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../redux/notificationSlice';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join_user', user._id || user.id);
      });

      newSocket.on('new_notification', (data) => {
        console.log('New notification received:', data);
        dispatch(addNotification(data));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
