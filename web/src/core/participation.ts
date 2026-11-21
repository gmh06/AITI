const endpoint = import.meta.env.VITE_PARTICIPATION_API_URL?.trim()
const timeoutMs = 4_000

export async function loadParticipationTotal(): Promise<number | undefined> {
  if (!endpoint) return
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(endpoint, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    })
    if (!response.ok) return
    const { total } = await response.json()
    if (Number.isSafeInteger(total) && total >= 0) return total
  } catch {
    return
  } finally {
    window.clearTimeout(timeout)
  }
}

async function sendParticipation(url: string, id: string): Promise<boolean> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: id,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
      signal: controller.signal,
    })
    // Retry a temporary failure using the same event ID.
    return response.status >= 500
  } catch {
    return true
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function recordParticipation() {
  const url = endpoint
  if (!url) return
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
  if (await sendParticipation(url, id)) {
    window.setTimeout(() => void sendParticipation(url, id), 1_000)
  }
}
