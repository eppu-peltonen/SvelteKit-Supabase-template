<script lang="ts">
	import { Row, Column, Tile } from "carbon-components-svelte";
</script>

<style>
	.container {
		width: 100%;
	}

	.tile {
		margin-top: 2rem;
	}
	p {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}
	li {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		margin-left: 1rem;
	}
</style>

<h1>Sveltekit template</h1>

<div class="container">
	<div class="tile">
		<p>Sveltekit + Supabase + Carbon Design System ready to go.</p>
	</div>
	<Row>
		<Column>
			<div class="tile">
				<Tile>
					<h3>Authentication</h3>
					<p>Supabase Auth - email confirmed signup with username and password login.</p>
				</Tile>
			</div>
		</Column>
		<Column>
			<div class="tile">
				<Tile>
					<h3>Authorization</h3>
					<p>Protected routes. Control what resources an authenticated user can access.</p>
				</Tile>
			</div>
		</Column>
	</Row>

	<Row>
		<Column>
			<div class="tile">
				<Tile>
					<h3>Appearance</h3>
					<li>Carbon Components Svelte</li>
					<li>Svelte Legos</li>
				</Tile>
			</div>
		</Column>
	</Row>
</div>
