import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const UPSTREAM =
  process.env.AUTH_UPSTREAM_URL?.trim().replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://localhost:5050";

/** Remove Domain= so the browser stores cookies for the current host (e.g. clearup.skin). */
function rewriteSetCookieForAppHost(cookie: string): string {
  return cookie.replace(/;\s*Domain=[^;]*/gi, "");
}

function buildUpstreamUrl(req: NextRequest, pathSegments: string[]): URL {
  const path = pathSegments.join("/");
  const url = new URL(`${UPSTREAM}/api/auth/${path}`);
  url.search = req.nextUrl.search;
  return url;
}

function forwardRequestHeaders(req: NextRequest): Headers {
  const skip = new Set([
    "host",
    "connection",
    "content-length",
    "transfer-encoding",
    "keep-alive",
  ]);
  const out = new Headers();
  req.headers.forEach((value, key) => {
    if (skip.has(key.toLowerCase())) return;
    out.append(key, value);
  });
  const host = req.headers.get("host");
  if (host) out.set("x-forwarded-host", host);
  out.set("x-forwarded-proto", req.nextUrl.protocol.replace(":", ""));
  const xff = req.headers.get("x-forwarded-for");
  if (xff) out.set("x-forwarded-for", xff);
  return out;
}

async function proxyAuth(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path: pathSegments } = await context.params;
  const url = buildUpstreamUrl(req, pathSegments);

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.arrayBuffer();

  const upstream = await fetch(url.toString(), {
    method: req.method,
    headers: forwardRequestHeaders(req),
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  });

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  let setCookieList: string[] = [];
  if (typeof upstream.headers.getSetCookie === "function") {
    setCookieList = upstream.headers.getSetCookie();
  } else {
    const single = upstream.headers.get("set-cookie");
    if (single) setCookieList = [single];
  }

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.headers.append(key, value);
  });

  for (const raw of setCookieList) {
    res.headers.append("Set-Cookie", rewriteSetCookieForAppHost(raw));
  }

  return res;
}

export function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}

export function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}

export function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}

export function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}

export function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}

export function OPTIONS(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxyAuth(req, ctx);
}
