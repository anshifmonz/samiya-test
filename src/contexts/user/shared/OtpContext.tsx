import { FC, ReactNode, createContext, useContext, useMemo } from 'react';
import { useOtp } from 'hooks/user/shared/useOtp';

type OtpContextType = ReturnType<typeof useOtp>;

const OtpContext = createContext<OtpContextType | undefined>(undefined);

export const OtpProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const otp = useOtp();
  const value = useMemo(() => otp, [otp]);
  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};

export const useOtpContext = () => {
  const ctx = useContext(OtpContext);
  if (!ctx) throw new Error('useOtpContext must be used within an OtpProvider');
  return ctx;
};
