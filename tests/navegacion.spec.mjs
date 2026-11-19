// Navegación (índice, migas y enlace de salto) según WCAG 2.2 AA y el patrón de las WAI-ARIA APG.
// Criterios y decisiones: proyecto/docs/diseno.md §6.
//  - aria-current: "page" en la portada de la sección, "true" en sus subpáginas (como GOV.UK).
//  - Cada entrada del índice lleva a una página que existe y que la marca como actual.
//  - Migas: empiezan en Inicio, se llaman como el índice, el último paso es la página.
//  - El menú móvil llega cerrado en cada página; zoom (400 % = 320 px, texto al 200 %),
//    espaciado de texto (1.4.12) e impresión.
//  - El asesor (generado) lleva la misma cabecera que el sitio.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { rutas, ASESOR, DIST } from "./_comun.mjs";

const PAGINAS = rutas();
const edicion = PAGINAS.find((r) => /^\/ediciones\/[^/]+\/$/.test(r));
const guia = "/mmo/wow-forever/guias/mineria/";

/** Página → [entrada del índice marcada, valor de aria-current]. */
const ESPERADO = {
  "/": ["/", "page"],
  "/ediciones/": ["/ediciones", "page"],
  [edicion]: ["/ediciones", "true"],
  "/cronologia/": ["/cronologia", "page"],
  "/sistemas/": ["/sistemas", "page"],
  "/personas/": ["/personas", "page"],
  "/fuentes/": ["/fuentes", "page"],
  "/rol/": ["/rol", "page"],
  "/mmo/": ["/mmo", "page"],
  "/mmo/wow-forever/": ["/mmo", "true"],
  "/mmo/wow-forever/guias/": ["/mmo", "true"],
  [guia]: ["/mmo", "true"],
  [ASESOR]: ["/mmo", "true"],
  "/diseno/": [null, null], // muestrario interno: fuera del índice
};

/** Lee el índice de la página: las dos copias (menú plegable y fila) y el «Estás en». */
const leerIndice = (page) =>
  page.evaluate(() => {
    const copia = (sel) =>
      [...document.querySelectorAll(`${sel} a`)].map((a) => ({
        href: a.getAttribute("href"),
        texto: a.querySelector(".tz-nav-texto")?.textContent.trim(),
        actual: a.getAttribute("aria-current"),
      }));
    const nav = document.querySelectorAll('nav[aria-label="Secciones"]');
    return {
      navs: nav.length,
      enCabecera: !!document.querySelector('header nav[aria-label="Secciones"]'),
      plegable: copia(".tz-nav-plegable"),
      fila: copia(".tz-nav-fila"),
      grupos: [...document.querySelectorAll(".tz-nav-fila .tz-nav-grupo-titulo")].map((t) => t.textContent.trim()),
      donde: document.querySelector(".tz-nav-donde")?.textContent.replace(/\s+/g, " ").trim() ?? null,
      resumen: document.querySelector(".tz-nav-plegable > summary")?.textContent.replace(/\s+/g, " ").trim(),
      abierto: !!document.querySelector(".tz-nav-plegable[open]"),
    };
  });

test("navegación: aria-current en la sección y en sus subpáginas", async ({ page }) => {
  expect(edicion, "hay al menos una ficha de edición").toBeTruthy();
  const fallos = [];
  for (const [ruta, [href, valor]] of Object.entries(ESPERADO)) {
    await page.goto(ruta);
    const ind = await leerIndice(page);
    if (ind.navs !== 1 || !ind.enCabecera) fallos.push(`${ruta}: ${ind.navs} landmarks «Secciones» (o fuera de la cabecera)`);
    if (ind.plegable.length !== 8 || ind.fila.length !== 8) fallos.push(`${ruta}: el índice no tiene 8 entradas`);
    if (JSON.stringify(ind.plegable) !== JSON.stringify(ind.fila)) fallos.push(`${ruta}: las dos copias del índice no coinciden`);
    if (JSON.stringify(ind.grupos) !== JSON.stringify(["Archivo", "Comunidad"])) fallos.push(`${ruta}: grupos ${ind.grupos}`);
    if (!ind.resumen?.startsWith("Menú")) fallos.push(`${ruta}: el botón no dice «Menú» (${ind.resumen})`);
    if (ind.abierto) fallos.push(`${ruta}: el menú llega abierto`);
    const marcados = ind.fila.filter((e) => e.actual);
    if (href === null) {
      if (marcados.length) fallos.push(`${ruta}: no debería marcar ninguna entrada (${marcados.map((e) => e.href)})`);
      continue;
    }
    if (marcados.length !== 1 || marcados[0].href !== href || marcados[0].actual !== valor)
      fallos.push(`${ruta}: marcado ${JSON.stringify(marcados)}; esperaba ${href} = "${valor}"`);
    const etiqueta = ind.fila.find((e) => e.href === href)?.texto;
    if (ind.donde !== `Estás en: ${etiqueta}`) fallos.push(`${ruta}: «${ind.donde}» (esperaba «Estás en: ${etiqueta}»)`);
  }
  expect(fallos, fallos.join("\n")).toEqual([]);
});

