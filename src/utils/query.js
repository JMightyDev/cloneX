import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			cacheTime: 1000 * 60 * 30, // 30 minutes
			retry: 1,
			refetchOnWindowFocus: false,
			// Ajout d'options supplémentaires recommandées
			refetchOnReconnect: "always",
			refetchOnMount: true,
		},
		mutations: {
			// Configuration pour les mutations
			retry: 2,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

// Optionnel : Ajout d'un gestionnaire d'erreur global
queryClient.setDefaultOptions({
	mutations: {
		onError: (error) => {
			console.error("Erreur de mutation:", error);
			// Vous pouvez ajouter ici une notification toast si nécessaire
		},
	},
});

export default queryClient;
