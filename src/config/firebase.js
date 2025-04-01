import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;
let analytics;

try {
	app = initializeApp(firebaseConfig);
	auth = getAuth(app);

	// Vérifier si toutes les variables d'environnement sont définies
	Object.entries(firebaseConfig).forEach(([key, value]) => {
		if (!value) {
			console.error(`Configuration Firebase manquante : ${key}`);
		}
	});

	// Initialiser Analytics de manière conditionnelle
	analytics = (async () => {
		try {
			if (await isSupported()) {
				return getAnalytics(app);
			}
		} catch (error) {
			console.error("Erreur lors de l'initialisation d'Analytics:", error);
		}
		return null;
	})();
} catch (error) {
	console.error("Erreur lors de l'initialisation de Firebase:", error);
	throw error;
}

export { auth, analytics };
