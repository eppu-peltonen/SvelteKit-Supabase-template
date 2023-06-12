import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import bcrypt from "bcrypt";
import { AuthApiError } from "@supabase/supabase-js";

export const load: PageServerLoad = async ({ url }) => {
	return { url: url.origin };
};

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		const { data: user, error } = await supabase
			.from("profiles")
			.select(`username, password, email`)
			.eq("username", username)
			.single();

		if (error) {
			return fail(400, { message: "Invalid credentials." });
		}

		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const { error } = await supabase.auth.signInWithPassword({
				email: user.email,
				password: user.password
			});

			if (error) {
				if (error instanceof AuthApiError && error.status === 400) {
					return fail(400, {
						message: "Invalid credentials."
					});
				}
				return fail(500, { message: "Server error. Please try again later." });
			}

			throw redirect(303, "/");
		} else {
			return fail(400, { message: "Invalid credentials." });
		}
	}
} satisfies Actions;
