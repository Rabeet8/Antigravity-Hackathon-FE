import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return null;
};

const hostIp = getHostIp();

export const BASE_URL = hostIp 
  ? `http://${hostIp}:3000/api` 
  : (Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api');

console.log('[API Config] Resolved BASE_URL:', BASE_URL);
