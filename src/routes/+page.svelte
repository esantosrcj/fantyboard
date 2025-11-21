<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let supportsWebP = false;
	let webpCheckComplete = false;

	onMount(() => {
		if (browser) {
			// Check WebP support
			const webP = new Image();
			webP.onload = webP.onerror = function () {
				supportsWebP = webP.height === 2;
				webpCheckComplete = true;
			};
			webP.src =
				'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
		}
	});
</script>

<svelte:head>
	<title>Home - Fanty</title>
	<meta name="description" content="Fantasy draft board home" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-dark-800 to-dark-900 py-12 md:py-20">
	<div class="tablet-spacing container mx-auto px-4">
		<div class="flex flex-col items-center lg:flex-row">
			<div class="mb-10 lg:mb-0 lg:w-1/2">
				<h1
					class="text-gradient-green animate-el-entrance mb-6 font-fun text-3xl md:text-4xl lg:text-5xl"
				>
					Fantasy. Draft. Board.
				</h1>
				<p class="mb-8 text-lg text-gray-300 md:text-xl">
					A virtual draft board that makes drafting easy and fun. Leave the
					stickers behind — just connect your laptop or tablet to the big screen
					and get started.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button href="/settings" size="lg">Start Draft Setup</Button>
				</div>
			</div>

			<div class="hidden lg:block lg:w-1/2">
				<div class="flex justify-center">
					{#if webpCheckComplete}
						{#if supportsWebP}
							<img
								src="images/hero_image.webp"
								alt="Draft board"
								class="h-80 w-80 rounded-3xl object-cover md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-80 w-80 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]"
							>
								<Icon
									icon="mdi:trophy"
									class="text-8xl text-orange-400 md:text-9xl lg:text-[8rem]"
									aria-label="Draft board hero image"
								/>
							</div>
						{/if}
					{:else}
						<!-- Loading placeholder -->
						<div
							class="flex h-80 w-80 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]"
						>
							<Icon
								icon="mdi:loading"
								class="animate-spin text-4xl text-gray-400"
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="bg-dark-800 py-12 md:py-16">
	<div class="tablet-spacing container mx-auto px-4">
		<h2
			class="mb-8 text-center text-2xl font-bold text-gray-100 md:mb-12 md:text-3xl"
		>
			The Perfect Draft Experience
		</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			<!-- Feature 1 -->
			<div class="card rounded-lg p-6 text-center shadow-xl">
				<div
					class="bg-gradient-pinkred mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<Icon
						icon="mdi:cog-outline"
						class="text-3xl text-white md:text-4xl"
					/>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-100 md:text-xl">
					Custom Draft Board
				</h3>
				<p class="text-sm text-gray-300 md:text-base">
					Fully customizable draft board where you can set the number of team
					managers, draft rounds, and other league settings to match your needs.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="card rounded-lg p-6 text-center shadow-xl">
				<div
					class="bg-gradient-pinkred mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<Icon
						icon="mdi:filter-variant"
						class="text-3xl text-white md:text-4xl"
					/>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-100 md:text-xl">
					Easy Player Selection Filter
				</h3>
				<p class="text-sm text-gray-300 md:text-base">
					Advanced filtering and search options to quickly find the perfect
					players by position, team, ranking, and more.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="card rounded-lg p-6 text-center shadow-xl">
				<div
					class="bg-gradient-pinkred mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<Icon
						icon="mdi:palette-outline"
						class="text-3xl text-white md:text-4xl"
					/>
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-100 md:text-xl">
					Color-Coded Positions
				</h3>
				<p class="text-sm text-gray-300 md:text-base">
					Each player position is color-coded for easy distinction, making it
					simple to identify quarterbacks, running backs, and other positions at
					a glance.
				</p>
			</div>

			<!-- Feature 4 - Download Draft Results -->
			<div class="card rounded-lg p-6 text-center shadow-xl">
				<div
					class="bg-gradient-pinkred mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<Icon icon="mdi:download" class="text-3xl text-white md:text-4xl" />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-100 md:text-xl">
					Downloadable Draft Results
				</h3>
				<p class="text-sm text-gray-300 md:text-base">
					Export your complete draft results for easy sharing and
					record-keeping. Get all pick details, team rosters, and draft order in
					one file.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section
	class="bg-gradient-to-br from-dark-900 to-dark-800 py-12 text-white md:py-16"
>
	<div class="tablet-spacing container mx-auto px-4 text-center">
		<h2 class="mb-4 text-2xl font-bold md:text-3xl">
			Ready to Set Up Your Draft Board?
		</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-100 md:text-xl">
			Create your custom draft board with team names, rounds, and manager
			settings. Get your fantasy draft started in minutes.
		</p>
		<Button href="/settings" size="lg">Set Up Your Draft Board Now</Button>
	</div>
</section>
