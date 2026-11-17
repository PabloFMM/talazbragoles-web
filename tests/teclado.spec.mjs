// Uso solo con teclado: orden de tabulación, foco visible, enlace de salto y menú móvil.
import { test, expect } from "@playwright/test";
import { ASESOR } from "./_comun.mjs";

/** Datos del elemento con foco. */
const foco = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return {
      etiqueta: el.tagName.toLowerCase(),
      texto: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
      contorno: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2,
      visible: r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
    };
  });

for (const ruta of ["/", "/fuentes/", "/mmo/", "/mmo/wow-forever/", "/mmo/wow-forever/guias/mineria/", ASESOR]) {
  test(`teclado: ${ruta}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(ruta);

    // El primer Tab lleva al enlace de salto, y se ve.
    await page.keyboard.press("Tab");
    const primero = await foco(page);
    expect(primero?.texto).toContain("Saltar al contenido");
    expect(primero?.visible, "el enlace de salto se ve al recibir el foco").toBe(true);
    await page.keyboard.press("Enter");
    // toHaveURL reintenta: page.url() es la copia de Playwright y se actualiza con un evento aparte, así que
    // leída justo después del Intro aún podía dar la URL de antes (falló así en el asesor, con «#mmo-hoy»).
    await expect(page).toHaveURL(/#contenido$/);

    // Los 40 siguientes (o hasta el final de la página, cuando el foco sale a la barra del navegador):
    // cada elemento con foco está dentro de la pantalla y tiene contorno.
    const fallos = [];
    let recorridos = 0;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const f = await foco(page);
      if (!f) break; // fin de la página
      recorridos++;
      if (!f.contorno) fallos.push(`Tab ${i + 1}: sin contorno de foco en <${f.etiqueta}> «${f.texto}»`);
      if (!f.visible) fallos.push(`Tab ${i + 1}: foco fuera de la pantalla en <${f.etiqueta}> «${f.texto}»`);
    }
    expect(recorridos, "elementos recorridos con Tab tras el salto").toBeGreaterThanOrEqual(8);
    expect(fallos, fallos.join("\n")).toEqual([]);
  });
}

test("teclado: menú móvil se abre con Intro y sus enlaces reciben el foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mmo/");
  const resumen = page.locator("nav details > summary");
  await resumen.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("nav details[open]")).toHaveCount(1);
  await page.keyboard.press("Tab");
  const f = await foco(page);
  expect(f?.etiqueta).toBe("a");
  expect(f?.visible).toBe(true);
  expect(f?.contorno).toBe(true);
});

test("teclado: en el asesor se cambia de pestaña con Intro", async ({ page }) => {
  await page.goto(ASESOR);
  await page.locator("#wt-oro").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#wp-oro")).toBeVisible();
  await expect(page.locator("#wt-oro")).toHaveAttribute("aria-current", "true");
});
