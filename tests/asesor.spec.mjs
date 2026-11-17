// Cálculos y datos del asesor de La Barbarie.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, ASESOR, abrirAsesor } from "./_comun.mjs";

const CSV = readFileSync(join(RAIZ, "proyecto", "tests", "subasta-prueba.csv"), "utf-8");

test.beforeEach(async ({ page }) => {
  page.errores = [];
  page.on("pageerror", (e) => page.errores.push(String(e)));
  await abrirAsesor(page);
});
test.afterEach(async ({ page }) => {
  expect(page.errores, "errores de JavaScript").toEqual([]);
  expect(await page.evaluate(() => window.__errs), "errores capturados por la página").toEqual([]);
});

test("solo existe la sección MMO y la clave de datos no cambia", async ({ page }) => {
  expect(await page.evaluate(() => [KEY, S.sec, document.querySelectorAll(".sec.on").length, document.querySelector(".sec.on").id]))
    .toEqual(["wowf-chaman-v1", "mmo", 1, "sec-mmo"]);
  await page.evaluate(() => showSec("archivo"));
  expect(await page.evaluate(() => document.querySelector(".sec.on").id)).toBe("sec-mmo");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["wowf-chaman-v1"]);
});

test("fmtC: monedas, pendientes y pérdidas", async ({ page }) => {
  expect(await page.evaluate(() => [fmtC(0), fmtC(99), fmtC(100), fmtC(189), fmtC(10000), fmtC(12345), fmtC(null), fmtC(-133)]))
    .toEqual(["0 cobre", "99 cobre", "1 pl.", "1 pl. 89 cobre", "1 oro", "1 oro 23 pl. 45 cobre", "pendiente", "−1 pl. 33 cobre"]);
});

test("parseCSV: BOM, cabecera, comillas dobles y apóstrofos", async ({ page }) => {
  const filas = await page.evaluate((csv) => parseCSV("\uFEFF" + csv), CSV);
  expect(filas.length).toBe(14); // 13 válidas + 1 con precio no numérico; la cabecera se quita
  expect(filas[0]).toEqual(["149", "Mineral de cobre", "10", "", "500"]);
  expect(filas.find((f) => f[1].includes("Rok"))[1]).toBe("Hacha de Rok'tar del tigre (13)");
  expect(await page.evaluate(() => parseCSV('5,"Con ""comillas"" dentro",1,"",2')[0][1])).toBe('Con "comillas" dentro');
});

async function subirCSV(page, texto) {
  await page.evaluate(() => showTab("subasta"));
  await page.setInputFiles("#csv-file", { name: "subasta.csv", mimeType: "text/csv", buffer: Buffer.from(texto, "utf-8") });
  await expect(page.locator("#csv-msg")).not.toBeEmpty();
  return page.locator("#csv-msg").innerText();
}

test("subir CSV: guarda las filas válidas y dice cuántas ignora", async ({ page }) => {
  expect(await subirCSV(page, "\uFEFF" + CSV)).toBe("Subida guardada: 13 objetos. Filas ignoradas por no ser válidas: 1.");
  expect(await page.evaluate(() => [S.ahs.length, ahUltima().n, precioDe("Lingote de bronce"), dispDe("Pólvora férrea")])).toEqual([1, 13, 189, 415]);
});

test("subir CSV: rechaza un archivo con menos de 5 filas válidas", async ({ page }) => {
  expect(await subirCSV(page, '"Precio","Nombre"\n1,"a",1,"",1\n')).toContain("Archivo rechazado");
  expect(await page.evaluate(() => S.ahs.length)).toBe(0);
});

test("plan de inversión: con Minería 56 no propone fundir bronce", async ({ page }) => {
  await subirCSV(page, CSV);
  await page.evaluate(() => { S.skill["Minería"] = 56; S.sub.pres = 25; planHacer(); });
  const plan = await page.locator("#plan-salida").innerText();
  expect(plan).toContain("62 × Pólvora férrea");
  expect(plan).not.toContain("Lingote de bronce");
});

