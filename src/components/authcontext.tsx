import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode
} from "react";
import {
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth } from "@/firebase";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({user: null})

export function AuthProvider({children} : {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

