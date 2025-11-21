<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';

	export let showBackButton = true;

	function goBack() {
		goto('/');
	}
</script>

<div
	class="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-dark-900 p-4"
>
	<div class="card w-full max-w-md p-6 text-center">
		<!-- Warning Icon -->
		<div class="mb-4">
			<div
				class="glow-energy mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600"
			>
				<Icon icon="mdi:cellphone-off" class="h-8 w-8 text-white" />
			</div>
		</div>

		<!-- Title -->
		<h2 class="mb-3 text-xl font-bold text-gray-100">Screen Too Small</h2>

		<!-- Message -->
		<div class="mb-6 space-y-2 text-gray-300">
			<p>The draft board requires a larger screen for the best experience.</p>
			<p class="text-sm">
				Please use a <strong class="text-secondary-400">tablet</strong>,
				<strong class="text-secondary-400">laptop</strong>, or{' '}
				<strong class="text-secondary-400">desktop computer</strong>.
			</p>
		</div>

		<!-- Actions -->
		{#if showBackButton}
			<Button type="outline-accent" fullWidth on:click={goBack}>
				<Icon icon="mdi:home" class="mr-2 inline h-4 w-4" />
				Go Back to Home
			</Button>
		{/if}
	</div>
</div>
