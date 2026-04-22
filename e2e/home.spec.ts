import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display home page', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await expect(page).toHaveTitle(/Blog/)

    // Check for header navigation
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')

    // Click login link in header
    const loginLink = page.getByRole('link', { name: /登录/i })
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await expect(page).toHaveURL(/\/login/)
    }
  })
})

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check for login form elements
    await expect(page.getByRole('heading', { name: /登录/i })).toBeVisible()
    await expect(page.getByPlaceholder(/邮箱/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /登录/i })).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.getByPlaceholder(/邮箱/i).fill('invalid@example.com')
    await page.getByPlaceholder(/密码/i).fill('wrongpassword')

    // Submit form
    await page.getByRole('button', { name: /登录/i }).click()

    // Check for error message
    await expect(page.getByText(/邮箱或密码错误/i)).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Register Page', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('/register')

    // Check for registration form elements
    await expect(page.getByRole('heading', { name: /注册/i })).toBeVisible()
    await expect(page.getByPlaceholder(/用户名/i)).toBeVisible()
    await expect(page.getByPlaceholder(/邮箱/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /注册/i })).toBeVisible()
  })
})

test.describe('Admin Pages', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin')

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

test.describe('404 Page', () => {
  test('should display 404 for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page')

    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('页面不存在')).toBeVisible()
  })
})
