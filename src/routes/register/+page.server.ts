import type { Actions } from "./$types";
import bcrypt from "bcrypt";
import { fail } from "@sveltejs/kit";

const saltRounds = 10;

export const actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;
		const passwordHash = await hashPassword(password);

		const { error } = await supabase.auth.signUp({
			email: email,
			password: passwordHash,
			options: {
				data: {
					username: username,
					password: passwordHash,
					email: email
				}
			}
		});

		if (error) {
			return fail(500);
		}

		return { success: true };
	}
} satisfies Actions;

const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};
