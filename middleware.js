// middleware.js
import { NextResponse } from 'next/server';

const CORRECT_PASSWORD = '98591013'; // 设置正确的密码

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.headers.get('cookie') || '';

  // 如果是登录页面或静态资源，允许访问
  if (pathname === '/login' || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // 检查 cookie 中是否包含正确的密码
  if (!cookies.includes(`site_password=${CORRECT_PASSWORD}`)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // 对所有路径应用中间件
};
