import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/x/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
		// Ajout d'optimisations recommandées
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
				},
			},
		},
		// Amélioration du caching
		chunkSizeWarningLimit: 1000,
		sourcemap: true,
	},
	// Ajout de la configuration du serveur pour le développement local
	server: {
		port: 3000,
		open: true,
		// Pour tester localement avec le même chemin de base
		base: "/x/",
	},
});
