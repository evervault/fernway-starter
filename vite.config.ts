import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  lint: {
    ignorePatterns: [".next/**", "data/**", "next-env.d.ts"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: { ignorePatterns: [".next/**", "data/**"] },
  test: { include: ["**/*.test.ts"], exclude: ["node_modules/**", ".next/**"] },
});
