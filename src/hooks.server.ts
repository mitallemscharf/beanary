import { verifyToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/seed'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	const user = token ? verifyToken(token) : null;

	event.locals.user = user ?? undefined;

	const pathname = event.url.pathname;
	const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith('/api/auth/'));

	// Protect all non-public routes
	if (!user && !isPublic) {
		throw redirect(302, '/login');
	}

	// If already logged in, don't show login/register pages
	if (user && (pathname === '/login' || pathname === '/register')) {
		throw redirect(302, '/dashboard');
	}

	return resolve(event);
};
