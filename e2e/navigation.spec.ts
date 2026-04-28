import { test, expect } from "@playwright/test";

test.describe("Navigation Flow", () => {
  test("should navigate from Home to Login to Signup", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /login/i }).first().click();
    await expect(page).toHaveURL(/\/login/);

    await expect(page.getByTestId("login-email")).toBeVisible();

    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
  test("protected route should redirect to login", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
  });
});
