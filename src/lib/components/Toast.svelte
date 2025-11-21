<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { removeToast } from '$lib/stores/toast';

	export let id: string;
	export let message: string;
	export let type: 'success' | 'error' | 'info' = 'success';

	const typeStyles = {
		success: 'bg-dark-800 border-primary-500 text-gray-100',
		error: 'bg-dark-800 border-red-500 text-gray-100',
		info: 'bg-dark-800 border-accent-500 text-gray-100'
	};

	const iconMap = {
		success: 'mdi:check-circle',
		error: 'mdi:alert-circle',
		info: 'mdi:information'
	};

	const iconColors = {
		success: 'text-primary-500',
		error: 'text-red-500',
		info: 'text-accent-500'
	};

	function handleClose() {
		removeToast(id);
	}
</script>

<div
	class="flex max-w-sm items-center rounded-lg border-2 p-4 shadow-xl backdrop-blur-sm {typeStyles[
		type
	]}"
	in:fly={{ x: 300, duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<Icon icon={iconMap[type]} class="mr-3 h-5 w-5 {iconColors[type]}" />
	<span class="flex-1 text-sm font-medium">{message}</span>
	<button
		class="ml-3 rounded-full p-1 transition-colors hover:bg-dark-700 hover:bg-opacity-60"
		on:click={handleClose}
		aria-label="Close notification"
	>
		<Icon icon="mdi:close" class="h-4 w-4 text-gray-400 hover:text-gray-200" />
	</button>
</div>
