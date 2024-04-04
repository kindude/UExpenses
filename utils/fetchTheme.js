import { getTheme } from "./db";

export const fetchTheme = async () => {
    try {
      const theme = await getTheme('theme');
      return theme; 
      
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };