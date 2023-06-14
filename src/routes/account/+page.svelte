<script lang="ts">
	import { enhance } from "$app/forms";
	import { Loading, TextInput, Button, FormGroup } from "carbon-components-svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { messagesStore } from "svelte-legos";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	export let data: PageData;

	const { form } = superForm(data.form);

	let { session } = data;

	let loading = false;
	const successMessage = "Updated!";

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					loading = false;
					showSuccess();
					break;
				case "failure":
					loading = false;
					showError(result.data);
					cancel();
				default:
					break;
			}
			await update({ reset: false });
		};
	};

	const showError = (data: Record<string, any> | undefined) => {
		if (data !== undefined) {
			messagesStore(data.message, "error");
		}
	};

	const showSuccess = () => {
		messagesStore(successMessage, "success");
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
		<form action="?/update" use:enhance={handleSubmit} method="POST">
			<FormGroup>
				<TextInput type="text" readonly labelText="Email" value={session.user.email} />
				<label class="bx--label" for="fullName">Full Name</label>
				<input
					class="bx--text-input"
					id="fullName"
					name="fullName"
					type="text"
					bind:value={$form.fullName}
				/>
				<label class="bx--label" for="username">Username</label>
				<input
					class="bx--text-input"
					id="username"
					name="username"
					type="text"
					bind:value={$form.username}
				/>
			</FormGroup>
			<Button type="submit">Update</Button>
		</form>
	</div>
</div>
