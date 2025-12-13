const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/server.ts"], // compile all .ts files
    outdir: "./dist", // keep directory structure
    platform: "node", // Node environment
    target: "esnext", // pick your Node version
    format: "cjs",
    bundle: true,
    sourcemap: true,
    minify: false, // optional
    logLevel: "info",
  })
  .then(() => {
    console.log("esbuild build successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("esbuild build failed:", error);
    process.exit(1);
  });
