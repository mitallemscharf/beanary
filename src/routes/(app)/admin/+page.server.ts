import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Route protection is already enforced in hooks.server.ts
	// This just passes the current admin user down to the page
	return { adminUser: locals.user };
};
