// vite.config.ts
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import flowbiteReact from "flowbite-react/plugin/vite"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const r = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": r("src"),
      "@app": r("src/app"),
      "@pages": r("src/pages"),
      "@features": r("src/features"),
      "@widgets": r("src/widgets"),
      "@entities": r("src/entities"),
      "@shared": r("src/shared"),
      "@assets": r("src/shared/assets"),
      "@hooks": r("src/shared/hooks"),
      "@lib": r("src/shared/lib"),
      "@ui": r("src/shared/ui"),
      "@api": r("src/shared/api"),
    },
  },
  define: { global: "window" },
  server: {
    https: false,
    host: true,
    port: 3000,
    proxy: {
      "/api/ai": {
        target: "http://192.168.0.180:8001",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      "/api": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
      },
      "/py": {
        target: "http://192.168.0.180:8001",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/py/, ""),
      },
      "/ws-stomp": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  assetsInclude: ["**/*.mp4", "**/*.ttf"],
})
