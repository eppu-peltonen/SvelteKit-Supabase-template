<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

	import "carbon-components-svelte/css/all.css";

	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		SkipToContent,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		Content,
		Grid,
		Theme,
		Button,
		Loading
	} from "carbon-components-svelte";

	import { ArrowRight, UserAvatarFilledAlt } from "carbon-icons-svelte";

	let isSideNavOpen = false;
	let isLoginOpen = false;
	let loading = false;

	export let data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => data.subscription.unsubscribe();
	});

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<style>
	.container {
		margin-left: 1rem;
		margin-top: 1rem;
	}

	.login-button {
		margin-top: 1rem;
	}

	.logout-button {
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
		padding-left: 0.7rem;
		padding-right: 0.7rem;
	}
</style>

<svelte:head>
	<title>Sveltekit template</title>
</svelte:head>

{#if loading}
	<Loading />
{/if}

<Header
	company="Sveltekit template project"
	href="/"
	bind:isSideNavOpen
	persistentHamburgerMenu={true}
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>

	<Theme
		theme="g80"
		render="toggle"
		toggle={{
			themes: ["white", "g80"],
			labelA: "Dark mode",
			labelB: "Dark mode",
			size: "sm",
			hideLabel: true
		}}
		persist
	/>

	<HeaderUtilities>
		<HeaderAction
			bind:isOpen={isLoginOpen}
			icon={UserAvatarFilledAlt}
			closeIcon={UserAvatarFilledAlt}
		>
			<HeaderPanelLinks>
				{#if session}
					<HeaderPanelDivider>Logged in as</HeaderPanelDivider>
					<div class="container">
						<p><strong>{session.user.email}</strong></p>
						<div class="login-button">
							<Button href="/account" size="small" icon={ArrowRight}>Account</Button>
						</div>
					</div>

					<HeaderPanelDivider>Log out</HeaderPanelDivider>
					<div class="form-widget">
						<form method="post" action="/account/?/signout" use:enhance={handleSignOut}>
							<div class="container">
								<button class="bx--btn--danger logout-button" disabled={loading}>Log out</button>
							</div>
						</form>
					</div>
				{:else}
					<HeaderPanelDivider>Not logged in</HeaderPanelDivider>
					<div class="container">
						<Button href="/login" size="small">Login</Button>
					</div>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink href="/" text="Home" />
		<SideNavMenu text="Tech">
			<SideNavMenuItem href="https://kit.svelte.dev/" target="_blank" text="Sveltekit" />
			<SideNavMenuItem href="https://supabase.com/" target="_blank" text="Supabase" />
			<SideNavMenuItem
				href="https://carbondesignsystem.com/"
				target="_blank"
				text="Carbon Design System"
			/>
			<SideNavMenuItem href="https://sveltelegos.com/" target="_blank" text="Svelte Legos" />
		</SideNavMenu>
	</SideNavItems>
</SideNav>

<Content>
	<Grid>
		<slot />
	</Grid>
</Content>
