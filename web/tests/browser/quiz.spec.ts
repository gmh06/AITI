import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const progress = (page: Page) => page.locator('.context-label')
const option = (page: Page, key = 'A') => page.getByRole('button', { name: new RegExp(`^${key}\\.`) })
const skip = (page: Page) => page.getByRole('button', { name: '跳过揭晓' })

async function start(page: Page) {
  await page.goto('./')
  await page.getByRole('button', { name: '开始测试' }).click()
  await expect(progress(page)).toHaveText('context 1/10')
}

async function answerQuiz(page: Page, answers = 'AAAAAAAAAA') {
  for (let index = 0; index < answers.length; index += 1) {
    await expect(progress(page)).toHaveText(`context ${index + 1}/10`)
    await option(page, answers[index]).click()
  }
}

async function checkWidth(page: Page) {
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  )).toBe(true)
}

const sizes = [
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
]
for (const viewport of sizes) {
  test(`completes the quiz at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await start(page)
    await checkWidth(page)
    const columns = await page.locator('.options').evaluate((element) => getComputedStyle(element).gridTemplateColumns)
    expect(columns === 'none').toBe(viewport.width < 768)
    await answerQuiz(page)
    const result = page.getByRole('heading', { name: '情绪甜心' })
    await expect(result).toBeFocused()
    await expect(result).toHaveCSS('font-family', /PingFang SC/)
    const model = page.locator('.model-name')
    await expect(model).toHaveCSS('font-family', /PingFang SC/)
    await expect(model).toHaveCSS('font-size', viewport.width < 768 ? '63px' : '84px')
    await expect(page.locator('.identity')).toHaveText(/^情绪甜心\s*豆包$/)
    await expect(page.locator('.result-info .description')).toHaveCSS('font-family', /PingFang SC/)
    await expect(page.locator('.dimension .pole-neg b').first()).toHaveCSS('font-family', /Cascadia Mono/)
    await expect(page.getByRole('img', { name: '豆包 角色插画' })).toBeVisible()
    await expect(page.locator('.dimension .pole-neg')).toHaveText(['H 人文表达', 'Q 即时直觉', 'U 破界无忌', 'A 顺应配合'])
    await expect(page.locator('.dimension .pole-pos')).toHaveText(['L 逻辑工程', 'D 深度思考', 'R 准则自持', 'S 犀利自主'])
    await expect(page.locator('.is-neg .pole-neg b').first()).toHaveCSS('color', 'rgb(171, 53, 40)')
    await expect(page.locator('.is-neg .pole-pos b').first()).toHaveCSS('color', 'rgb(59, 77, 120)')
    await expect(skip(page)).toHaveCount(0)
    await checkWidth(page)
    const savePoster = page.getByRole('button', { name: '保存图片' })
    const retest = page.getByRole('button', { name: '再测一次' })
    await expect(retest).toHaveCSS('color', 'rgb(255, 255, 255)')
    for (const button of [savePoster, retest]) {
      await expect(button).toHaveCSS('height', '52px')
    }
    const [saveBox, retestBox, textBox] = await Promise.all([
      savePoster.boundingBox(), retest.boundingBox(), page.locator('.result-info .description').boundingBox(),
    ])
    expect(saveBox!.width).toBeCloseTo(retestBox!.width, 1)
    expect(saveBox!.y).toBeCloseTo(retestBox!.y, 1)
    expect(saveBox!.x).toBeCloseTo(textBox!.x, 1)
    expect(retestBox!.x + retestBox!.width).toBeCloseTo(textBox!.x + textBox!.width, 1)
    await retest.click()
    await expect(page.getByRole('button', { name: '开始测试' })).toBeFocused()
    await page.getByRole('button', { name: '开始测试' }).click()
    await expect(option(page)).toHaveAttribute('aria-pressed', 'false')
  })
}

test('keeps wrapped mobile option text beside the letter column', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await start(page)
  await answerQuiz(page, 'A')
  await expect(progress(page)).toHaveText('context 2/10')

  const smallestGap = await page.locator('.option').evaluateAll((buttons) => {
    const gaps: number[] = []
    const range = document.createRange()
    for (const button of buttons) {
      const letterEdge = button.querySelector('.option-key')!.getBoundingClientRect().right
      const text = button.querySelector('.option-text')!
      const nodes = document.createTreeWalker(text, NodeFilter.SHOW_TEXT)
      for (let node = nodes.nextNode(); node; node = nodes.nextNode()) {
        if (node.parentElement?.closest('.sr-only')) continue
        range.selectNodeContents(node)
        for (const rect of range.getClientRects()) {
          if (rect.width > 0) gaps.push(rect.left - letterEdge)
        }
      }
    }
    return Math.min(...gaps)
  })
  expect(smallestGap).toBeGreaterThanOrEqual(10)
})

test('keeps desktop hover highlights flush with the grid dividers', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await start(page)
  await answerQuiz(page, 'AAA')
  await expect(progress(page)).toHaveText('context 4/10')

  const grid = page.locator('.options')
  const misalignment = await grid.evaluate((element) => {
    // Measure at the start of the entrance animation as well as on a question
    // where the two rows contain different amounts of text.
    for (const animation of element.getAnimations({ subtree: true })) {
      if (animation instanceof CSSAnimation && animation.animationName === 'rise') {
        animation.pause()
        animation.currentTime = 0
      }
    }
    const [a, b, c, d] = [...element.querySelectorAll('button')].map((button) => button.getBoundingClientRect())
    const marker = element.querySelector('.options-center')!.getBoundingClientRect()
    const x = marker.left + marker.width / 2
    const y = marker.top + marker.height / 2
    return Math.max(
      ...[a.right, b.left, c.right, d.left].map((edge) => Math.abs(edge - x)),
      ...[a.bottom, b.bottom, c.top, d.top].map((edge) => Math.abs(edge - y)),
    )
  })
  expect(misalignment).toBeLessThan(1)
  await option(page, 'B').hover()
  await expect(option(page, 'B').locator('.quiz-outline')).toHaveCSS('fill', 'none')
  await expect.poll(() => option(page, 'B').evaluate(
    (button) => getComputedStyle(button, '::before').opacity,
  )).toBe('1')
})

test('retains a choice on back and resize, handles a double click, and resets on reload', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1280, height: 720 })
  await start(page)
  await option(page, 'B').dblclick()
  await expect(progress(page)).toHaveText('context 2/10')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(progress(page)).toHaveText('context 2/10')
  await checkWidth(page)
  await page.goBack()
  await expect(progress(page)).toHaveText('context 1/10')
  await expect(option(page, 'B')).toHaveAttribute('aria-pressed', 'true')
  const savedOutline = option(page, 'B').locator('.quiz-outline')
  await expect(savedOutline.locator('path')).toHaveCSS('fill', 'rgb(171, 53, 40)')
  await expect(savedOutline).toHaveCSS('stroke', 'rgb(171, 53, 40)')
  await expect(page.locator('.question-number .quiz-outline')).toHaveCSS('fill', 'none')
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(option(page, 'B')).toHaveAttribute('aria-pressed', 'true')
  await checkWidth(page)
  await page.getByRole('button', { name: '回到首页' }).click()
  await expect(page.getByRole('button', { name: '开始测试' })).toBeVisible()
  const event = await page.locator('.intro-event').boundingBox()
  const startButton = await page.locator('.dive').boundingBox()
  expect(event!.y + event!.height).toBeLessThan(startButton!.y)
  expect(startButton!.y + startButton!.height).toBeLessThanOrEqual(390)
  await page.getByRole('button', { name: '开始测试' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: '开始测试' })).toBeVisible()
})

test('lets the browser leave the home screen after reloading a quiz', async ({ page }) => {
  const previous = 'data:text/html,<title>Previous page</title>'
  await page.goto(previous)
  await start(page)
  await page.reload()
  await expect(page.getByRole('button', { name: '开始测试' })).toBeVisible()
  await page.evaluate(() => history.back())
  await expect(page).toHaveURL(previous)
})

test('supports keyboard-only answering and escape from the reveal', async ({ page }) => {
  await page.goto('./')
  const startButton = page.getByRole('button', { name: '开始测试' })
  await expect(startButton).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(startButton).toBeFocused()
  await page.keyboard.press('Enter')
  for (let index = 0; index < 10; index += 1) {
    await expect(progress(page)).toHaveText(`context ${index + 1}/10`)
    await expect(page.getByRole('heading', { level: 2 })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(option(page)).toBeFocused()
    await page.keyboard.press(index % 2 ? 'Enter' : 'Space')
  }
  await expect(skip(page)).toBeFocused()
  await expect(skip(page)).toHaveCSS('opacity', '1')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('heading', { name: '情绪甜心' })).toBeFocused()
  await expect(page.locator('.art-peek')).toHaveCSS('clip-path', 'none')
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden')
})

test('downloads the visible home background and defers character art until the result', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'image') requests.push(new URL(request.url()).pathname.split('/').pop()!)
  })
  await page.goto('./')
  await page.waitForLoadState('networkidle')
  expect(requests.slice().sort()).toEqual([
    expect.stringMatching(/^event-activity-/),
    expect.stringMatching(/^event-brand-/),
    expect.stringMatching(/^logo-white-/),
    expect.stringMatching(/^night-portrait-/),
  ])
  await page.getByRole('button', { name: '开始测试' }).click()
  await answerQuiz(page)
  await expect(page.getByRole('img', { name: '豆包 角色插画' })).toBeVisible()
  expect(requests.filter((path) => /^(gpt|claude|deepseek|glm|grok|kimi|gemini|doubao)-/.test(path))).toEqual([
    expect.stringMatching(/^doubao-/),
  ])
})

test('opens the share poster before retest and downloads the generated JPEG', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    const fillText = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.fillText = function (
      this: CanvasRenderingContext2D, ...args: Parameters<CanvasRenderingContext2D['fillText']>
    ) {
      if (this.canvas.width === 1080 && this.textBaseline === 'top') {
        const { dataset } = document.documentElement
        dataset.posterDescription = (dataset.posterDescription ?? '') + args[0]
        dataset.posterBodyPositions = [dataset.posterBodyPositions, args[1]].filter(Boolean).join(',')
      }
      if (this.canvas.width === 1080 && /^[A-Z]( [A-Z]){3}$/.test(args[0])) {
        document.documentElement.dataset.posterCode = args[0].replaceAll(' ', '')
      }
      fillText.apply(this, args)
    }
  })
  const posterAssets: string[] = []
  page.on('request', (request) => {
    if (/\/assets\/poster-[^/]+\.(webp|png)$/.test(new URL(request.url()).pathname)) {
      posterAssets.push(new URL(request.url()).pathname)
    }
  })
  await start(page)
  await answerQuiz(page)

  const description = await page.locator('.result .description').innerText()
  expect(description.trim()).not.toBe('')
  await expect(page.locator('.result-actions button')).toHaveText(['保存图片', '再测一次'])
  expect(posterAssets).toHaveLength(0)
  const trigger = page.getByRole('button', { name: '保存图片' })
  await expect(trigger).toHaveCSS('color', 'rgb(255, 255, 255)')
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: '保存图片' })
  const poster = dialog.getByRole('img', { name: '情绪甜心 · 豆包 宣传图' })
  await expect(poster).toBeVisible()
  await expect.poll(() => poster.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(1080)
  const drawnDescription = await page.locator('html').getAttribute('data-poster-description')
  expect(drawnDescription?.replace(/\s/gu, '')).toBe(description.replace(/\s/gu, ''))
  await expect(page.locator('html')).toHaveAttribute('data-poster-code', 'HQUA')
  const positions = await page.locator('html').getAttribute('data-poster-body-positions')
  const [firstLine, nextLine] = (positions ?? '').split(',').map(Number)
  expect(firstLine - nextLine).toBe(68)
  expect(posterAssets.some((asset) => /poster-qr-[^/]+\.png$/.test(asset))).toBe(true)
  expect(posterAssets.filter((asset) => /poster-(gpt|deepseek|glm|grok|kimi|claude|gemini|doubao)-/.test(asset)))
    .toEqual([expect.stringMatching(/poster-doubao-/)])
  const pendingDownload = page.waitForEvent('download')
  await dialog.getByRole('link', { name: '保存图片' }).click()
  const download = await pendingDownload
  expect(download.suggestedFilename()).toBe('AITI-HQUA.jpg')
  expect(await download.failure()).toBeNull()

  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await page.getByRole('button', { name: '再测一次' }).click()
  await expect(page.getByRole('button', { name: '开始测试' })).toBeVisible()
})

test('offers a real long-press image on WeChat with the older Safari dialog fallback', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 720 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    const userAgent = `${navigator.userAgent} MicroMessenger`
    Object.defineProperty(navigator, 'userAgent', { value: userAgent })
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { value: undefined })
    Object.defineProperty(Array.prototype, 'at', { value: undefined })
  })
  await start(page)
  await answerQuiz(page)
  const trigger = page.getByRole('button', { name: '保存图片' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: '保存图片' })
  await expect(dialog.getByText('长按图片保存到相册')).toBeVisible()
  await expect(dialog.getByRole('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/)
  await checkWidth(page)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('retries share-card asset failures inside the save dialog', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/assets/poster-background-*.webp', (route) => route.abort(), { times: 1 })
  await start(page)
  await answerQuiz(page)
  await page.getByRole('button', { name: '保存图片' }).click()
  const dialog = page.getByRole('dialog', { name: '保存图片' })
  await expect(dialog.getByRole('alert')).toHaveText('宣传图生成失败。')
  await dialog.getByRole('button', { name: '重试' }).click()
  await expect(dialog.getByRole('img')).toBeVisible()
})

test('plays the full reveal and preserves the character position', async ({ page }) => {
  await start(page)
  await answerQuiz(page, 'BBBBBBBBBB')
  await expect(skip(page)).toBeVisible()
  const art = page.locator('.art-wrap')
  const before = await art.boundingBox()
  await expect(page.getByRole('heading', { name: '硬核工程师' })).toBeFocused({ timeout: 10_000 })
  const after = await art.boundingBox()
  expect(after).toEqual(before)
  await expect(art).toHaveCSS('z-index', '1')
  await expect(art.locator('.art-scale')).toHaveCSS('mix-blend-mode', 'normal')
  const portrait = page.getByRole('img', { name: 'GPT 角色插画' })
  const cornerAlpha = await portrait.evaluate(async (element: HTMLImageElement) => {
    await element.decode()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d')!
    context.drawImage(element, 0, 0, 1, 1, 0, 0, 1, 1)
    return context.getImageData(0, 0, 1, 1).data[3]
  })
  expect(cornerAlpha).toBe(0)
  await expect(page.locator('.art-peek')).toHaveCSS('clip-path', 'none')
  await expect(page.locator('.is-pos .pole-pos b').first()).toHaveCSS('color', 'rgb(171, 53, 40)')
  await expect(page.locator('.is-pos .pole-neg b').first()).toHaveCSS('color', 'rgb(59, 77, 120)')
})

test('pauses for a slow image and skips on a layout change', async ({ page }) => {
  let release!: () => void
  const hold = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/assets/doubao-*.webp', async (route) => {
    await hold
    await route.continue()
  })
  await start(page)
  await answerQuiz(page)
  await expect(skip(page)).toBeVisible()
  await expect.poll(() => page.locator('.reveal-noise').evaluate(
    (element) => element.getAnimations().some((animation) => animation.playState === 'paused'),
  )).toBe(true)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('heading', { name: '情绪甜心' })).toBeFocused()
  await expect(page.getByRole('status')).toHaveText('正在加载角色图…')
  release()
  await expect(page.getByRole('img', { name: '豆包 角色插画' })).toBeVisible()
})

test('offers a working retry after an image error', async ({ page }) => {
  await page.route('**/assets/doubao-*.webp', (route) => route.abort(), { times: 1 })
  await start(page)
  await answerQuiz(page)
  await expect(page.getByRole('heading', { name: '情绪甜心' })).toBeFocused()
  await expect(page.getByRole('status')).toHaveText('角色图没有加载出来')
  await page.getByRole('button', { name: '重试' }).click()
  await expect(page.getByRole('img', { name: '豆包 角色插画' })).toBeVisible()
})

for (const hasTouch of [false, true]) {
  test.describe(hasTouch ? 'touch input' : 'mouse input', () => {
    const viewport = hasTouch ? { width: 390, height: 844 } : { width: 1280, height: 800 }
    test.use({ hasTouch, isMobile: hasTouch, viewport })

    test('keeps the reveal playing after pointer input', async ({ page }) => {
      let release!: () => void
      const hold = new Promise<void>((resolve) => { release = resolve })
      await page.route('**/assets/doubao-*.webp', async (route) => {
        await hold
        await route.continue()
      })
      const press = (x: number, y: number) => hasTouch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y)
      await start(page)
      await answerQuiz(page)
      const noise = page.locator('.reveal-noise')
      const playback = () => noise.evaluate((element) => element.getAnimations()[0]?.playState)
      try {
        await expect.poll(playback).toBe('paused')
        await press(viewport.width / 2, viewport.height / 2)
        await press(viewport.width - 44, 38)
        await expect.poll(playback).toBe('paused')
      } finally {
        release()
      }
      await expect.poll(playback).toBe('running')
      await press(viewport.width / 2, viewport.height / 2)
      await expect.poll(playback).toBe('running')
      await expect(page.getByRole('heading', { name: '情绪甜心' })).toBeFocused({ timeout: 10_000 })
      await expect(page.getByRole('img', { name: '豆包 角色插画' })).toBeVisible()
    })
  })
}

test('ends a reveal when image loading times out', async ({ page }) => {
  let endRequest!: () => void
  const hold = new Promise<void>((resolve) => { endRequest = resolve })
  await page.route('**/assets/doubao-*.webp', async (route) => {
    await hold
    await route.abort()
  })
  await start(page)
  await answerQuiz(page)
  await expect(skip(page)).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('角色图没有加载出来', { timeout: 9000 })
  await expect(page.getByRole('button', { name: '重试' })).toBeEnabled()
  endRequest()
})
