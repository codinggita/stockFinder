import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartFromServer, syncCartWithServer } from '../redux/cartSlice';

const CartInitializer = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const isInitialMount = useRef(true);
  const prevItemsRef = useRef(items);

  // Initial fetch from server on mount/login
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchCartFromServer());
    }
  }, [isAuthenticated, token, dispatch]);

  // Sync to server on cart changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevItemsRef.current = items;
      return;
    }

    if (isAuthenticated && token && JSON.stringify(prevItemsRef.current) !== JSON.stringify(items)) {
      const timer = setTimeout(() => {
        dispatch(syncCartWithServer(items));
      }, 1000); // 1s debounce
      prevItemsRef.current = items;
      return () => clearTimeout(timer);
    }
    
    prevItemsRef.current = items;
  }, [items, isAuthenticated, token, dispatch]);

  return null;
};

export default CartInitializer;
