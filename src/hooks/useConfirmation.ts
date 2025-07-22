import { useState, useCallback } from "react";

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void | Promise<void>;
}

export interface ConfirmationState extends ConfirmationConfig {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    isLoading: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });

  const showConfirmation = useCallback((config: ConfirmationConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      const originalOnConfirm = config.onConfirm;
      
      setState({
        ...config,
        isOpen: true,
        isLoading: false,
        onConfirm: async () => {
          setState(prevState => ({ ...prevState, isLoading: true }));
          try {
            if (originalOnConfirm) {
              await originalOnConfirm();
            }
            resolve(true);
          } catch (error) {
            resolve(false);
            throw error;
          } finally {
            setState(prevState => ({ ...prevState, isOpen: false, isLoading: false }));
          }
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false
    }));
  }, []);

  const confirm = useCallback(async (config: ConfirmationConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleCancel = () => {
        setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
        resolve(false);
      };

      setState({
        ...config,
        isOpen: true,
        isLoading: false,
        onConfirm: async () => {
          setState(prev => ({ ...prev, isLoading: true }));
          try {
            if (config.onConfirm) {
              await config.onConfirm();
            }
            resolve(true);
          } catch (error) {
            resolve(false);
            throw error;
          } finally {
            setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
          }
        },
        onCancel: handleCancel,
      });
    });
  }, []);

  return {
    ...state,
    showConfirmation,
    hideConfirmation,
    confirm,
  };
};
