import * as esbuild from "esbuild";
import { readFileSync } from "fs";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: !watch,
  outfile: "dist/widget.js",
  platform: "browser",
  target: ["es2017"],
  format: "iife",
  globalName: "ViphWidget",
  define: {
    "process.env.NODE_ENV": watch ? '"development"' : '"production"',
  },
  loader: { ".css": "text" },
  banner: {
    js: "/* Viph scent discovery widget — viph.co */",
  },
});

if (watch) {
  await ctx.watch();
  console.log("Watching...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log("Widget built to dist/widget.js");
}
