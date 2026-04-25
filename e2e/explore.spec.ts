import { test, expect } from "@playwright/test";

test.describe("Explore Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore");
  });

  {/* Skipped because the Explore page is currently a placeholder*/}
  test.skip("should display the tour discovery UI", async ({ page }) => {
    await expect(page.getByTestId("search-destination")).toBeVisible();
    await expect(page.getByTestId("search-submit")). toBeVisible();
  });

  {/*Skipped until actual tour data and search results are implemented*/}
  test.skip("should show results when seaching", async ({ page }) => {
    const searchInput = page.getByTestId("search-destination");
    await searchInput.fill("Iloilo");
    await page.getByTestId("search-submit").click();

    await expect(page.getByTestId("tour-card").first()).toBeVisible();
  });
});
