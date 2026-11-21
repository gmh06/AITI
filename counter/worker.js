const eventId = /^[0-9a-f]{32}$/
const headers = { 'Cache-Control': 'no-store' }

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/participation') {
      return new Response(null, { status: 404 })
    }

    if (request.method === 'GET') {
      const readHeaders = { ...headers, 'Access-Control-Allow-Origin': '*' }
      try {
        const row = await env.DB.prepare('SELECT total FROM participation_total WHERE id = 1').first()
        if (!row) throw new Error('Participation total is missing')
        return Response.json({ total: row.total }, { headers: readHeaders })
      } catch {
        return new Response(null, { status: 503, headers: readHeaders })
      }
    }

    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET, POST' } })
    }
    if (request.headers.get('Origin') !== env.SITE_ORIGIN) {
      return new Response(null, { status: 403, headers })
    }

    const writeHeaders = { ...headers, 'Access-Control-Allow-Origin': env.SITE_ORIGIN, Vary: 'Origin' }
    const contentType = request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()
    if (contentType !== 'text/plain' || Number(request.headers.get('Content-Length')) > 32) {
      return new Response(null, { status: 400, headers: writeHeaders })
    }

    try {
      const id = await request.text()
      if (id.length !== 32 || !eventId.test(id)) {
        return new Response(null, { status: 400, headers: writeHeaders })
      }
      await env.DB.prepare('INSERT INTO participation_events (id) VALUES (?) ON CONFLICT (id) DO NOTHING')
        .bind(id)
        .run()
      return new Response(null, { status: 204, headers: writeHeaders })
    } catch {
      return new Response(null, { status: 503, headers: writeHeaders })
    }
  },
}
