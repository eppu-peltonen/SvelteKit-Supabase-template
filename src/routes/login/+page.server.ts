import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import bcrypt from "bcrypt";
import { AuthApiError } from "@supabase/supabase-js";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	username: z.string(),
	password: z.string()
});

export const load: PageServerLoad = async ({ url }) => {
	const form = await superValidate(schema);
	return { url: url.origin, form };
};

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data: user, error } = await supabase
			.from("profiles")
			.select(`username, password, email`)
			.eq("username", form.data.username)
			.single();

		if (error) {
			return fail(400, { message: "Invalid credentials.", form });
		}

		const match = await bcrypt.compare(form.data.password, user.password);

		if (match) {
			const { error } = await supabase.auth.signInWithPassword({
				email: user.email,
				password: user.password
			});

			if (error) {
				if (error instanceof AuthApiError && error.status === 400) {
					return fail(400, {
						message: "Invalid credentials.",
						form
					});
				}
				return fail(500, { message: "Server error. Please try again later.", form });
			}

			throw redirect(303, "/");
		} else {
			return fail(400, { message: "Invalid credentials.", form });
		}
	}
} satisfies Actions;
