<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getDeviceType } from '$lib/utils/device';

	let deviceType = 'unknown';
	let screenWidth = 0;
	let screenHeight = 0;

	onMount(() => {
		if (browser) {
			updateDeviceInfo();
			window.addEventListener('resize', updateDeviceInfo);
			window.addEventListener('orientationchange', handleOrientationChange);

			return () => {
				window.removeEventListener('resize', updateDeviceInfo);
				window.removeEventListener(
					'orientationchange',
					handleOrientationChange
				);
			};
		}
	});

	function updateDeviceInfo() {
		deviceType = getDeviceType();
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
	}

	function handleOrientationChange() {
		setTimeout(updateDeviceInfo, 100);
	}
</script>

<!-- Only show in development -->
{#if browser && import.meta.env.DEV}
	<div
		class="fixed bottom-4 left-4 z-40 rounded-lg bg-black bg-opacity-75 p-3 text-xs text-white"
	>
		<div class="font-semibold">Device Info</div>
		<div>Type: <span class="text-green-400">{deviceType}</span></div>
		<div>
			Screen: <span class="text-blue-400">{screenWidth}x{screenHeight}</span>
		</div>
		<div class="mt-1 text-gray-300">
			{#if deviceType === 'mobile'}
				📱 Mobile Phone
			{:else if deviceType === 'tablet'}
				📱 Tablet
			{:else}
				💻 Desktop
			{/if}
		</div>
	</div>
{/if}
