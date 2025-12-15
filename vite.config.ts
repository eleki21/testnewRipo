import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用の設定
  // リポジトリ名に合わせてbaseを設定
  // 例: https://username.github.io/testnewRipo/
  base: process.env.GITHUB_ACTIONS ? '/testnewRipo/' : '/',
})
