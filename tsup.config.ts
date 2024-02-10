import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/**/*.ts"],
    outDir: "dist/",
    splitting: false,
    sourcemap: false,
    clean: true,
    target: "es2022",
    tsconfig: "tsconfig.json",
    skipNodeModulesBundle: true,
    dts: false,
    shims: false,
});
