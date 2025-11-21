<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import OngoingDraft from './OngoingDraft.svelte';
	import DraftConfiguration from './DraftConfiguration.svelte';
	import TeamNames from './TeamNames.svelte';
	import ActionButtons from './ActionButtons.svelte';
	import type { DraftSettings } from '$lib/types';
	import { DEFAULT_SETTINGS, generateDefaultTeamNames } from '$lib/helpers';
	import {
		settings,
		draftActions,
		isConfigured,
		draftedPlayers
	} from '$lib/stores/draft';
	import { addToast } from '$lib/stores/toast';
	import { isMobilePhone } from '$lib/utils/device';

	// Form data
	let leagueName = DEFAULT_SETTINGS.leagueName;
	let numberOfTeams = DEFAULT_SETTINGS.numberOfTeams;
	let numberOfRounds = DEFAULT_SETTINGS.numberOfRounds;
	let draftType: 'snake' | 'linear' = DEFAULT_SETTINGS.draftType;
	let teamNames: string[] = [];

	// Track if settings have been saved in this session
	let settingsSavedThisSession = false;

	// Mobile device detection
	let showMobileWarning = false;

	// Determine if form fields should be disabled (ongoing draft)
	$: hasOngoingDraft = $draftedPlayers.length > 0;

	// Subscribe to settings store
	$: if ($settings) {
		leagueName = $settings.leagueName;
		numberOfTeams = $settings.numberOfTeams;
		numberOfRounds = $settings.numberOfRounds;
		draftType = $settings.draftType;
		teamNames = $settings.teamNames;
	}

	// Reactive statements to update team names when numberOfTeams changes
	$: {
		if (numberOfTeams) {
			// Generate default team names
			const newTeamNames = generateDefaultTeamNames(numberOfTeams);

			// Preserve existing custom names if any (including empty strings)
			if (teamNames.length > 0) {
				for (let i = 0; i < Math.min(teamNames.length, numberOfTeams); i++) {
					// Preserve any existing value, including empty strings
					if (teamNames[i] !== undefined && teamNames[i] !== `Team ${i + 1}`) {
						newTeamNames[i] = teamNames[i];
					}
				}
			}

			teamNames = newTeamNames;
		}
	}

	// Load settings from draft store on mount
	onMount(() => {
		draftActions.loadSettings();

		// Check if user is on mobile device
		if (browser) {
			showMobileWarning = isMobilePhone();
		}
	});

	function saveSettings() {
		// Prevent saving if form is disabled
		if ($isConfigured) {
			addToast(
				'Cannot modify settings during an ongoing draft. Please reset the draft first.',
				'error'
			);
			return;
		}

		// Validate league name
		if (!leagueName || leagueName.trim() === '') {
			addToast('Please enter a league name before saving.', 'error');
			return;
		}

		// Validate team names - ensure all are filled
		const emptyTeamNames = [];
		for (let i = 0; i < teamNames.length; i++) {
			if (!teamNames[i] || teamNames[i].trim() === '') {
				emptyTeamNames.push(i + 1);
			}
		}

		if (emptyTeamNames.length > 0) {
			const teamList = emptyTeamNames.join(', ');
			addToast(
				`Please fill in names for the following teams before saving: Team ${teamList}`,
				'error'
			);
			return;
		}

		const newSettings: DraftSettings = {
			leagueName: leagueName.trim(),
			numberOfTeams,
			numberOfRounds,
			draftType,
			teamNames: teamNames.map((name) => name.trim())
		};

		if (draftActions.saveSettings(newSettings)) {
			settingsSavedThisSession = true; // Enable Start Draft button
			addToast('Settings saved successfully!', 'success');
		} else {
			addToast('Invalid settings. Please check your inputs.', 'error');
		}
	}
</script>

<svelte:head>
	<title>Draft Settings - Fanty</title>
	<meta
		name="description"
		content="Configure your fantasy draft settings including teams, rounds, and team names."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 py-8">
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1
				class="animate-el-entrance text-gradient-green mb-4 font-fun text-4xl"
			>
				Draft Settings
			</h1>
			<p class="text-xl text-gray-300">
				Configure your fantasy draft parameters
			</p>
		</div>

		<!-- Settings Form -->
		<div class="mx-auto max-w-4xl">
			<!-- Mobile Warning -->
			{#if showMobileWarning}
				<div
					class="mb-6 rounded-lg border border-gray-600 bg-gray-800 bg-opacity-60 p-4"
				>
					<div class="flex items-start">
						<Icon
							icon="mdi:cellphone-off"
							class="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-secondary-400"
						/>
						<div>
							<h3 class="text-sm font-medium text-secondary-300">
								Best Experience on Desktop
							</h3>
							<p class="mt-1 text-sm text-gray-400">
								The draft board is optimized for desktop screens. For the best
								drafting experience, please use a computer or tablet in
								landscape mode.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Ongoing Draft Warning -->
			{#if hasOngoingDraft}
				<OngoingDraft numDraftedPlayers={$draftedPlayers.length} />
			{/if}

			<div class="card rounded-lg p-8 shadow-xl">
				<form on:submit|preventDefault={saveSettings} class="space-y-8">
					<!-- League Information Section -->
					<div class="border-b border-dark-600 pb-8">
						<h2 class="mb-6 text-2xl font-semibold text-gray-100">
							League Information
						</h2>

						<div>
							<!-- League Name -->
							<div>
								<label
									for="leagueName"
									class="mb-2 block text-sm font-medium text-gray-300"
								>
									League Name
								</label>
								<input
									type="text"
									id="leagueName"
									bind:value={leagueName}
									placeholder="Enter your league name"
									disabled={$isConfigured}
									class="input w-full text-sm disabled:cursor-not-allowed disabled:bg-dark-700 disabled:opacity-50 sm:w-1/2"
								/>
								<p class="mt-1 text-xs text-gray-400">
									This will be displayed on your draft board
								</p>
							</div>
						</div>
					</div>

					<!-- Draft Configuration Section -->
					<div class="border-b border-dark-600 pb-8">
						<DraftConfiguration
							bind:numberOfTeams
							bind:numberOfRounds
							bind:draftType
						/>
					</div>

					<!-- Team Names Section -->
					<div>
						<TeamNames {teamNames} />
					</div>

					<!-- Action Buttons -->
					<div class="flex flex-col gap-4 pt-8 sm:flex-row sm:justify-between">
						<ActionButtons
							bind:leagueName
							bind:numberOfTeams
							bind:numberOfRounds
							bind:draftType
							bind:teamNames
							bind:settingsSavedThisSession
							{saveSettings}
						/>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
