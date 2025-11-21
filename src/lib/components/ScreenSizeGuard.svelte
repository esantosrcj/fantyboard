<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import MobileWarning from './MobileWarning.svelte';
	import { isMobilePhone, isTablet } from '$lib/utils/device';

	let screenWidth = 0;
	let showMobileWarning = false;

	// Minimum width for draft board - more permissive for tablets
	const MIN_WIDTH = 768;

	onMount(() => {
		if (browser) {
			updateScreenSize();

			window.addEventListener('resize', updateScreenSize);
			window.addEventListener('orientationchange', handleOrientationChange);

			return () => {
				window.removeEventListener('resize', updateScreenSize);
				window.removeEventListener(
					'orientationchange',
					handleOrientationChange
				);
			};
		}
	});

	function updateScreenSize() {
		screenWidth = window.innerWidth;

		// Only show warning for actual mobile phones, not tablets
		showMobileWarning = isMobilePhone();

		// For tablets in portrait mode, show a helpful message but don't block
		if (isTablet() && screenWidth < MIN_WIDTH && !isMobilePhone()) {
			// Could add a subtle suggestion to rotate to landscape
			showMobileWarning = false;
		}
	}

	function handleOrientationChange() {
		// Small delay to allow orientation change to complete
		setTimeout(updateScreenSize, 100);
	}
</script>

{#if showMobileWarning}
	<MobileWarning />
{:else}
	<slot />
{/if}
