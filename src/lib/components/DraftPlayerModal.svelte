<script lang="ts">
	import { NFL_TEAMS, POSITIONS } from '$lib/data/players';
	import { getPositionColor, formatPlayerNameDisplay } from '$lib/helpers';
	import type { DraftPickSquare, Player } from '$lib/types';
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	// Data binding props
	export let showDraftModal: boolean = false;
	export let showAddPlayerModal: boolean = false;
	export let selectedSquare: DraftPickSquare | null = null;

	// Props
	export let availablePlayers: Player[] = [];
	export let onPlayerSelect: (player: Player) => void = () => {};
	export let enableAddPlayer: boolean = true;

	// Internal states - using reactive binding
	let searchName: string = '';
	let selectedPosition: string = '';
	let selectedTeam: string = '';
	let searchInput: HTMLInputElement;
	let selectedPlayerIndex: number = -1;

	// Debounced search for better performance
	let searchTimeout: NodeJS.Timeout;
	let debouncedSearchName: string = '';

	// Creates a 500ms delay before updating debouncedSearchName when searchName changes
	$: {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			debouncedSearchName = searchName;
		}, 500);
	}

	// More efficient filtering with debouncedSearchName
	$: filteredPlayers = availablePlayers
		.filter((player) => {
			// Check if name matches
			const matchesName = player.name
				.toLowerCase()
				.includes(debouncedSearchName.toLowerCase());

			// Check if position matches
			const matchesPosition =
				!selectedPosition || player.position === selectedPosition;

			// Check if team matches
			const matchesTeam = !selectedTeam || player.team === selectedTeam;

			// Player matches name, position, and team
			return matchesName && matchesPosition && matchesTeam;
		})
		.sort((a, b) => (a.rank || 999) - (b.rank || 999));

	// Resets the keyboard navigation selection whenever the filtered players list changes
	$: if (filteredPlayers) {
		selectedPlayerIndex = -1;
	}

	// Auto-focus search input when modal opens
	$: if (showDraftModal && searchInput) {
		searchInput.focus();
	}

	function closeModal() {
		showDraftModal = false;
		selectedSquare = null;

		// Reset filters
		clearFilters();
	}

	function handleAddPlayerRequest() {
		showDraftModal = false;
		showAddPlayerModal = true;

		// Reset filters
		clearFilters();
	}

	function clearFilters() {
		searchName = '';
		selectedPosition = '';
		selectedTeam = '';
		selectedPlayerIndex = -1;
		// Immediately clear the debounced search to avoid delay
		clearTimeout(searchTimeout);
		debouncedSearchName = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!showDraftModal) return;

		switch (event.key) {
			case 'Escape':
				closeModal();
				break;
			case 'ArrowDown':
				event.preventDefault();
				selectedPlayerIndex = Math.min(
					selectedPlayerIndex + 1,
					filteredPlayers.length - 1
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedPlayerIndex = Math.max(selectedPlayerIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedPlayerIndex >= 0 && filteredPlayers[selectedPlayerIndex]) {
					onPlayerSelect(filteredPlayers[selectedPlayerIndex]);
				}
				break;
		}
	}

	function handlePlayerClick(player: Player, index: number) {
		selectedPlayerIndex = index;
		onPlayerSelect(player);
	}

	// Clean up timeout on component destroy
	onMount(() => {
		return () => {
			clearTimeout(searchTimeout);
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showDraftModal && selectedSquare}
	<div
		class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div
			class="modal-content flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg shadow-2xl"
		>
			<!-- Header -->
			<div class="border-b border-dark-600 p-4 md:p-6">
				<div class="flex items-center justify-between">
					<div>
						<h2
							id="modal-title"
							class="text-xl font-bold text-gray-100 md:text-2xl"
						>
							Select Player
						</h2>
						<p class="text-sm text-gray-300 md:text-base">
							Round {selectedSquare.round}, Pick {selectedSquare.pick} (Overall:
							{selectedSquare.overallPick}) - {selectedSquare.team}
						</p>
					</div>
					<button
						on:click={closeModal}
						class="touch-target rounded-full p-2 text-2xl text-gray-400 transition-colors hover:text-secondary-400"
						aria-label="Close modal"
					>
						<Icon icon="mdi:close" class="h-8 w-8" />
					</button>
				</div>
			</div>

			<!-- Filters -->
			<div class="border-b border-dark-600 p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<label
							for="search-input"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Search by Name
						</label>
						<input
							id="search-input"
							bind:this={searchInput}
							bind:value={searchName}
							type="text"
							placeholder="Player name..."
							class="input w-full"
						/>
					</div>

					<div>
						<label
							for="position-select"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Position
						</label>
						<select
							id="position-select"
							bind:value={selectedPosition}
							class="input w-full"
						>
							<option value="">All Positions</option>
							{#each POSITIONS as position}
								<option value={position}>
									{position}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label
							for="team-select"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Team
						</label>
						<select
							id="team-select"
							bind:value={selectedTeam}
							class="input w-full"
						>
							<option value="">All Teams</option>
							{#each NFL_TEAMS as team}
								<option value={team}>
									{team}
								</option>
							{/each}
						</select>
					</div>

					<div class="flex items-end">
						<Button type="secondary" fullWidth={true} on:click={clearFilters}>
							Clear Filters
						</Button>
					</div>
				</div>
			</div>

			<!-- Player List -->
			<div
				class="custom-scrollbar touch-scroll flex-1 overflow-y-auto p-4 md:p-6"
			>
				<div class="mb-4 text-sm text-gray-400">
					Showing {filteredPlayers.length} of {availablePlayers.length} available
					players
					{#if selectedPlayerIndex >= 0}
						<span class="ml-2 text-primary-400">
							(Use ↑↓ to navigate, Enter to select)
						</span>
					{/if}
				</div>

				<div
					class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					role="listbox"
					aria-label="Available players"
				>
					{#each filteredPlayers as player, index}
						{@const nameDisplay = formatPlayerNameDisplay(
							player.name,
							player.position
						)}
						<button
							type="button"
							role="option"
							aria-selected={index === selectedPlayerIndex}
							tabindex={index === selectedPlayerIndex ? 0 : -1}
							on:click={() => handlePlayerClick(player, index)}
							on:keydown={(e) =>
								e.key === 'Enter' && handlePlayerClick(player, index)}
							class="touch-target-lg touch-active relative flex min-h-[140px] w-full flex-col justify-center rounded-lg border border-dark-600 p-4 transition-all duration-200 focus:border-primary-500 focus:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 md:min-h-[120px] {index ===
							selectedPlayerIndex
								? 'border-primary-500 bg-primary-900 bg-opacity-20'
								: 'bg-dark-800'}"
						>
							{#if index === selectedPlayerIndex}
								<div
									class="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary-500"
								></div>
							{/if}

							<!-- Position top-left -->
							<div
								class="absolute left-2 top-2 rounded-full border px-2 py-1 text-xs font-medium {getPositionColor(
									player.position
								)}"
							>
								{player.position}
							</div>

							<!-- Team top-right -->
							<div
								class="absolute right-2 top-2 text-xs font-medium text-gray-300"
							>
								{player.team}
							</div>

							<!-- Player name centered -->
							<div
								class="flex flex-col items-center justify-center text-center"
							>
								{#if nameDisplay.firstName}
									<div class="text-sm font-medium text-gray-200">
										{nameDisplay.firstName}
									</div>
								{/if}
								<div class="text-lg font-bold text-gray-100">
									{nameDisplay.lastName}
								</div>
							</div>

							<!-- Stats bottom -->
							<div
								class="absolute bottom-2 left-2 right-2 flex justify-between text-xs"
							>
								{#if player.rank}
									<div class="font-medium text-gray-300">
										#{player.rank}
									</div>
								{:else}
									<div></div>
								{/if}
								{#if player.adp}
									<div class="text-gray-400">
										ADP: {player.adp.toFixed(1)}
									</div>
								{:else}
									<div></div>
								{/if}
							</div>
						</button>
					{/each}
				</div>

				{#if filteredPlayers.length === 0}
					<div class="py-8 text-center">
						<div class="mb-4 text-gray-400">
							No players found matching your filters.
						</div>
						{#if enableAddPlayer && debouncedSearchName.length > 0}
							<div class="mb-4 text-gray-300">
								Looking for "{debouncedSearchName}"?
							</div>
							<Button type="primary" on:click={handleAddPlayerRequest}>
								<Icon icon="mdi:plus" class="mr-2 h-4 w-4" />
								Add Custom Player
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
