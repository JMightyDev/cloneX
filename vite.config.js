import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/x/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
				},
				// Ajout de la configuration des assets pour éviter les problèmes de chemins
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".").at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = "img";
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
			},
		},
		chunkSizeWarningLimit: 1000,
		sourcemap: true,
	},
	server: {
		port: 3000,
		open: true,
		base: "/x/",
		// Ajout de la gestion du historique pour le routage SPA
		historyApiFallback: {
			rewrites: [{ from: /^\/x\/.*/, to: "/index.html" }],
		},
	},
	// Ajout de la configuration preview pour tester le build
	preview: {
		port: 3000,
		open: true,
		base: "/x/",
	},
	resolve: {
		// Ajout des alias pour faciliter les imports
		alias: {
			"@": "/src",
			"@components": "/src/components",
			"@pages": "/src/pages",
			"@assets": "/src/assets",
		},
	},
	// Optimisation pour la production
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom"],
	},
});
