<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import StickyHeader from '$lib/components/StickyHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import ScreenSizeGuard from '$lib/components/ScreenSizeGuard.svelte';
	import TabletOrientationHint from '$lib/components/TabletOrientationHint.svelte';
	import DraftBoard from '$lib/components/DraftBoard.svelte';
	import DraftCelebrationCard from '$lib/components/DraftCelebrationCard.svelte';
	import {
		isComplete,
		isConfigured,
		isLoading,
		isSquareClickable,
		settings,
		totalPicks,
		availablePlayers,
		draftedPlayers,
		currentPickNumber,
		currentTeamName,
		draftBoardByRounds,
		draftActions,
		recentlyDraftedPlayer
	} from '$lib/stores/draft';

	// Initialize on mount
	onMount(() => {
		draftActions.loadSettings();
		draftActions.loadState();
	});

	// Reactive statements for derived UI state
	$: shouldScroll = !!$settings && $settings.numberOfTeams > 10;
	$: minGridWidth = shouldScroll
		? `${60 + ($settings?.numberOfTeams || 0) * 150}px`
		: 'auto';

	// Handle celebration card completion
	function handleCelebrationComplete() {
		draftActions.clearRecentlyDraftedPlayer();
	}
</script>

<svelte:head>
	<title
		>{$settings?.leagueName
			? `${$settings.leagueName} Draft Board`
			: 'Draft Board'} - Fanty</title
	>
	<meta
		name="description"
		content="Fantasy draft board showing all picks and team selections."
	/>
</svelte:head>

<ScreenSizeGuard>
	<div class="min-h-screen bg-dark-900 py-8">
		<div class="w-full px-2">
			<!-- Header -->
			<div class="mb-8 text-center">
				{#if $settings?.leagueName}
					<h1
						class="animate-el-entrance text-gradient-green mb-4 font-fun text-4xl text-gray-100"
					>
						{$settings.leagueName} Draft Board
					</h1>
				{:else}
					<h1
						class="animate-el-entrance text-gradient-green mb-4 font-fun text-4xl text-gray-100"
					>
						Draft Board
					</h1>
				{/if}
			</div>

			{#if $isLoading}
				<!-- Loading State -->
				<div class="mx-auto max-w-2xl">
					<div class="card rounded-lg p-8 shadow-xl">
						<div class="text-center">
							<div class="mx-auto mb-4 h-16 w-16 animate-spin">
								<Icon icon="mdi:loading" class="h-16 w-16 text-primary-500" />
							</div>
							<h2 class="mb-4 text-2xl font-semibold text-gray-100">
								Loading Draft Board...
							</h2>
							<p class="text-lg text-gray-300">
								Checking for existing settings and draft state.
							</p>
						</div>
					</div>
				</div>
			{:else if !$isConfigured}
				<!-- Not Configured Message -->
				<div class="mx-auto max-w-2xl">
					<div class="card rounded-lg p-8 shadow-xl">
						<div class="text-center">
							<Icon
								icon="mdi:settings-outline"
								class="mx-auto mb-4 h-16 w-16 text-gray-400"
							/>
							<h2 class="mb-4 text-2xl font-semibold text-gray-100">
								Draft Board Not Configured
							</h2>
							<p class="mb-8 text-lg text-gray-300">
								You need to configure your draft settings before using the draft
								board. Please set up the number of teams and rounds first.
							</p>
							<div class="space-y-4">
								<p class="text-sm text-gray-400">
									<strong>Minimum requirements:</strong>
								</p>
								<ul class="space-y-1 text-sm text-gray-300">
									<li>• Number of teams: 6-20</li>
									<li>• Number of rounds: 10-20</li>
								</ul>
							</div>
							<div
								class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
							>
								<Button href="/" type="outline-accent">
									<Icon icon="mdi:home" class="mr-2 h-4 w-4" />
									Back to Home
								</Button>
								<Button href="/settings">
									<Icon icon="mdi:settings-outline" class="mr-2 h-4 w-4" />
									Configure Settings
								</Button>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Draft Board -->
				<div class="space-y-4">
					<!-- Combined Sticky Header: Current Pick Info + Header Buttons -->
					<div class="sticky top-0 z-20 bg-dark-900 px-4 py-2">
						<StickyHeader />

						{#if $isComplete}
							<div
								class="rounded border border-gray-500 bg-gray-800 bg-opacity-60 px-4 py-3 text-center text-gray-200 shadow-lg"
							>
								<div class="text-xl font-bold">🎉 Draft Complete! 🎉</div>
								<div class="mt-2">
									All {$totalPicks} picks have been made. Complete draft CSV available
									to download.
								</div>
							</div>
						{/if}
					</div>

					<!-- Checkerboard Draft Board -->
					<div class="w-full {shouldScroll ? 'overflow-x-auto' : ''}">
						<DraftBoard
							settings={$settings}
							{shouldScroll}
							{minGridWidth}
							{availablePlayers}
							{draftedPlayers}
							{currentPickNumber}
							{currentTeamName}
							{draftBoardByRounds}
							{isSquareClickable}
							{draftActions}
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</ScreenSizeGuard>

<!-- Tablet orientation hint -->
<TabletOrientationHint />

<!-- Draft Celebration Card -->
<DraftCelebrationCard
	isVisible={!!$recentlyDraftedPlayer}
	draftedPlayer={$recentlyDraftedPlayer}
	onComplete={handleCelebrationComplete}
/>
