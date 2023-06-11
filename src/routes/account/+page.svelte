<script lang="ts">
	import { enhance } from "$app/forms";
	import { Loading, TextInput, Button, FormGroup } from "carbon-components-svelte";
	import type { SubmitFunction } from "@sveltejs/kit";

	export let data;
	export let form;

	let { session, profile } = data;

	let loading = false;
	let fullName: string = profile?.full_name ?? "";
	let username: string = profile?.username ?? "";

	const handleLoading: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<style>
	.account-container {
		width: 25%;
		margin-top: 3rem;
	}

	.form-container {
		margin-top: 2rem;
	}
</style>

{#if loading}
	<Loading />
{/if}

<h1>Account details</h1>

<div class="account-container">
	<div class="form-container">
		<form action="?/update" use:enhance={handleLoading} method="POST">
			<FormGroup>
				<TextInput type="text" readonly labelText="Email" value={session.user.email} />
				<label class="bx--label" for="fullName">Full Name</label>
				<input
					class="bx--text-input"
					id="fullName"
					name="fullName"
					type="text"
					value={form?.fullName ?? fullName}
				/>
				<label class="bx--label" for="username">Username</label>
				<input
					class="bx--text-input"
					id="username"
					name="username"
					type="text"
					value={form?.username ?? username}
				/>
			</FormGroup>
			<Button type="submit">Update</Button>
		</form>
	</div>
</div>
