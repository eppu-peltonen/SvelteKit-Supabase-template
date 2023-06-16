import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	fullName: z.string(),
	username: z.string()
});

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select(`username, fullName`)
		.eq("id", session.user.id)
		.single();

	const form = await superValidate(profile, schema);

	return { session, profile, form };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await getSession();

		const { error } = await supabase
			.from("profiles")
			.update({
				fullName: form.data.fullName,
				username: form.data.username
			})
			.eq("id", session?.user.id);

		if (error) {
			return fail(500, {
				message: "Failed to update."
			});
		}

		return { form };
	},
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, "/");
		}
	}
} satisfies Actions;
