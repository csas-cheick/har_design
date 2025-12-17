import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data) {
              // Force admin role for admin email if it was registered as user
              if (firebaseUser.email === "admin@hardesign.com" && data.role !== "admin") {
                data.role = "admin";
                // Update Firestore to reflect the correct role
                await setDoc(doc(db, "users", firebaseUser.uid), { role: "admin" }, { merge: true });
              }
              setUser({ id: firebaseUser.uid, ...data } as User);
            }
          } else {
            // Fallback if user exists in Auth but not in Firestore (shouldn't happen normally)
            // Or maybe it's the first admin login?
            if (firebaseUser.email === "admin@hardesign.com") {
               const adminData: Omit<User, "id"> = {
                 firstName: "Admin",
                 lastName: "HAR DESIGN",
                 email: firebaseUser.email!,
                 phone: "+227 00 00 00 00",
                 role: "admin"
               };
               await setDoc(doc(db, "users", firebaseUser.uid), adminData);
               setUser({ id: firebaseUser.uid, ...adminData });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user data to return it for redirection logic
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data) {
          // Force admin role for admin email
          if (result.user.email === "admin@hardesign.com") {
            data.role = "admin";
          }
          return { id: result.user.uid, ...data } as User;
        }
      }
      // Handle admin fallback case here too if needed, or just return null and let onAuthStateChanged handle state
      if (result.user.email === "admin@hardesign.com") {
         return {
             id: result.user.uid,
             firstName: "Admin",
             lastName: "HAR DESIGN",
             email: result.user.email!,
             phone: "+227 00 00 00 00",
             role: "admin"
         };
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const { user: firebaseUser } = userCredential;

      const newUser: Omit<User, "id"> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: "user", // Default role
      };

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      
      // State will be updated by onAuthStateChanged
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
