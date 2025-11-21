<script lang="ts">
	import { browser } from '$app/environment';
	import { fade, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { getPositionColor, formatPlayerNameDisplay } from '$lib/helpers';
	import type { DraftedPlayer } from '$lib/types';

	export let isVisible: boolean = false;
	export let draftedPlayer: DraftedPlayer | null = null;
	export let onComplete: () => void = () => {};

	let showEmojis = false;
	let showCard = false;

	// Store timeout IDs for cleanup
	let emojiTimeout: NodeJS.Timeout | null = null;
	let cardTimeout: NodeJS.Timeout | null = null;
	let completeTimeout: NodeJS.Timeout | null = null;

	// Clear any existing timeouts
	function clearTimeouts() {
		if (emojiTimeout) {
			clearTimeout(emojiTimeout);
			emojiTimeout = null;
		}
		if (cardTimeout) {
			clearTimeout(cardTimeout);
			cardTimeout = null;
		}
		if (completeTimeout) {
			clearTimeout(completeTimeout);
			completeTimeout = null;
		}
	}

	// Auto-hide after duration
	$: if (isVisible && draftedPlayer) {
		// Clear any existing timeouts first
		clearTimeouts();

		showCard = true;
		showEmojis = true;

		// Hide emojis after 4 seconds
		emojiTimeout = setTimeout(() => {
			showEmojis = false;
		}, 4000);

		// Hide card after 4 seconds
		cardTimeout = setTimeout(() => {
			showCard = false;
			completeTimeout = setTimeout(() => {
				onComplete();
			}, 300); // Wait for exit animation
		}, 4000);
	}

	// Check for reduced motion preference
	let prefersReducedMotion = false;

	if (browser) {
		prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
	}

	// Generate celebration emojis positioned at top corners of the card
	function generateCelebrationEmojis() {
		if (prefersReducedMotion) return [];

		// Only use the party popper and confetti ball emojis
		const emojis = [
			{ emoji: '🎉', position: 'top-left' }, // Party popper (cone with confetti)
			{ emoji: '🥳', position: 'top-right' }
		];

		// Define positions at the top corners of the card
		const basePositions = [
			{ left: 25, top: 20 }, // Top-left
			{ left: 69, top: 20 } // Top-right
		];

		return emojis.map((emojiData, i) => ({
			id: i,
			emoji: emojiData.emoji,
			left: basePositions[i].left,
			top: basePositions[i].top,
			delay: i * 200, // Staggered delay (0ms, 200ms)
			duration: 2500, // Fixed 2.5 second animation
			size: 5 // Fixed size
		}));
	}

	// Generate emojis whenever a new player is drafted
	$: celebrationEmojis = draftedPlayer ? generateCelebrationEmojis() : [];

	// Clean up timeouts when component is destroyed
	onDestroy(() => {
		clearTimeouts();
	});
</script>

{#if isVisible && showCard && draftedPlayer}
	{@const nameDisplay = formatPlayerNameDisplay(
		draftedPlayer.name,
		draftedPlayer.position
	)}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
		transition:fade={{ duration: 300 }}
	>
		<!-- Celebration Emojis - positioned at top corners of the card -->
		{#if showEmojis && !prefersReducedMotion}
			{#each celebrationEmojis as emojiData (emojiData.id)}
				<div
					class="celebration-emoji animate-bounce-random pointer-events-none absolute z-20 select-none"
					style="
						left: {emojiData.left}%;
						top: {emojiData.top}%;
						font-size: {emojiData.size}rem;
						animation-delay: {emojiData.delay}ms;
						animation-duration: {emojiData.duration}ms;
					"
				>
					{emojiData.emoji}
				</div>
			{/each}
		{/if}

		<!-- Celebration Card -->
		<div
			class="celebration-card relative z-10 mx-4 w-full max-w-lg"
			transition:scale={{
				duration: 600,
				easing: elasticOut,
				start: 0.3
			}}
		>
			<!-- Animated border glow -->
			<div
				class="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 opacity-75 blur"
			></div>

			<!-- Card content -->
			<div class="relative rounded-2xl bg-dark-900 p-8 shadow-2xl">
				<!-- Success icon with pulse animation -->
				<div class="mb-6 flex justify-center">
					<div class="animate-bounce rounded-full bg-primary-500 p-4">
						<Icon icon="mdi:check-bold" class="h-12 w-12 text-white" />
					</div>
				</div>

				<!-- Drafted! Header -->
				<div class="mb-6 text-center">
					<h2 class="text-gradient-green mb-2 font-fun text-3xl font-bold">
						DRAFTED!
					</h2>
					<p class="text-lg text-gray-300">
						Round {draftedPlayer.round}, Pick {draftedPlayer.pick}
					</p>
				</div>

				<!-- Player Info -->
				<div class="mb-6 text-center">
					<!-- Player name -->
					<div class="mb-2">
						{#if nameDisplay.firstName}
							<div class="text-xl font-medium text-gray-200">
								{nameDisplay.firstName}
							</div>
						{/if}
						<div class="text-5xl font-bold uppercase tracking-wider text-white">
							{nameDisplay.lastName}
						</div>
					</div>

					<div class="mb-4 flex items-center justify-center gap-4">
						<!-- Position badge -->
						<span
							class="rounded-full border px-4 py-2 text-lg font-bold {getPositionColor(
								draftedPlayer.position
							)}"
						>
							{draftedPlayer.position}
						</span>
						<!-- Team -->
						<div class="text-xl font-semibold text-gray-300">
							{draftedPlayer.team}
						</div>
						<!-- Bye week if available -->
						{#if draftedPlayer.byeWeek}
							<div class="text-xl font-medium text-gray-400">
								(BYE: {draftedPlayer.byeWeek})
							</div>
						{/if}
					</div>
				</div>

				<!-- Drafted by info -->
				<div
					class="rounded-lg border border-dark-600 bg-dark-800 p-4 text-center"
				>
					<p class="text-sm font-medium uppercase tracking-wide text-gray-400">
						Drafted by
					</p>
					<p class="text-2xl font-bold text-primary-400">
						{draftedPlayer.draftedBy}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.celebration-emoji {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
	}

	@keyframes bounce-random {
		0%,
		100% {
			transform: translateY(0) scale(1) rotate(0deg);
		}
		25% {
			transform: translateY(-25px) scale(1.15) rotate(10deg);
		}
		50% {
			transform: translateY(-15px) scale(0.9) rotate(-5deg);
		}
		75% {
			transform: translateY(-20px) scale(1.1) rotate(5deg);
		}
	}

	.animate-bounce-random {
		animation: bounce-random ease-in-out infinite;
	}

	.celebration-card {
		animation: card-entrance 0.6s ease-out;
	}

	@keyframes card-entrance {
		0% {
			transform: scale(0.3) rotate(-10deg);
			opacity: 0;
		}
		50% {
			transform: scale(1.1) rotate(5deg);
			opacity: 0.8;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.text-gradient-green {
		background: linear-gradient(135deg, #10b981, #34d399, #6ee7b7);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
</style>
