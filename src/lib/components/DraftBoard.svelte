<script lang="ts">
	import DraftPlayerModal from './DraftPlayerModal.svelte';
	import AddPlayerModal from './AddPlayerModal.svelte';
	import {
		formatPickNumber,
		getPositionBackgroundColor,
		formatPlayerNameDisplay
	} from '$lib/helpers';
	import type {
		DraftPickSquare,
		DraftSettings,
		Player,
		DraftedPlayer
	} from '$lib/types';
	import type { Readable } from 'svelte/store';

	export let settings: DraftSettings | null = null;
	export let shouldScroll: boolean = false;
	export let minGridWidth: string = 'auto';
	export let enableAddPlayer: boolean = true;

	// Store dependencies injected as props
	export let availablePlayers: Readable<Player[]>;
	export let draftedPlayers: Readable<DraftedPlayer[]>;
	export let currentPickNumber: Readable<number>;
	export let currentTeamName: Readable<string>;
	export let draftBoardByRounds: Readable<DraftPickSquare[][]>;
	export let isSquareClickable: Readable<(square: DraftPickSquare) => boolean>;
	export let draftActions: {
		draftPlayer: (player: Player) => boolean;
	};

	// Local UI state
	let showDraftModal = false;
	let showAddPlayerModal = false;
	let selectedSquare: DraftPickSquare | null = null;

	// Event handlers
	function handleSquareClick(square: DraftPickSquare) {
		// Only allow clicking on current pick that hasn't been drafted
		if (square.player || square.overallPick !== $currentPickNumber) {
			return;
		}
		selectedSquare = {
			...square,
			team: $currentTeamName
		};
		showDraftModal = true;
	}

	function handlePlayerDrafted(player: Player) {
		const success = draftActions.draftPlayer(player);
		if (success) {
			showDraftModal = false;
			selectedSquare = null;
		}
	}

	function handleAddAndDraft(player: Player) {
		const success = draftActions.draftPlayer(player);
		if (success) {
			showAddPlayerModal = false;
			selectedSquare = null;
		}
	}

	function closeAddPlayerModal() {
		showAddPlayerModal = false;
		showDraftModal = true;
	}
</script>

<!-- Draft Player Modal -->
<DraftPlayerModal
	bind:showDraftModal
	bind:showAddPlayerModal
	bind:selectedSquare
	availablePlayers={$availablePlayers}
	onPlayerSelect={handlePlayerDrafted}
	{enableAddPlayer}
/>

<!-- Add Player Modal -->
<AddPlayerModal
	isOpen={showAddPlayerModal}
	onClose={closeAddPlayerModal}
	onAddAndDraft={handleAddAndDraft}
	totalPlayersCount={$availablePlayers.length + $draftedPlayers.length}
/>

{#if settings}
	<!-- Team Headers -->
	<div class="mb-4 px-4">
		<div
			class="grid grid-cols-1 overflow-hidden rounded-lg border border-dark-600"
			style="grid-template-columns: 60px repeat({settings.numberOfTeams}, 1fr); {shouldScroll
				? `min-width: ${minGridWidth};`
				: ''}"
		>
			<div
				class="border-r border-dark-600 bg-dark-700 py-2 text-center font-fun font-bold text-gray-100"
			>
				RD
			</div>
			{#each settings.teamNames as teamName}
				<div
					class="border-r border-dark-600 bg-dark-600 py-2 text-center font-fun text-sm font-bold text-gray-200 last:border-r-0"
				>
					{teamName}
				</div>
			{/each}
		</div>
	</div>

	<!-- Draft Board Grid -->
	<div class="px-4">
		<div
			class="overflow-hidden rounded-lg border border-dark-600"
			style={shouldScroll ? `min-width: ${minGridWidth};` : ''}
		>
			{#each $draftBoardByRounds as roundSquares, roundIndex}
				{@const round = roundIndex + 1}

				<div
					class="grid grid-cols-1 border-b border-dark-600 last:border-b-0"
					style="grid-template-columns: 60px repeat({settings.numberOfTeams}, 1fr); {shouldScroll
						? `min-width: ${minGridWidth};`
						: ''}"
				>
					<!-- Round Number -->
					<div
						class="flex items-center justify-center border-r border-dark-600 bg-dark-700 py-4 text-lg font-bold text-gray-100"
					>
						{round}
					</div>

					<!-- Draft Squares for this round -->
					{#each roundSquares as square}
						{@const isCurrentPick = $isSquareClickable(square)}
						<button
							type="button"
							disabled={!isCurrentPick}
							on:click={() => handleSquareClick(square)}
							on:keydown={(e) => e.key === 'Enter' && handleSquareClick(square)}
							class="touch-target-lg relative flex min-h-[120px] w-full flex-col justify-center border-r border-dark-600 last:border-r-0 md:min-h-[140px]
						   {square.player
								? 'bg-dark-800'
								: isCurrentPick
									? 'draft-square-touch bg-primary-900 bg-opacity-20 focus:bg-primary-800 focus:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-primary-500'
									: 'cursor-default bg-dark-800'}"
						>
							{#if isCurrentPick}
								<div
									class="pointer-events-none absolute inset-0 animate-pulse rounded-sm border-2 border-primary-500"
								></div>
							{/if}
							{#if square.player}
								{@const nameDisplay = formatPlayerNameDisplay(
									square.player.name,
									square.player.position
								)}
								<!-- Player sticker/label with rounded corners and padding -->
								<div
									class="flex h-full min-h-[100px] flex-col justify-center rounded-lg border border-gray-700 {getPositionBackgroundColor(
										square.player.position
									)}"
								>
									<!-- Position top-left -->
									<div class="absolute left-2 top-2 text-sm font-bold">
										{square.player.position}
									</div>
									<!-- Team top-right -->
									<div class="absolute right-2 top-2 text-sm font-bold">
										{square.player.team}
									</div>
									<!-- Player name centered -->
									<div
										class="flex flex-col items-center justify-center text-center"
									>
										{#if nameDisplay.firstName}
											<div class="text-sm font-medium">
												{nameDisplay.firstName}
											</div>
										{/if}
										<div class="text-xl font-bold uppercase tracking-wide">
											{nameDisplay.lastName}
										</div>
									</div>
								</div>
							{:else}
								<div class="text-center text-gray-400">
									<div class="mb-1 text-base">
										Pick {formatPickNumber(
											square.overallPick,
											square.round,
											square.pick
										)}
									</div>
									{#if square.overallPick === $currentPickNumber}
										<div class="text-base font-semibold text-primary-400">
											On the Clock
										</div>
									{/if}
								</div>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/if}
