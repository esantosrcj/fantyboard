<script lang="ts">
	import Icon from '@iconify/svelte';
	import Papa from 'papaparse';
	import WarningModal from '$lib/components/WarningModal.svelte';
	import { formatPlayerNameDisplay } from '$lib/helpers';
	import { addToast } from '$lib/stores/toast';
	import {
		currentPick,
		currentPickNumber,
		currentTeamName,
		draftActions,
		draftedPlayers,
		settings,
		isComplete
	} from '$lib/stores/draft';

	// Local UI state
	let showResetWarning = false;

	// Event handlers
	function handleUndoLastPick() {
		const lastPlayer = $draftedPlayers[$draftedPlayers.length - 1];
		const success = draftActions.undoLastPick();

		if (success && lastPlayer) {
			addToast(
				`Undid pick: ${lastPlayer.name} (${lastPlayer.position})`,
				'info'
			);
		}
	}

	function handleResetDraft() {
		showResetWarning = true;
	}

	function confirmResetDraft() {
		// Clear draft state from store and localStorage
		draftActions.clearDraftState();

		// Reset draft state completely
		draftActions.resetDraft();

		// Re-initialize the draft board with current settings
		if ($settings) {
			draftActions.initializeDraftBoard($settings);
		}

		showResetWarning = false;
	}

	function cancelResetDraft() {
		showResetWarning = false;
	}

	function handleDownloadDraft() {
		if (!$isComplete || $draftedPlayers.length === 0) {
			addToast('Draft must be complete to download', 'error');
			return;
		}

		try {
			// Prepare CSV data
			const csvData = $draftedPlayers.map((player) => ({
				'Player Name': player.name,
				Position: player.position,
				Team: player.team,
				'Bye Week': player.byeWeek || 'N/A',
				'Round Drafted': player.round,
				'Pick in Round': player.pick,
				'Overall Pick': player.overallPick,
				'Drafted By': player.draftedBy
			}));

			// Convert to CSV
			const csv = Papa.unparse(csvData);

			// Create download link
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);

			// Generate filename with league name and timestamp
			const leagueName = $settings?.leagueName || 'Draft';
			const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
			const filename = `${leagueName.replace(/[^a-z0-9]/gi, '_')}_Draft_${timestamp}.csv`;

			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Detect if likely on mobile/tablet for different success message
			const isMobileDevice =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				);

			if (isMobileDevice) {
				addToast(
					'Draft exported! Check your Downloads folder or Files app.',
					'success'
				);
			} else {
				addToast('Draft exported successfully!', 'success');
			}
		} catch (error) {
			console.error('Error downloading draft:', error);
			addToast('Error downloading draft', 'error');
		}
	}

	// Reactive statements for derived UI state
	$: canUndo = $draftedPlayers.length > 0;
	$: currentRound = $currentPick?.round || 1;
	$: canDownload = $isComplete && $draftedPlayers.length > 0;
</script>

<!-- Reset Draft Warning Modal -->
<WarningModal
	isOpen={showResetWarning}
	onConfirm={confirmResetDraft}
	onCancel={cancelResetDraft}
	title="Reset Draft"
	message="Are you sure you want to reset the entire draft? This action cannot be undone."
/>

<div class="grid grid-cols-12 items-start gap-4">
	<!-- Left side: Control Buttons (3 columns) -->
	<div class="col-span-3 flex h-full flex-col justify-end pb-4">
		<div class="flex gap-3">
			<a
				href="/"
				class="touch-target touch-active flex items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
				title="Back to Home"
			>
				<Icon icon="mdi:home" class="h-6 w-6 text-accent-500" />
			</a>
			<a
				href="/settings"
				class="touch-target touch-active flex items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
				title="Settings"
			>
				<Icon icon="mdi:settings-outline" class="h-6 w-6 text-accent-500" />
			</a>
			<button
				type="button"
				disabled={!canUndo}
				on:click={handleResetDraft}
				class="touch-target touch-active flex items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:focus:bg-gray-700"
				title="Reset Draft"
			>
				<Icon icon="mdi:restart" class="h-6 w-6 text-red-400" />
			</button>
			<button
				type="button"
				disabled={!canUndo}
				on:click={handleUndoLastPick}
				class="touch-target touch-active flex items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:focus:bg-gray-700"
				title="Undo Last Pick"
			>
				<Icon icon="mdi:undo" class="h-6 w-6 text-yellow-400" />
			</button>
			{#if canDownload}
				<button
					type="button"
					on:click={handleDownloadDraft}
					class="touch-target touch-active flex items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
					title="Download Draft Results"
				>
					<Icon icon="mdi:download" class="h-6 w-6 text-green-400" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Center: Current Pick Info (6 columns) -->
	{#if $currentPick && !$isComplete}
		<div class="col-span-6 mb-4">
			<div
				class="flex h-24 items-center rounded-lg border border-gray-600 bg-gray-800 bg-opacity-80 p-4 shadow-lg"
			>
				<div class="flex w-full items-center justify-between">
					<!-- Left side: On the Clock -->
					<div class="text-center">
						<div
							class="text-base font-medium uppercase tracking-wide text-gray-400"
						>
							On the Clock
						</div>
					</div>

					<!-- Center: Team name (still large but in a single line) -->
					<div class="flex-1 text-center">
						<div
							class="text-5xl font-bold uppercase tracking-wide text-gray-100"
						>
							{$currentTeamName}
						</div>
					</div>

					<!-- Right side: Round and Pick in compact format -->
					<div class="flex items-center gap-6">
						<div class="text-center">
							<div class="text-xs font-medium uppercase text-gray-400">
								Round
							</div>
							<div class="text-2xl font-bold text-gray-200">
								{currentRound}
							</div>
						</div>
						<div class="text-center">
							<div class="text-xs font-medium uppercase text-gray-400">
								Pick
							</div>
							<div class="text-2xl font-bold text-gray-200">
								{$currentPickNumber}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="col-span-6"></div>
	{/if}

	<!-- Right side: Last Pick Info (3 columns) -->
	{#if $draftedPlayers.length > 0}
		{@const lastPlayer = $draftedPlayers[$draftedPlayers.length - 1]}
		{@const lastPlayerNameDisplay = formatPlayerNameDisplay(
			lastPlayer.name,
			lastPlayer.position
		)}
		<div class="col-span-3 mb-4">
			<div
				class="flex h-24 items-center rounded-lg border border-gray-600 bg-gray-800 bg-opacity-80 p-4 shadow-lg"
			>
				<div class="grid w-full grid-cols-12 items-center gap-4">
					<!-- Left side: Labels (4 columns - 1/3) -->
					<div class="col-span-4 text-right">
						<div
							class="text-base font-medium uppercase tracking-wide text-gray-400"
						>
							Last Pick
						</div>
						<div
							class="mt-1 text-base font-medium uppercase tracking-wide text-gray-400"
						>
							Drafted By
						</div>
					</div>

					<!-- Right side: Data (8 columns - 2/3) -->
					<div class="col-span-8 text-left">
						<div class="text-base font-medium text-gray-200">
							{lastPlayerNameDisplay.firstName}
							{lastPlayerNameDisplay.lastName} | {lastPlayer.position}
						</div>
						<div class="mt-1 text-base font-bold text-gray-200">
							{lastPlayer.draftedBy}
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="col-span-3"></div>
	{/if}
</div>
