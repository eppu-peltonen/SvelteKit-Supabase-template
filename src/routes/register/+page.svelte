<script lang="ts">
	import { enhance } from "$app/forms";
	import { Loading } from "carbon-components-svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { messagesStore } from "svelte-legos";

	let loading = false;
	const message = "Check your email for registration confirmation link.";

	let email: string = "";
	let username: string = "";
	let password: string = "";

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					handleSuccess();
					loading = false;
					break;
				default:
					break;
			}
			await update();
		};
	};

	const handleSuccess = () => {
		messagesStore(message, "success");
	};
</script>

<style>
	.signup-container {
		width: 25%;
		margin-top: 2rem;
	}

	.form-container {
		margin-top: 2rem;
	}

	.signup {
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
		padding-left: 1rem;
		padding-right: 3rem;
	}

	.login {
		margin-top: 1rem;
	}
</style>

{#if loading}
	<Loading />
{/if}

<h1>Sign up</h1>

<div class="signup-container">
	<div class="form-container">
		<form action="?/signup" method="POST" use:enhance={handleSubmit}>
			<label class="bx--label" for="email">Email</label>
			<input class="bx--text-input" id="email" name="email" type="email" value={email} required />
			<label class="bx--label" for="username">Username</label>
			<input
				class="bx--text-input"
				id="username"
				name="username"
				type="text"
				value={username}
				required
			/>
			<label class="bx--label" for="password">Password</label>
			<input
				class="bx--text-input"
				id="password"
				name="password"
				type="password"
				value={password}
				required
			/>
			<button class="bx--btn--primary signup" type="submit">Sign up</button>
		</form>
	</div>
	<div class="login">
		<a href="/login">
			<p>Back to login.</p>
		</a>
	</div>
</div>
