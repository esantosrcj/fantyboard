<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { isTablet } from '$lib/utils/device';
	import Icon from '@iconify/svelte';

	let showOrientationHint = false;
	let isLandscape = false;

	onMount(() => {
		if (browser && isTablet()) {
			checkOrientation();
			window.addEventListener('orientationchange', handleOrientationChange);
			window.addEventListener('resize', checkOrientation);

			return () => {
				window.removeEventListener(
					'orientationchange',
					handleOrientationChange
				);
				window.removeEventListener('resize', checkOrientation);
			};
		}
	});

	function checkOrientation() {
		if (!browser) return;

		const width = window.innerWidth;
		const height = window.innerHeight;
		isLandscape = width > height;

		// Show hint if tablet is in portrait mode and screen is narrow
		showOrientationHint = isTablet() && !isLandscape && width < 1024;
	}

	function handleOrientationChange() {
		setTimeout(checkOrientation, 100);
	}

	function dismissHint() {
		showOrientationHint = false;
	}
</script>

{#if showOrientationHint}
	<div
		class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-primary-500 bg-dark-800 p-4 shadow-lg"
	>
		<div class="flex items-start gap-3">
			<div class="flex-shrink-0">
				<Icon icon="mdi:screen-rotation" class="h-6 w-6 text-primary-400" />
			</div>
			<div class="flex-grow">
				<h3 class="mb-1 text-sm font-medium text-gray-100">
					Better Experience in Landscape
				</h3>
				<p class="text-xs text-gray-300">
					Rotate your tablet for optimal draft board viewing
				</p>
			</div>
			<button
				on:click={dismissHint}
				class="touch-target flex-shrink-0 text-gray-400 hover:text-gray-200"
				aria-label="Dismiss hint"
			>
				<Icon icon="mdi:close" class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}

<style>
	/* Animation for the hint */
	div {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
