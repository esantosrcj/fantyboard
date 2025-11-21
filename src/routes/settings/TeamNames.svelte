<script lang="ts">
	import { isConfigured } from '$lib/stores/draft';

	// Constants
	const MAX_TEAM_NAME_LENGTH = 20;

	// Form data
	export let teamNames: string[] = [];

	function updateTeamName(index: number, event: Event) {
		// Prevent updates if form is disabled
		if ($isConfigured) return;

		const value = (event.target as HTMLInputElement).value;

		// Limit the length
		if (value.length <= MAX_TEAM_NAME_LENGTH) {
			teamNames[index] = value;
			teamNames = teamNames; // Trigger reactivity
		} else {
			// Reset to the previous value (truncated)
			(event.target as HTMLInputElement).value = teamNames[index];
		}
	}
</script>

<h2 class="mb-6 text-2xl font-semibold text-gray-100">Team Names</h2>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each teamNames as teamName, index}
		<div>
			<label
				for="team-{index + 1}"
				class="mb-1 block text-sm font-medium text-gray-300"
			>
				Team {index + 1}
			</label>
			<input
				type="text"
				id="team-{index + 1}"
				value={teamName}
				on:input={(e) => updateTeamName(index, e)}
				placeholder="Team {index + 1}"
				maxlength={MAX_TEAM_NAME_LENGTH}
				disabled={$isConfigured}
				class="input w-full text-sm disabled:cursor-not-allowed disabled:bg-dark-700 disabled:opacity-50"
			/>
			<p class="mt-1 text-xs text-gray-400">
				{teamName.length}/{MAX_TEAM_NAME_LENGTH} characters
			</p>
		</div>
	{/each}
</div>
