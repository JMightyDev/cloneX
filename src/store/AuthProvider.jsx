import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../config/firebase";
import { AuthContext } from "./authContext";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    return auth.signOut().then(() => {
      setUser(null);
    });
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email, password) => {
    // 1. Créer l'utilisateur
    await createUserWithEmailAndPassword(auth, email, password);

    const updatedUser = auth.currentUser;
    setUser(updatedUser);

    return updatedUser;
  };

  const authContextValue = { user, loading, logOut, createUser, loginUser };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
