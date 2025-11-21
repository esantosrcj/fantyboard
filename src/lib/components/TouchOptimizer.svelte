<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { shouldUseTouchOptimizations } from '$lib/utils/device';

	// Touch optimization settings
	let isTouch = false;
	let hasCoarsePointer = false;

	onMount(() => {
		if (browser) {
			// Detect touch capabilities
			isTouch = shouldUseTouchOptimizations();
			hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

			// Add touch optimization class to body
			if (isTouch) {
				document.body.classList.add('touch-device');
			}

			// Add coarse pointer class for specific styling
			if (hasCoarsePointer) {
				document.body.classList.add('coarse-pointer');
			}

			// Listen for orientation changes on mobile/tablet
			const handleOrientationChange = () => {
				// Force a small delay to allow the viewport to adjust
				setTimeout(() => {
					// Trigger viewport height recalculation
					document.documentElement.style.setProperty(
						'--vh',
						`${window.innerHeight * 0.01}px`
					);
				}, 100);
			};

			// Set initial viewport height
			document.documentElement.style.setProperty(
				'--vh',
				`${window.innerHeight * 0.01}px`
			);

			window.addEventListener('orientationchange', handleOrientationChange);
			window.addEventListener('resize', handleOrientationChange);

			// Prevent default touch behaviors that might interfere
			const preventDefaultTouch = (e: TouchEvent) => {
				// Allow scrolling and pinch-to-zoom but prevent other gestures
				if (e.touches.length > 1) {
					// Allow pinch-to-zoom
					return;
				}

				// Allow normal scrolling
				if (e.target instanceof Element) {
					const scrollableParent = e.target.closest(
						'.touch-scroll, .overflow-y-auto, .overflow-x-auto'
					);
					if (scrollableParent) {
						return;
					}
				}
			};

			// Add touch event listeners
			document.addEventListener('touchstart', preventDefaultTouch, {
				passive: true
			});

			return () => {
				window.removeEventListener(
					'orientationchange',
					handleOrientationChange
				);
				window.removeEventListener('resize', handleOrientationChange);
				document.removeEventListener('touchstart', preventDefaultTouch);

				// Clean up classes
				document.body.classList.remove('touch-device', 'coarse-pointer');
			};
		}
	});
</script>

<!-- This component manages touch optimizations globally -->
<div class="touch-optimizer" style="display: none;"></div>

<style>
	:global(body.touch-device) {
		/* Enhance touch scrolling */
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
	}

	:global(body.coarse-pointer) {
		/* Optimize for coarse pointer devices like touch screens */
		pointer-events: auto;
	}

	:global(.touch-device .hover\:bg-dark-700:hover) {
		background-color: inherit !important;
	}

	:global(.touch-device .hover\:bg-gray-600:hover) {
		background-color: inherit !important;
	}

	:global(.touch-device .hover\:border-primary-500:hover) {
		border-color: inherit !important;
	}

	:global(.touch-device .hover\:text-primary-400:hover) {
		color: inherit !important;
	}

	/* Better scrollbar for touch devices */
	:global(body.touch-device .custom-scrollbar::-webkit-scrollbar) {
		width: 12px;
	}

	:global(body.touch-device .custom-scrollbar::-webkit-scrollbar-thumb) {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 6px;
	}

	/* Improve button active states for touch */
	:global(.touch-device button:active),
	:global(.touch-device .btn:active) {
		transform: scale(0.98);
		opacity: 0.9;
	}

	/* Prevent text selection during touch interactions */
	:global(.touch-device .draft-square-touch) {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	/* Enhanced touch feedback */
	:global(.touch-device .draft-square-touch:active) {
		background-color: rgba(16, 185, 129, 0.3) !important;
		transform: scale(0.98);
	}

	/* Viewport height adjustment for mobile browsers */
	:global(.touch-device .min-h-screen) {
		min-height: calc(var(--vh, 1vh) * 100);
	}
</style>
