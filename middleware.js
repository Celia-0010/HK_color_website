import { NextResponse } from 'next/server';

export const config = {
  matcher: '/(.*)', // 匹配所有路径
};

const CORRECT_PASSWORD = process.env.SITE_PASSWORD; // 使用环境变量

export default function middleware(req) {
  const url = req.nextUrl.clone();
  const cookie = req.headers.get('cookie') || '';

  // 检查是否访问受保护的页面且没有正确的密码 cookie
  if (
    !cookie.includes(`site_password=${CORRECT_PASSWORD}`)
  ) {
    url.pathname = '/login'; // 重定向到登录页面
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
