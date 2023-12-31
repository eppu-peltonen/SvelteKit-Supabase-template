<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { Loading, FormGroup, Button } from "carbon-components-svelte";
	import { messagesStore } from "svelte-legos";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";

	export let data: PageData;
	let loading = false;

	const { form, errors, constraints } = superForm(data.form);

	$: {
		const redirectTo = $page.url.searchParams.get("redirect");

		if (browser && data.session) {
			goto(redirectTo ?? "/");
		}
	}

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					loading = false;
					break;
				case "failure":
					loading = false;
					handleError(result.data);
					cancel();
				default:
					break;
			}
			await update();
		};
	};

	const handleError = (data: Record<string, any> | undefined) => {
		if (data !== undefined) {
			messagesStore(data.message, "error");
		}
	};
</script>

<style>
	.login-container {
		width: 25%;
		margin-top: 2rem;
	}

	.form-container {
		margin-top: 2rem;
	}

	.sign-up {
		margin-top: 1rem;
	}

	.invalid {
		color: red;
	}
</style>

{#if loading}
	<Loading />
{/if}

<h1>Login</h1>

<div class="login-container">
	<div class="form-container">
		<form action="?/login" use:enhance={handleSubmit} method="POST">
			<FormGroup>
				<label class="bx--label" for="username">Username</label>
				<input
					class="bx--text-input"
					id="username"
					name="username"
					type="text"
					aria-invalid={$errors.username ? "true" : undefined}
					bind:value={$form.username}
					{...$constraints.username}
				/>
				{#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}
				<label class="bx--label" for="password">Password</label>
				<input
					class="bx--text-input"
					id="password"
					name="password"
					type="password"
					aria-invalid={$errors.password ? "true" : undefined}
					bind:value={$form.password}
					{...$constraints.password}
				/>
				{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
			</FormGroup>
			<Button type="submit">Login</Button>
		</form>
	</div>
	<div class="sign-up">
		<p>
			Not registered?
			<a href="/register">
				<span>Sign up.</span>
			</a>
		</p>
	</div>
</div>
