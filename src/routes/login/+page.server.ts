import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	return { url: url.origin };
};

export const actions = {
	login: async () => {
		return {};
	}
} satisfies Actions;
