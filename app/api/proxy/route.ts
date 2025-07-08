// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const BACK_API_URL = process.env.BACK_API_URL;
  const BACK_API_KEY = process.env.BACK_API_KEY;

  if (!BACK_API_URL || !BACK_API_KEY) {
    return new NextResponse('Variáveis de ambiente não definidas.', { status: 500 });
  }

  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return new NextResponse('Parâmetro "path" em falta.', { status: 400 });
  }

  try {
    const res = await fetch(`${BACK_API_URL}${path}`, {
      headers: {
        'x-api-key': BACK_API_KEY,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[Proxy Error]', err);
    return new NextResponse('Erro ao chamar o backend.', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) return new Response('Missing path', { status: 400 })

  const body = await request.text()

  const res = await fetch(`${process.env.BACK_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.BACK_API_KEY!,
    },
    body,
  })

  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
    },
  })
}

// 🔧 NOVO HANDLER PUT
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) return new Response('Missing path', { status: 400 })

  const body = await request.text()

  const res = await fetch(`${process.env.BACK_API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.BACK_API_KEY!,
    },
    body,
  })

  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
    },
  })
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (!path) {
    return new Response('Missing path parameter', { status: 400 })
  }

  try {
    const res = await fetch(`${process.env.BACK_API_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': process.env.BACK_API_KEY || ''
      }
    })

    const data = await res.text()
    return new Response(data, { status: res.status })
  } catch (error) {
    console.error('Proxy DELETE error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}