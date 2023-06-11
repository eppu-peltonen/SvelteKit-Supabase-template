<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { Loading, FormGroup, TextInput, Button } from "carbon-components-svelte";

	export let data;
	let loading = false;

	$: {
		const redirectTo = $page.url.searchParams.get("redirect");

		// check if user has been set in session store then redirect
		if (browser && data.session) {
			goto(redirectTo ?? "/");
		}
	}

	const handleLoading: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
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
</style>

{#if loading}
	<Loading />
{/if}

<h1>Login</h1>

<div class="login-container">
	<div class="form-container">
		<form action="?/login" use:enhance={handleLoading} method="POST">
			<FormGroup>
				<label class="bx--label" for="username">Username</label>
				<input class="bx--text-input" id="username" name="Username" type="text" value={"asd"} />
				<label class="bx--label" for="Password">Password</label>
				<input class="bx--text-input" id="Password" name="Password" type="text" value={"asd"} />
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
