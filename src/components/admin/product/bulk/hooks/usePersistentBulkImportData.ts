import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bulk-import-textarea-data';

interface PersistentBulkImportData {
  textareaContent: string;
  lastModified: number;
}

/**
 * Hook for managing persistent bulk import textarea data.
 * Preserves data across modal sessions and browser refreshes.
 */
export const usePersistentBulkImportData = () => {
  const [persistentData, setPersistentData] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: PersistentBulkImportData = JSON.parse(stored);
        // Only restore data if it's less than 24 hours old to avoid stale data
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (Date.now() - data.lastModified < twentyFourHours) {
          setPersistentData(data.textareaContent);
        } else {
          // Clear old data
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load persistent bulk import data:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((content: string) => {
    try {
      const data: PersistentBulkImportData = {
        textareaContent: content,
        lastModified: Date.now()
      };

      if (content.trim()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setPersistentData(content);
    } catch (error) {
      console.warn('Failed to save persistent bulk import data:', error);
    }
  }, []);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPersistentData('');
    } catch (error) {
      console.warn('Failed to clear persistent bulk import data:', error);
    }
  }, []);

  return {
    persistentData,
    saveData,
    clearData,
    isLoaded
  };
};
