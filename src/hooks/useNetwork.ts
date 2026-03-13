import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetwork = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  return isOffline;
};
