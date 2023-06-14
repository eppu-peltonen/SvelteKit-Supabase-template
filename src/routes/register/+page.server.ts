import type { Actions, PageServerLoad } from "./$types";
import bcrypt from "bcrypt";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate, setError } from "sveltekit-superforms/server";

const schema = z.object({
	email: z.string().email().nonempty(),
	username: z.string().nonempty(),
	password: z.string().nonempty()
});

const saltRounds = 10;

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};

export const actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("*")
			.eq("username", form.data.username)
			.single();

		if (profile) {
			return fail(400, { message: "Username already exists", form });
		}

		const passwordHash = await hashPassword(form.data.password);

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: passwordHash,
			options: {
				data: {
					username: form.data.username,
					password: passwordHash,
					email: form.data.username
				}
			}
		});

		if (error) {
			return fail(400, { form });
		}

		return { form };
	}
} satisfies Actions;

const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};
