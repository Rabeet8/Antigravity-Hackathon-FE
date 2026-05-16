/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#075E54', // Secondary color for text
    background: '#FFFFFF', // Pure White background
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#DCFCE7',
    textSecondary: '#71796F', // Neutral color for secondary text
    primary: '#1DB954', // Primary color
    secondary: '#075E54',
    tertiary: '#FF767B',
    neutral: '#71796F',
    border: '#E5E7EB',
    error: '#FF767B', // Tertiary used for errors
  },
  dark: {
    text: '#075E54',
    background: '#FFFFFF',
    backgroundElement: '#F8FAF8',
    backgroundSelected: '#DCFCE7',
    textSecondary: '#71796F',
    primary: '#1DB954',
    secondary: '#075E54',
    tertiary: '#FF767B',
    neutral: '#71796F',
    border: '#0A7A6F',
    error: '#FF767B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