test("plan de inversión: con Minería 65 da el resultado documentado (recupera 40 pl. 51 cobre)", async ({ page }) => {
  await subirCSV(page, CSV);
  await page.evaluate(() => { S.skill["Minería"] = 65; S.sub.pres = 25; S.sub.com = 5; planHacer(); });
  const plan = await page.locator("#plan-salida").innerText();
  expect(plan).toContain("Comprar Piedra basta ×62 (6 pl. 20 cobre) → fabricar 62 × Pólvora férrea. Ganancia: 5 pl. 58 cobre.");
  expect(plan).toContain("Comprar Lingote de cobre ×8 + Lingote de estaño ×8 (18 pl. 80 cobre) → fabricar 16 × Lingote de bronce. Ganancia: 9 pl. 93 cobre.");
  expect(plan).toContain("Inviertes 25 pl. Recuperas 40 pl. 51 cobre");
  expect(plan).toContain("Ganancia total: 15 pl. 51 cobre");
});

test("compras por sufijo: nivel entre −4 y +1, sin objetos propios, de barato a caro", async ({ page }) => {
  await subirCSV(page, CSV);
  await page.evaluate(() => { S.pj.nivel = 12; renderEquipo(); });
  expect(await page.evaluate(() => comprasEquipo(ahUltima()).map((o) => o.r[1])))
    .toEqual(["Brazales de fuerza (9)", "Hacha de Rok'tar del tigre (13)", "Guantes del gorila (12)"]);
});

test("buscador: «Usar» funciona con nombres con apóstrofo", async ({ page }) => {
  await subirCSV(page, CSV);
  await page.fill("#bus-q", "rok");
  await page.keyboard.press("Enter");
  await page.locator("#bus-salida button").first().click();
  expect(await page.inputValue("#li-obj")).toBe("Hacha de Rok'tar del tigre (13)");
  expect(await page.inputValue("#li-pu")).toBe("9.00");
});

test("almacén, montura y libro: totales", async ({ page }) => {
  await subirCSV(page, CSV);
  await page.evaluate(() => {
    S.alm = { "Lingote de cobre": 40, "Cosa d'prueba": 3 };
    S.oro = [{ f: "2026-11-13", g: 250, n: "" }];
    S.sub.libro = [
      { id: "l1", f: "2026-11-13", tipo: "compra", obj: "Piedra basta", cant: 62, pu: 0.1 },
      { id: "l2", f: "2026-11-13", tipo: "venta", obj: "Pólvora férrea", cant: 62, pu: 0.2 },
    ];
    save(); pintaTodo();
  });
  expect(await page.locator("#alm-total").innerText()).toContain("54 pl.; quitando la comisión del 5%: 51 pl. 30 cobre. Sin precio en la subida: 1 material");
  expect(await page.evaluate(() => textoMeta())).toBe("Último apunte (2026-11-13): 2 oro 50 pl. Llevas el 2% y te faltan 97 oro 50 pl.");
  expect(await page.locator("#libro-total").innerText()).toContain("Balance: 5 pl. 58 cobre");
});

test("norm(): estado antiguo o raro no rompe ni pierde datos", async ({ page }) => {
  const s = await page.evaluate(() => norm({ pj: { nivel: 14 }, skill: { "Minería": 70 }, alm: { "Mineral de cobre": 5 }, tablon: "hola", sec: "zzz", tab: "nope", ahs: "x" }));
  const pescaPorDefecto = await page.evaluate(() => defS().skill["Pesca"]);
  expect(typeof pescaPorDefecto).toBe("number");
  expect([s.pj.nivel, s.pj.nombre, s.skill["Minería"], s.skill["Pesca"], s.alm["Mineral de cobre"], s.tablon, Array.isArray(s.ahs), s.sub.com])
    .toEqual([14, "Fissel Kasteaya", 70, pescaPorDefecto, 5, "hola", true, 5]);
  await page.evaluate(() => { localStorage.setItem("wowf-chaman-v1", JSON.stringify({ sec: "zzz", tab: "nope" })); });
  await page.goto("about:blank");
  await abrirAsesor(page);
  expect(await page.evaluate(() => [document.querySelectorAll(".sec.on").length, document.querySelectorAll(".wpane.on").length])).toEqual([1, 1]);
});

test("copia: exportar e importar conserva los datos; una copia no válida no cambia nada", async ({ page }) => {
  await page.evaluate(() => { S.tablon = "aviso de prueba"; S.alm = { Cobre: 3 }; save(); showTab("diario"); exportar(); });
  const copia = await page.inputValue("#ex-salida");
  await page.evaluate(() => { S.tablon = ""; S.alm = {}; save(); });
  await page.fill("#im-entrada", "{mal");
  await page.evaluate(() => importarAhora());
  expect(await page.locator("#im-msg").innerText()).toContain("no es válida");
  expect(await page.evaluate(() => S.tablon)).toBe("");
  await page.fill("#im-entrada", copia);
  await page.evaluate(() => importarAhora());
  expect(await page.evaluate(() => [S.tablon, S.alm.Cobre])).toEqual(["aviso de prueba", 3]);
});

