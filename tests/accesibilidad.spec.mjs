// Accesibilidad con axe-core: WCAG 2.1 A y AA, más contraste reforzado (AAA, 7:1).
// Donde axe no puede medir el contraste (texto sobre capas semitransparentes), lo mide tests/lectura.spec.mjs.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { rutas, ASESOR } from "./_comun.mjs";

const axe = (page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .options({ rules: { "color-contrast-enhanced": { enabled: true } } });

const resumen = (v) => v.map((x) => `${x.id} (${x.impact}): ${x.help} → ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);

for (const ruta of rutas().filter((r) => r !== ASESOR)) {
  for (const ancho of [390, 1280]) {
    test(`axe: ${ruta} a ${ancho} px`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto(ruta);
      const r = await axe(page).analyze();
      expect(resumen(r.violations), resumen(r.violations).join("\n")).toEqual([]);
    });
  }
}

test("axe: asesor, todas las pestañas", async ({ page }) => {
  test.setTimeout(600_000); // axe tarda ~10 s por pestaña en el asesor
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ASESOR);
  const PESTANAS = await page.evaluate(() => TABS);
  const fallos = [];
  for (const pest of PESTANAS) {
    await page.evaluate((p) => { showTab(p); if (p === "subasta") { planHacer(); document.getElementById("bus-q").value = "de"; buscar(); calcFab(); calcSubasta(); } }, pest);
    const r = await axe(page).analyze();
    for (const linea of resumen(r.violations)) fallos.push(`${pest} · ${linea}`);
  }
  expect(fallos, fallos.join("\n")).toEqual([]);
});
