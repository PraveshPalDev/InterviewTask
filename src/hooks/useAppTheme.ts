import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../theme';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  
  return {
    isDarkMode,
    colors,
  };
};
