// Accesibilidad con axe-core: WCAG 2.1 A y AA, más contraste reforzado (AAA, 7:1).
// Donde axe no puede medir el contraste (texto sobre capas semitransparentes), lo mide tests/lectura.spec.mjs.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { rutas, ASESOR, pestanasAsesor } from "./_comun.mjs";

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

// Un test por pestaña (antes uno solo de ~2-4 min con las 14): se reparten entre los workers.
const PESTANAS = pestanasAsesor();
for (const pest of PESTANAS) {
  test(`axe: asesor, pestaña ${pest}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(ASESOR);
    expect(await page.evaluate(() => TABS), "pestañas del asesor").toEqual(PESTANAS);
    await page.evaluate((p) => { showTab(p); if (p === "subasta") { planHacer(); document.getElementById("bus-q").value = "de"; buscar(); calcFab(); calcSubasta(); } }, pest);
    const r = await axe(page).analyze();
    expect(resumen(r.violations), resumen(r.violations).join("\n")).toEqual([]);
  });
}
