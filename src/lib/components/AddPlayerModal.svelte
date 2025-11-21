<script lang="ts">
	import { NFL_TEAMS, POSITIONS } from '$lib/data/players';
	import type { Player } from '$lib/types';
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/Button.svelte';

	export let isOpen: boolean = false;
	export let onClose: () => void = () => {};
	export let onAddAndDraft: (player: Player) => void = () => {};
	export let totalPlayersCount: number = 0;

	// Form state
	let playerName: string = '';
	let selectedPosition: string = '';
	let selectedTeam: string = '';
	let nameInput: HTMLInputElement;

	// Validation
	$: isValid =
		playerName.trim() !== '' && selectedPosition !== '' && selectedTeam !== '';

	// Auto-focus name input when modal opens
	$: if (isOpen && nameInput) {
		nameInput.focus();
	}

	function handleSubmit() {
		if (!isValid) return;

		const newPlayer: Player = {
			id: `custom-${totalPlayersCount + 1}-${Date.now()}`,
			name: playerName.trim(),
			position: selectedPosition as Player['position'],
			team: selectedTeam
		};

		onAddAndDraft(newPlayer);
		resetForm();
	}

	function handleCancel() {
		resetForm();
		onClose();
	}

	function resetForm() {
		playerName = '';
		selectedPosition = '';
		selectedTeam = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return;

		if (event.key === 'Escape') {
			handleCancel();
		} else if (event.key === 'Enter' && isValid) {
			event.preventDefault();
			handleSubmit();
		}
	}

	// Reset form when modal opens
	$: if (isOpen) {
		resetForm();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="add-player-modal-title"
	>
		<div class="modal-content w-full max-w-md rounded-lg shadow-2xl">
			<!-- Header -->
			<div class="border-b border-dark-600 p-6">
				<div class="flex items-center justify-between">
					<div>
						<h2
							id="add-player-modal-title"
							class="text-xl font-bold text-gray-100"
						>
							Add Custom Player
						</h2>
						<p class="text-sm text-gray-300">
							Create a player not on the available list
						</p>
					</div>
					<button
						on:click={handleCancel}
						class="touch-target rounded-full p-2 text-2xl text-gray-400 transition-colors hover:text-secondary-400"
						aria-label="Close modal"
					>
						<Icon icon="mdi:close" class="h-8 w-8" />
					</button>
				</div>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={handleSubmit} class="p-6">
				<div class="space-y-4">
					<!-- Player Name -->
					<div>
						<label
							for="player-name"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Player Name *
						</label>
						<input
							id="player-name"
							bind:this={nameInput}
							bind:value={playerName}
							type="text"
							placeholder="Enter player name..."
							class="input w-full"
							required
						/>
					</div>

					<!-- Position -->
					<div>
						<label
							for="player-position"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Position *
						</label>
						<select
							id="player-position"
							bind:value={selectedPosition}
							class="input w-full"
							required
						>
							<option value="">Select Position</option>
							{#each POSITIONS as position}
								<option value={position}>
									{position}
								</option>
							{/each}
						</select>
					</div>

					<!-- Team -->
					<div>
						<label
							for="player-team"
							class="mb-2 block text-sm font-medium text-gray-300"
						>
							Team *
						</label>
						<select
							id="player-team"
							bind:value={selectedTeam}
							class="input w-full"
						>
							<option value="">Select Team</option>
							{#each NFL_TEAMS as team}
								<option value={team}>
									{team}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="mt-8 flex gap-3">
					<Button type="secondary" fullWidth={true} on:click={handleCancel}>
						Cancel
					</Button>
					<Button
						type="primary"
						fullWidth={true}
						disabled={!isValid}
						on:click={handleSubmit}
					>
						Add Player & Draft
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
