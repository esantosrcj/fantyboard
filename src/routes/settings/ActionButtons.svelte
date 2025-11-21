<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import WarningModal from '$lib/components/WarningModal.svelte';
	import Icon from '@iconify/svelte';
	import { DEFAULT_SETTINGS, generateDefaultTeamNames } from '$lib/helpers';
	import {
		draftActions,
		isConfigured,
		draftedPlayers
	} from '$lib/stores/draft';
	import { addToast } from '$lib/stores/toast';

	export let leagueName: string;
	export let numberOfTeams: number;
	export let numberOfRounds: number;
	export let draftType: 'snake' | 'linear';
	export let teamNames: string[];
	export let settingsSavedThisSession = false;
	export let saveSettings: () => void;

	// Warning modal state
	let showRestoreDefaultsWarning = false;
	let restoreDefaultsMessage = '';
	let restoreDefaultsWarningMessage = '';

	// Determine if Start Draft button should be enabled
	$: canGoToDraftBoard = $isConfigured || settingsSavedThisSession;

	function goToDraftBoard() {
		// Only proceed if settings are configured
		if (!canGoToDraftBoard) {
			addToast('Please save settings before starting the draft.', 'error');
			return;
		}

		// Navigate to draft board
		goto('/draftboard');
	}

	function restoreDefaults() {
		const hasOngoingDraft = $draftedPlayers.length > 0;

		restoreDefaultsMessage =
			'Are you sure you want to restore default settings? This action cannot be undone.';

		if (hasOngoingDraft) {
			restoreDefaultsWarningMessage =
				'This will delete your current draft progress and all drafted players!';
		} else {
			restoreDefaultsWarningMessage = '';
		}

		showRestoreDefaultsWarning = true;
	}

	function confirmRestoreDefaults() {
		// Reset to default settings
		leagueName = DEFAULT_SETTINGS.leagueName;
		numberOfTeams = DEFAULT_SETTINGS.numberOfTeams;
		numberOfRounds = DEFAULT_SETTINGS.numberOfRounds;
		draftType = DEFAULT_SETTINGS.draftType;
		teamNames = generateDefaultTeamNames(DEFAULT_SETTINGS.numberOfTeams);

		// Clear settings from store and localStorage
		draftActions.clearSettings();

		// Clear draft state from store and localStorage
		draftActions.clearDraftState();

		// Reset draft state completely
		draftActions.resetDraft();

		// Reset session flag
		settingsSavedThisSession = false;

		showRestoreDefaultsWarning = false;
		addToast(
			'Settings restored to defaults. All draft data has been cleared.',
			'info'
		);
	}

	function cancelRestoreDefaults() {
		showRestoreDefaultsWarning = false;
	}
</script>

<!-- Restore Defaults Warning Modal -->
<WarningModal
	isOpen={showRestoreDefaultsWarning}
	onConfirm={confirmRestoreDefaults}
	onCancel={cancelRestoreDefaults}
	title="Restore Default Settings"
	message={restoreDefaultsMessage}
	warningMessage={restoreDefaultsWarningMessage}
/>

<Button href="/" type="outline-accent">
	<Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
	Back to Home
</Button>

<div class="flex flex-col gap-2 sm:flex-row">
	<Button type="outline-destructive" on:click={restoreDefaults}>
		<Icon icon="mdi:restore" class="mr-2 h-4 w-4" />
		Restore Defaults
	</Button>
	<Button on:click={saveSettings} disabled={$isConfigured}>
		<Icon icon="mdi:content-save" class="mr-2 h-4 w-4" />
		Save Settings
	</Button>
	<Button
		type="outline-accent"
		on:click={goToDraftBoard}
		disabled={!canGoToDraftBoard}
	>
		Draft Board
		<Icon icon="mdi:arrow-right" class="ml-2 h-4 w-4" />
	</Button>
</div>
