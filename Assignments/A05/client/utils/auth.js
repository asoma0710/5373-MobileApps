// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@auth';

export const setSession = async (userData, expirationMinutes) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
  const sessionData = { userData, expiresAt };
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
};

export const getSession = async () => {
  const sessionData = await AsyncStorage.getItem(AUTH_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

export const isSessionValid = async () => {
  const session = await getSession();
  if (session && new Date(session.expiresAt) > new Date()) {
    return true;
  }
  return false;
};