test("navegación: cada entrada del índice lleva a su página y esta la marca como actual", async ({ page }) => {
  await page.goto("/");
  const entradas = (await leerIndice(page)).fila;
  const fallos = [];
  for (const { href, texto } of entradas) {
    const r = await page.goto(href);
    if (r?.status() !== 200) { fallos.push(`${texto} → ${href}: HTTP ${r?.status()}`); continue; }
    const ind = await leerIndice(page);
    const yo = ind.fila.find((e) => e.href === href);
    if (yo?.actual !== "page") fallos.push(`${texto} → ${href}: la página de destino no la marca con aria-current="page"`);
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) fallos.push(`${texto} → ${href}: ${h1} <h1>`);
  }
  expect(fallos, fallos.join("\n")).toEqual([]);
});

test("navegación: en todas las páginas, como mucho una entrada marcada y que contiene la ruta", async ({ page }) => {
  const fallos = [];
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    const ind = await leerIndice(page);
    const marcados = ind.fila.filter((e) => e.actual);
    if (marcados.length > 1) fallos.push(`${ruta}: ${marcados.length} entradas marcadas`);
    for (const m of marcados) {
      const h = m.href === "/" ? "/" : m.href + "/";
      const ok = m.actual === "page" ? ruta === h : ruta.startsWith(h) && ruta !== h;
      if (!ok) fallos.push(`${ruta}: ${m.href} marcado como "${m.actual}"`);
    }
  }
  expect(fallos, fallos.join("\n")).toEqual([]);
});

test("migas: empiezan en Inicio, se llaman como el índice y sus enlaces existen", async ({ page, request }) => {
  const fallos = [];
  let conMigas = 0;
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    const migas = await page.evaluate(() => {
      const nav = document.querySelector("nav.tz-migas");
      if (!nav) return null;
      return {
        etiqueta: nav.getAttribute("aria-label"),
        pasos: [...nav.querySelectorAll("li")].map((li) => {
          const a = li.querySelector("a");
          return { texto: li.textContent.trim(), href: a?.getAttribute("href") ?? null, actual: li.querySelector("[aria-current]")?.getAttribute("aria-current") ?? null };
        }),
        indice: Object.fromEntries([...document.querySelectorAll(".tz-nav-fila a")].map((a) => [a.getAttribute("href"), a.querySelector(".tz-nav-texto").textContent.trim()])),
      };
    });
    if (!migas) continue;
    conMigas++;
    const { pasos, indice } = migas;
    if (!migas.etiqueta) fallos.push(`${ruta}: las migas no tienen aria-label`);
    if (pasos[0]?.texto !== "Inicio" || pasos[0]?.href !== "/") fallos.push(`${ruta}: las migas no empiezan en Inicio`);
    const ultimo = pasos.at(-1);
    if (ultimo.href || ultimo.actual !== "page") fallos.push(`${ruta}: el último paso debe ser la página (sin enlace, aria-current="page")`);
    for (const p of pasos.slice(0, -1)) {
      if (!p.href) { fallos.push(`${ruta}: paso intermedio «${p.texto}» sin enlace`); continue; }
      if (indice[p.href] && indice[p.href] !== p.texto) fallos.push(`${ruta}: la miga «${p.texto}» se llama «${indice[p.href]}» en el índice`);
      const r = await request.get(p.href);
      if (r.status() !== 200) fallos.push(`${ruta}: la miga «${p.texto}» → ${p.href} da HTTP ${r.status()}`);
      if (p.href !== "/" && !ruta.startsWith(p.href + "/")) fallos.push(`${ruta}: la miga «${p.texto}» (${p.href}) no es un antepasado de la página`);
    }
  }
  expect(conMigas, "páginas con migas").toBeGreaterThanOrEqual(5);
  expect(fallos, fallos.join("\n")).toEqual([]);
});

test("menú móvil: se abre con el ratón, lleva a la página y esta llega con el menú cerrado", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mmo/");
  const boton = page.locator(".tz-nav-plegable > summary");
  await expect(boton).toBeVisible();
  const caja = await boton.boundingBox();
  expect(caja.height).toBeGreaterThanOrEqual(48);
  await boton.click();
  await expect(page.locator(".tz-nav-plegable[open]")).toHaveCount(1);
  // Abierto: el icono pasa de tres rayas a aspa, y el botón se invierte.
  await expect(page.locator(".tz-nav-plegable .tz-nav-icono-cerrar")).toBeVisible();
  await expect(page.locator(".tz-nav-plegable .tz-nav-icono-abrir")).toBeHidden();
  // No tapa nada: el menú abierto empuja el contenido (no flota encima).
  const posicion = await page.locator(".tz-nav-plegable").evaluate((d) => getComputedStyle(d).position);
  expect(posicion).toBe("static");
  await page.locator(".tz-nav-plegable a", { hasText: "Fuentes" }).click();
  await expect(page).toHaveURL(/\/fuentes\/?$/);
  await expect(page.locator(".tz-nav-plegable[open]")).toHaveCount(0);
  expect((await leerIndice(page)).donde).toBe("Estás en: Fuentes");
});

