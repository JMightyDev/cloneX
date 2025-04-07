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
		historyApiFallback: {
			rewrites: [{ from: /^\/x\/.*/, to: "/index.html" }],
		},
	},
	preview: {
		port: 3000,
		open: true,
		base: "/x/",
	},
	resolve: {
		alias: {
			"@": "/src",
			"@components": "/src/components",
			"@pages": "/src/pages",
			"@assets": "/src/assets",
		},
	},
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom"],
	},
});
