import { defineConfig } from "tsup";
import { glob } from "glob";

const entries = await glob([
    "src/server.ts",
    "src/controller/**/*.ts",
    "src/services/**/*.ts",
    "src/routes/**/*.ts",
], {
    ignore: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.d.ts",
    ],
});

export default defineConfig({
    entry: entries,
    format: ["esm"],
    outDir: "dist",
    clean: true,
    sourcemap: true,
    dts: false,
    splitting: true,
    treeshake: true,
    tsconfig: "./tsconfig.json"
});