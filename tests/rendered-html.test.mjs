import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the LOCAM home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /LOCAM/);
  assert.match(html, /Trouvez votre prochain chez-vous à Mahdia/);
  assert.match(html, /L’immobilier, côté Mahdia/);
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("server-renders a property detail route", async () => {
  const response = await render("/properties/LOC-101");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Appartement S\+2 Vue Mer/);
  assert.match(html, /LOC-101/);
});

test("keeps production metadata and Vercel deployment configuration", async () => {
  const [page, layout, packageJsonText, vercelConfigText] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageJsonText);
  const vercelConfig = JSON.parse(vercelConfigText);

  assert.match(page, /<HomeClient \/>/);
  assert.match(layout, /LOCAM Mahdia/);
  assert.equal(packageJson.dependencies.next, "16.2.6");
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.equal(vercelConfig.framework, "nextjs");
  assert.equal(vercelConfig.buildCommand, "npm run build:vercel");

  await assert.rejects(access(new URL("public/_sites-preview", projectRoot)));
});
