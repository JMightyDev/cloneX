import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  logOut: () => {},
  createUser: () => {},
  loginUser: () => {},
  auth: null, // Ajouter auth ici
});
