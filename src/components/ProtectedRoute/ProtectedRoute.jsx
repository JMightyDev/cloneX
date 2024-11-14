import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../store/authContext"; // Modifié: AuthProvider -> authContext
import PropTypes from "prop-types";
import Loading from "../Loading/Loading";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Afficher un indicateur de chargement pendant que l'état d'authentification est en cours de vérification
    return <Loading />;
  }

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/login" />;
  }

  // Rendre les composants enfants si l'utilisateur est authentifié
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
