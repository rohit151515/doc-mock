import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["bn", "en"]) {
      await page.goto("http://127.0.0.1:3127/" + lang);
      assert.equal(await page.locator("html").getAttribute("lang"), lang);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs
              .filter((i) => i.getBoundingClientRect().top < innerHeight)
              .every((i) => i.complete && i.naturalWidth > 0),
          ),
        true,
      );
      for (const a of await page.locator('a[href^="#"]').all()) {
        const href = await a.getAttribute("href");
        assert.equal(await page.locator(href).count(), 1);
      }
      if (width === 390) {
        await page.locator(".menu").click();
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".menu").getAttribute("aria-expanded"),
          "false",
        );
      }
      assert.equal(await page.locator(".price").first().locator("dt").count(), 10);
      await page.locator(".question summary").first().click();
      const audit = await new AxeBuilder({ page }).analyze();
      console.log({
        width,
        lang,
        violations: audit.violations.map((v) => v.id),
      });
      assert.equal(audit.violations.length, 0);
      await page.locator(".lang").click();
      assert.equal(
        await page.locator("html").getAttribute("lang"),
        lang === "bn" ? "en" : "bn",
      );
    }
  }
  assert.deepEqual(errors, []);
  console.log("Responsive checks passed.");
} finally {
  await browser.close();
}
