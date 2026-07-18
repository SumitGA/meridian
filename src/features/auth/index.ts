// src/features/auth/index.ts
export { ProtectedRoute } from './components/ProtectedRoute';
export { AuthBootstrap } from './components/AuthBootstrap';
export { Can } from './components/Can';
export { GoogleLoginButton } from './components/GoogleLoginButton';
export { LoginPage } from './routes/LoginPage';
export { OAuthCallbackPage } from './routes/OAuthCallbackPage';
export { MockConsentPage } from './routes/MockConsentPage';
export { useAuth } from './hooks/useAuth';
export { usePermissions } from './hooks/usePermissions';
export { useGoogleLogin } from './hooks/useGoogleLogin';
export { authBridge } from './api/authBridge';
export { permissionsFor, PERMISSIONS } from './model/permissions';
export type { User, Role } from './model/types';
export type { Permission } from './model/permissions';