test("menú móvil con teclado a 320 px: cada enlace recibe el foco dentro de la pantalla", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/ediciones/");
  await page.locator(".tz-nav-plegable > summary").focus();
  await page.keyboard.press("Enter");
  const fallos = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const f = await page.evaluate(() => {
      const el = document.activeElement, r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return { dentro: !!el.closest(".tz-nav-plegable"), texto: el.textContent.trim(), visible: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, contorno: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2 };
    });
    if (!f.dentro) fallos.push(`Tab ${i + 1}: el foco salió del menú en «${f.texto}»`);
    if (!f.visible) fallos.push(`Tab ${i + 1}: «${f.texto}» fuera de la pantalla`);
    if (!f.contorno) fallos.push(`Tab ${i + 1}: «${f.texto}» sin contorno de foco`);
  }
  // Escape no hace nada sin JS; se cierra con el mismo botón (Mayús+Tab hasta él e Intro).
  expect(fallos, fallos.join("\n")).toEqual([]);
});

/**
 * Comprueba en la página que nada de la navegación (cabecera, índice, migas) se sale por la
 * derecha ni queda recortado. El resto de la página lo mide tests/lectura.spec.mjs en 16 anchos
 * (las tablas, a 320 px con el texto al 200 %, pueden pedir scroll: WCAG 1.4.10 las exime).
 */
const desbordes = () => {
  const f = [];
  const cab = document.querySelector("header.tz-cabecera");
  if (cab.scrollWidth > cab.clientWidth + 1) f.push(`la cabecera se desborda (${cab.scrollWidth} > ${cab.clientWidth})`);
  document.querySelectorAll(".tz-nav a, .tz-nav summary, .tz-migas a, .tz-logo").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || el.closest("details:not([open])") && !el.closest("summary")) return;
    if (r.right > innerWidth + 0.5) f.push(`«${el.textContent.trim().slice(0, 25)}» se sale (${Math.round(r.right)} > ${innerWidth})`);
    if (el.scrollWidth > el.clientWidth + 1) f.push(`«${el.textContent.trim().slice(0, 25)}» recortado`);
  });
  return f;
};
const MUESTRA = ["/", "/ediciones/", edicion, "/fuentes/", "/mmo/wow-forever/", guia];

test("zoom: texto al 200 % (1.4.4) y espaciado de texto (1.4.12) sin pérdidas, con el menú abierto y cerrado", async ({ page }) => {
  const fallos = [];
  for (const ruta of MUESTRA) {
    for (const ancho of [320, 640, 1280]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto(ruta);
      for (const modo of ["texto 200 %", "espaciado 1.4.12"]) {
        await page.evaluate((m) => {
          document.getElementById("__prueba")?.remove();
          const s = document.createElement("style");
          s.id = "__prueba";
          s.textContent = m === "texto 200 %"
            ? "html { font-size: 200% !important; }"
            : "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }";
          document.head.append(s);
        }, modo);
        for (const abierto of [false, true]) {
          await page.evaluate((a) => { const d = document.querySelector(".tz-nav-plegable"); if (d) d.open = a; }, abierto);
          for (const f of await page.evaluate(desbordes)) fallos.push(`${ruta} · ${ancho} px · ${modo}${abierto ? " · menú abierto" : ""} · ${f}`);
        }
      }
    }
  }
  expect([...new Set(fallos)], fallos.slice(0, 20).join("\n")).toEqual([]);
});

test("impresión: sin índice ni enlace de salto; el contenido y las migas sí", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  for (const ruta of ["/", guia]) {
    await page.goto(ruta);
    await expect(page.locator(".tz-nav")).toBeHidden();
    await expect(page.locator(".tz-saltar")).toBeHidden();
    await expect(page.locator(".tz-pie nav")).toBeHidden();
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator(".tz-logo")).toBeVisible();
  }
  await expect(page.locator("nav.tz-migas")).toBeVisible();
  await page.goto(ASESOR);
  await expect(page.locator(".tz-nav")).toBeHidden();
  await expect(page.locator(".fsbtns")).toBeHidden();
});

test("asesor: misma cabecera y mismo índice que el sitio", () => {
  const cabecera = (archivo) => {
    const html = readFileSync(join(DIST, archivo), "utf-8");
    const m = /<a href="#contenido" class="tz-saltar">[\s\S]*?<\/header>/.exec(html);
    expect(m, `${archivo}: sin enlace de salto + cabecera del sitio`).toBeTruthy();
    return m[0].replace(/\s+/g, " ").replace(/> </g, "><").replace(/ >/g, ">");
  };
  // Las dos páginas son subpáginas de MMO: el marcado debe ser idéntico, carácter a carácter.
  expect(cabecera("mmo/wow-forever/asesor/index.html")).toBe(cabecera("mmo/wow-forever/index.html"));
});
