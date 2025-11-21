<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '@iconify/svelte';
</script>

<div class="flex min-h-[70vh] items-center justify-center px-4 py-16">
	<div class="text-center">
		<div class="mb-4 text-center">
			{#if $page.status === 404}
				<Icon icon="mdi:map-marker-off" class="mx-auto text-6xl text-red-500" />
			{:else}
				<Icon icon="mdi:alert-circle" class="mx-auto text-6xl text-amber-500" />
			{/if}
		</div>

		<h1 class="mb-4 text-4xl font-bold">{$page.status} Error</h1>

		<p class="mb-8 text-lg text-gray-600">
			{#if $page.status === 404}
				Sorry, we couldn't find the page you're looking for.
			{:else}
				{$page?.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>

		<div class="flex justify-center gap-4">
			<Button href="/" type="primary">Go to Homepage</Button>
		</div>
	</div>
</div>
