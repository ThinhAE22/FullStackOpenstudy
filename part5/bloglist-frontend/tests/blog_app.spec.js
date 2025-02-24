import { test, expect } from '@playwright/test'
import { loginWith, createBlog} from './helper'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
          data: {
            name: 'T500',
            username: 'Thinh',
            password: '1234'
          }
        })

        await request.post('/api/users', {
            data: {
              name: 'GG',
              username: 'alo123',
              password: '5678'
            }
          })
    
        await page.goto('')
    })

    test('front page can be opened and login form is visible', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        // Check if the heading "Login" is visible
        await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
    })

    test.describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Thinh', '1234')
            await expect(page.getByText('T500 logged-in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('mluukkai')
            await page.getByTestId('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()
          
            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('Wrong user name or password')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
          
            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })

        test.describe('When logged in', () => {
            test.beforeEach(async ({ page }) => {
                await loginWith(page, 'Thinh', '1234')
            })
          
            test('a new blog can be created', async ({ page }) => {
                await createBlog(page,'Thinh','random url', 'a note created by playwright')
                await expect(page.getByText('a note created by playwright of Thinh').first()).toBeVisible();
            })
        })

        test.describe('A blog can be like', () => {
            test.beforeEach(async ({ page }) => {
                await loginWith(page, 'Thinh', '1234')
                await createBlog(page,'Thinh','random url', 'another note created by playwright')
            })


            test('a blog can be liked', async ({ page, request }) => {
                await page.getByRole('button', { name: 'view' }).click()
                // Click the like button
                await page.getByRole('button', { name: 'like', exact: true }).click()
    
                // Verify that the likes have increased
                await expect(page.getByText('likes 1').first()).toBeVisible();
            }) 
        })

        test.describe('A blog can be removed', () => {
            test.beforeEach(async ({ page }) => {
                await loginWith(page, 'Thinh', '1234')
                await createBlog(page, 'Thinh', 'random url', 'another note created by playwright to delete')
            })
        
            test('a blog can be removed', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
        
                // ✅ Register dialog listener BEFORE clicking "remove"
                page.once('dialog', async (dialog) => {
                    expect(dialog.type()).toBe('confirm')  // Ensure it's a confirmation dialog
                    await dialog.accept()  // Click "OK" in the confirmation dialog
                })
        
                // Click the remove button
                await page.getByRole('button', { name: 'remove', exact: true }).click()
        
                // ✅ Expect status message confirming deletion
                const statusDiv = page.locator('.status')
                await expect(statusDiv).toContainText('You just deleted blog')
                await expect(statusDiv).toHaveCSS('border-style', 'solid')
        
                // ✅ Ensure the blog is no longer visible
                await expect(page.getByText('another note created by playwright to delete')).not.toBeVisible()
            }) 
        })      
        
        test.describe('A blog can not be be removed', () => {
            test.beforeEach(async ({ page }) => {
                await loginWith(page, 'alo123', '5678')
            })
        
            test('a blog can not be removed by other', async ({ page }) => {
                await expect(page.getByRole('blog')).not.toBeVisible()
            }) 
        })


        test.describe('A blog can be sorted by likes', () => {
                test.beforeEach(async ({ page }) => {
                await loginWith(page, 'Thinh', '1234')
                await createBlog(page, 'Thinh', 'random url', 'Blog 1')
                await createBlog(page, 'Thinh', 'random url', 'Blog 2')
        
                // Like "Blog 2" twice to ensure sorting works
                const blogs = page.locator('.blog')
                await blogs.nth(1).getByRole('button', { name: 'view' }).click()
                await blogs.nth(1).getByRole('button', { name: 'like', exact: true }).click()
                await blogs.nth(1).getByRole('button', { name: 'like', exact: true }).click()
                await blogs.nth(1).getByRole('button', { name: 'hide' }).click()
            })
        
            test('blogs should be sorted by likes', async ({ page }) => {
                const blogs = page.locator('.blog')
        
                // Expand both blogs
                await blogs.nth(0).getByRole('button', { name: 'view' }).click()
                await blogs.nth(1).getByRole('button', { name: 'view' }).click()

                await page.getByRole('button', { name: 'Sort by like', exact: true }).click()
        
                // ✅ Verify first blog has 2 likes
                await expect(blogs.nth(0)).toContainText('likes 2')
        
                // ✅ Verify second blog has 0 likes
                await expect(blogs.nth(1)).toContainText('likes 0')
            })
        })
        
    })
})
