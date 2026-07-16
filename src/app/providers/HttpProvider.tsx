import { useEffect, type ReactNode } from 'react';
import { installAuthInterceptors } from '@/shared/lib/http';
import { authBridge } from '@/features/auth';

export function HttpProvider({ children }: { children: ReactNode }) {
  useEffect(() => installAuthInterceptors(authBridge), []);
  return <>{children}</>;
}