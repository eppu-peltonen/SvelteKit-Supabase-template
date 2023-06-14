<script lang="ts">
	import { enhance } from "$app/forms";
	import { Loading } from "carbon-components-svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { messagesStore } from "svelte-legos";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";

	export let data: PageData;

	const { form, errors, constraints } = superForm(data.form);

	let loading = false;
	const message = "Check your email for signup confirmation link.";

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					messagesStore(message, "success");
					loading = false;
					break;
				case "failure":
					if (result.data?.message) {
						messagesStore(result.data?.message, "error");
					}
					loading = false;
					break;
				default:
					break;
			}
			await update();
		};
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

	.invalid {
		color: red;
	}
</style>

{#if loading}
	<Loading />
{/if}

<h1>Sign up</h1>

<div class="signup-container">
	<div class="form-container">
		<form action="?/signup" method="POST" use:enhance={handleSubmit}>
			<label class="bx--label" for="email">E-mail</label>
			<input
				class="bx--text-input"
				id="email"
				name="email"
				type="email"
				aria-invalid={$errors.email ? "true" : undefined}
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
			<label class="bx--label" for="username">Username</label>
			<input
				class="bx--text-input"
				id="username"
				name="username"
				type="text"
				bind:value={$form.username}
				aria-invalid={$errors.username ? "true" : undefined}
				{...$constraints.username}
			/>
			{#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}
			<label class="bx--label" for="password">Password</label>
			<input
				class="bx--text-input"
				id="password"
				name="password"
				type="password"
				bind:value={$form.password}
				aria-invalid={$errors.password ? "true" : undefined}
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
			<button class="bx--btn--primary signup" type="submit">Sign up</button>
		</form>
	</div>
	<div class="login">
		<a href="/login">
			<p>Back to login.</p>
		</a>
	</div>
</div>
