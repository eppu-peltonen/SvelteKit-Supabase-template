<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { Loading, FormGroup, Button } from "carbon-components-svelte";
	import { WatsonHealthEdgeEnhancement_02 } from "carbon-icons-svelte";

	let loading = false;
	let email: string = "";
	let username: string = "";
	let password: string = "";

	const handleLoading: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
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
		<form action="?/signup" use:enhance={handleLoading} method="POST">
			<FormGroup>
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
			</FormGroup>
			<Button type="submit">Sign up</Button>
		</form>
	</div>
	<div class="login">
		<a href="/login">
			<p>Back to login.</p>
		</a>
	</div>
</div>
