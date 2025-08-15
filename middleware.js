import { NextResponse } from 'next/server';

export const config = {
  matcher: '/(.*)', // 匹配所有路径
};

export default function middleware(req) {
  const url = req.nextUrl.clone();
  const cookie = req.headers.get('cookie') || '';
  const correctPassword = process.env.SITE_PASSWORD;

  // 检查请求中的 cookie 是否包含正确的密码
  if (!cookie.includes(`site_password=${correctPassword}`)) {
    // 如果没有密码或密码错误，重定向到登录页面
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 如果密码正确，继续请求
  return NextResponse.next();
}
