<script lang="ts">
	import { isConfigured } from '$lib/stores/draft';

	// Form data
	export let numberOfTeams = 8;
	export let numberOfRounds = 15;
	export let draftType: 'snake' | 'linear' = 'snake';
</script>

<h2 class="mb-6 text-2xl font-semibold text-gray-100">Draft Configuration</h2>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	<!-- Number of Teams -->
	<div>
		<label
			for="numberOfTeams"
			class="mb-2 block text-sm font-medium text-gray-300"
		>
			Number of Teams
		</label>
		<input
			type="range"
			id="numberOfTeams"
			bind:value={numberOfTeams}
			min="6"
			max="8"
			step="1"
			disabled={$isConfigured}
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-dark-600 disabled:cursor-not-allowed"
		/>
		<div class="mt-1 flex justify-between text-sm text-gray-400">
			<span>6</span>
			<span class="font-semibold text-gray-300">{numberOfTeams} teams</span>
			<span>8</span>
		</div>
	</div>

	<!-- Number of Rounds -->
	<div>
		<label
			for="numberOfRounds"
			class="mb-2 block text-sm font-medium text-gray-300"
		>
			Number of Rounds
		</label>
		<input
			type="range"
			id="numberOfRounds"
			bind:value={numberOfRounds}
			min="10"
			max="15"
			step="1"
			disabled={$isConfigured}
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-dark-600 disabled:cursor-not-allowed"
		/>
		<div class="mt-1 flex justify-between text-sm text-gray-400">
			<span>10</span>
			<span class="font-semibold text-gray-300">{numberOfRounds} rounds</span>
			<span>15</span>
		</div>
	</div>

	<!-- Draft Type -->
	<div class="md:col-span-2">
		<fieldset disabled={$isConfigured}>
			<legend class="mb-4 block text-sm font-medium text-gray-300">
				Draft Type
			</legend>
			<div class="space-y-4">
				<label
					class="group flex cursor-pointer items-start rounded-lg border border-dark-600 p-4 transition-all duration-200 hover:border-secondary-500 hover:bg-dark-700 has-[:disabled]:cursor-not-allowed has-[:checked]:border-secondary-500 has-[:disabled]:has-[:checked]:border-gray-600 has-[:checked]:bg-secondary-900/20 has-[:disabled]:has-[:checked]:bg-gray-800/20 has-[:disabled]:opacity-50"
				>
					<input
						type="radio"
						bind:group={draftType}
						name="draftType"
						value="snake"
						disabled={$isConfigured}
						class="peer sr-only"
					/>
					<div
						class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-500 transition-all duration-200 group-hover:border-secondary-400 peer-checked:border-secondary-500 peer-checked:bg-secondary-500 peer-disabled:border-gray-600 peer-disabled:peer-checked:border-gray-500 peer-disabled:peer-checked:bg-gray-500"
					>
						<div
							class="h-2.5 w-2.5 rounded-full bg-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
						></div>
					</div>
					<div class="ml-4 flex-1">
						<span
							class="block text-sm font-semibold text-gray-100 group-hover:text-secondary-300 peer-checked:text-secondary-300 peer-disabled:peer-checked:text-gray-400"
							>Snake Draft</span
						>
						<span
							class="mt-1 block text-sm text-gray-400 group-hover:text-gray-300"
						>
							Draft order reverses each round (1-2-3-4-5-6, then 6-5-4-3-2-1).
							This is the most common and fair draft format.
						</span>
					</div>
				</label>

				<label
					class="group flex cursor-pointer items-start rounded-lg border border-dark-600 p-4 transition-all duration-200 hover:border-secondary-500 hover:bg-dark-700 has-[:disabled]:cursor-not-allowed has-[:checked]:border-secondary-500 has-[:disabled]:has-[:checked]:border-gray-600 has-[:checked]:bg-secondary-900/20 has-[:disabled]:has-[:checked]:bg-gray-800/20 has-[:disabled]:opacity-50"
				>
					<input
						type="radio"
						bind:group={draftType}
						name="draftType"
						value="linear"
						disabled={$isConfigured}
						class="peer sr-only"
					/>
					<div
						class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-500 transition-all duration-200 group-hover:border-secondary-400 peer-checked:border-secondary-500 peer-checked:bg-secondary-500 peer-disabled:border-gray-600 peer-disabled:peer-checked:border-gray-500 peer-disabled:peer-checked:bg-gray-500"
					>
						<div
							class="h-2.5 w-2.5 rounded-full bg-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
						></div>
					</div>
					<div class="ml-4 flex-1">
						<span
							class="block text-sm font-semibold text-gray-100 group-hover:text-secondary-300 peer-checked:text-secondary-300 peer-disabled:peer-checked:text-gray-400"
							>Linear Draft</span
						>
						<span
							class="mt-1 block text-sm text-gray-400 group-hover:text-gray-300"
						>
							Draft order stays the same each round (1-2-3-4-5-6, then
							1-2-3-4-5-6). Less common format that favors early picks.
						</span>
					</div>
				</label>
			</div>
		</fieldset>
	</div>
</div>

<style>
	/* Custom slider styles for dark theme */
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #ea580c; /* secondary-600 */
		cursor: pointer;
		border: 2px solid #acabab;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	input[type='range']::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #ea580c; /* secondary-600 */
		cursor: pointer;
		border: 2px solid #acabab;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* Custom slider track styling */
	input[type='range']::-webkit-slider-track {
		background: #475569; /* dark-600 */
		border-radius: 4px;
		height: 8px;
	}

	input[type='range']::-moz-range-track {
		background: #475569; /* dark-600 */
		border-radius: 4px;
		height: 8px;
		border: none;
	}

	/* Disabled state for sliders */
	input[type='range']:disabled::-webkit-slider-thumb {
		background: #64748b; /* dark-500 */
		cursor: not-allowed;
	}

	input[type='range']:disabled::-moz-range-thumb {
		background: #64748b; /* dark-500 */
		cursor: not-allowed;
	}
</style>