test("borrar pide dos pulsaciones (y se desarma a los 4 s)", async ({ page }) => {
  // Reloj falso: entre las dos pulsaciones no pasa el tiempo aunque la máquina vaya lenta (antes, con >4 s
  // entre clics, el botón se desarmaba y el test fallaba sin motivo).
  await page.clock.install();
  await abrirAsesor(page);
  await page.evaluate(() => { S.alm = { Cobre: 3, Estaño: 2 }; save(); renderAlm(); showTab("almacen"); });
  const quitar = page.locator("#alm-lista button").first();
  const texto = await quitar.innerText();
  await quitar.click();
  await expect(quitar).toHaveText("¿Seguro? Pulsa otra vez");
  await page.clock.runFor(4100);
  await expect(quitar).toHaveText(texto);
  await quitar.click();
  await expect(quitar).toHaveText("¿Seguro? Pulsa otra vez");
  expect(await page.evaluate(() => Object.keys(S.alm).length)).toBe(2);
  await quitar.click();
  expect(await page.evaluate(() => Object.keys(S.alm).length)).toBe(1);
});

test("enlaces directos: #mmo-subasta abre Comercio", async ({ page }) => {
  await page.goto("about:blank");
  await abrirAsesor(page, "#mmo-subasta");
  await expect(page.locator("#wp-subasta")).toBeVisible();
});

// Las subidas completas incluidas en la web se cargan de datos/*.json (antes iban dentro del HTML).
test("subidas incluidas: llegan todas de datos/, con sus filas", async ({ page }) => {
  const subidas = await page.evaluate(() => AHB.filter((a) => a.src).map((a) => [a.id, Array.isArray(a.d) && a.d.length === a.n]));
  expect(subidas.length).toBeGreaterThanOrEqual(5);
  expect(subidas.filter(([, ok]) => !ok), "subidas sin sus filas").toEqual([]);
  expect(await page.locator("#aviso-datos").innerText()).toBe("");
});

test("subidas incluidas: la de 2026-11-17 18:18 (AH5) da el plan documentado en comercio.md", async ({ page }) => {
  // Estado limpio (Minería 80, Ingeniería 43, 25 pl.): 159 pólvoras férreas + 7 puñados de tornillos; sobran 51 cobres.
  expect(await page.evaluate(() => {
    const P = planCalc(AHB.find((a) => a.id === "s5"));
    return [P.pasos.map((p) => [p.rec.r, p.u]), Math.round(P.inv), Math.round(P.cob), P.resta];
  })).toEqual([[["Pólvora férrea", 159], ["Un puñado de tornillos de cobre", 7]], 2449, 12546, 51]);
});

test("subidas incluidas: si falta una, lo dice y calcula con las demás", async ({ page }) => {
  await page.route("**/asesor/datos/subasta-s1-*.json", (r) => r.fulfill({ status: 404, body: "" }));
  await page.goto("about:blank");
  await page.goto(ASESOR + "#mmo-subasta");
  await expect(page.locator("html")).toHaveAttribute("data-precios", "incompletos");
  await expect(page.locator("#aviso-datos")).toContainText("No se han podido cargar los precios de 1 subida incluida en la web");
  expect(await page.evaluate(() => AHB.map((a) => a.id).includes("s1"))).toBe(false);
  await page.evaluate(() => planHacer());
  await expect(page.locator("#plan-salida")).toContainText("Plan con");
});

test("un error inesperado se avisa en pantalla (una vez) y queda en __errs", async ({ page }) => {
  await page.evaluate(() => { setTimeout(() => { throw new Error("prueba 1"); }); setTimeout(() => { throw new Error("prueba 2"); }); });
  await expect(page.locator("#aviso-error")).toContainText("Algo ha fallado en el asesor");
  await expect(page.locator("#aviso-error")).toContainText("prueba 1");
  await expect.poll(() => page.evaluate(() => window.__errs.length)).toBe(2);
  expect(await page.locator("#aviso-error p").count()).toBe(1);
  // Errores provocados a propósito: se limpian para que afterEach no los cuente.
  page.errores = [];
  await page.evaluate(() => { window.__errs = []; });
});
