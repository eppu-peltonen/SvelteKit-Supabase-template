import type { Actions } from "./$types";
import bcrypt from "bcrypt";
import { fail } from "@sveltejs/kit";

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};

export const actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;
		const passwordHash = await hashPassword(password);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: passwordHash,
			options: {
				data: {
					username: username
				}
			}
		});

		if (error) {
			console.error(error);
			return fail(500);
		}
		console.log(data);

		return { success: true, data };
	}
} satisfies Actions;
