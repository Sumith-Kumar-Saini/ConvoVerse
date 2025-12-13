const esbuild = require("esbuild");
const path = require("path");

const isWatch = process.argv.includes("--watch");

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    outdir: "dist",
    platform: "node",
    target: "node20",
    format: "cjs",
    bundle: true,
    sourcemap: true,
    minify: false,
    logLevel: "info",
    absWorkingDir: path.resolve(__dirname),
    tsconfig: path.resolve(__dirname, "../../tsconfig.base.json"),
    external: ["ioredis", "bullmq"],

    watch: isWatch && {
      onRebuild(error) {
        if (error) console.error("Rebuild failed:", error);
        else console.log("Rebuilt successfully");
      },
    },
  })
  .then(() => {
    console.log("server build successful");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
