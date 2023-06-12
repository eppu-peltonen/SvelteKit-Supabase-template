import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select(`username, full_name`)
		.eq("id", session.user.id)
		.single();

	return { session, profile };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const fullName = formData.get("fullName") as string;
		const username = formData.get("username") as string;

		const session = await getSession();

		const { error } = await supabase
			.from("profiles")
			.update({
				full_name: fullName,
				username: username
			})
			.eq("id", session?.user.id);

		if (error) {
			console.log(error);
			return fail(500, {
				message: "Failed to update."
			});
		}

		return {
			fullName,
			username
		};
	},
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, "/");
		}
	}
} satisfies Actions;
