import { test, expect} from '@playwright/test'
import { loginWith, createNote} from './helper'

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'T500',
        username: 'Thinh',
        password: '1234'
      }
    })

    await page.goto('')
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'Thinh', '1234')
    await expect(page.getByText('T500 logged in')).toBeVisible()
  })


  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('Thinh')
    await page.getByTestId('password').fill('1234')

    /**
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill('mluukkai')
    await textboxes[1].fill('salainen')
     */

    /**
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
     */
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('T500 logged in')).toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'Thinh', '1234')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright').first()).toBeVisible();
    })

    test.describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = await page.getByText('first note')
        const otherNoteElement = await otherNoteText.locator('..')

        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })

  test('login fails with wrong password', async ({ page }) =>{
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
  
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })
  

})

