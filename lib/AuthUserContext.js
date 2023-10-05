import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from './useFirebaseAuth';

export const AuthUserContext = createContext(
  {
    authUser: null,
    loading: true,
    SignUp: async () => { },
    SignIn: async () => { },
    SignOut: async () => { },
    SendEmailVerification: async () => { },
    UpdateProfile: async () => { },
    Reload: async () => { }
    /// VerifyAccessToken: async () => {}
  }
);

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  // console.log(auth)
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
