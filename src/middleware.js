import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';

export function middleware(req) {
  const token = getCookie('accesstoken', { req });
  const { pathname } = req.nextUrl

  const protectedRoutes = ['/', '/repair', '/search']
  const VprotectedRoutes = ['/repair', '/search', '/transactions', '/wallet']
  const loginRoute = ['/login','/home', '/signup', '/register']

  // Check if the route is protected and user is not authenticated
  if ((protectedRoutes.includes(pathname) || VprotectedRoutes.some(route => pathname.startsWith(route))) && !token) {

    return NextResponse.redirect(new URL('/home', req.url))
  }
  else if ((loginRoute.includes(pathname) && token)){
    return NextResponse.redirect(new URL('/', req.url))
  }
   else {
    // Handle the case when the route is not protected or the user is authenticated
    return NextResponse.next()
  }
}