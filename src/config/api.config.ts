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

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL

