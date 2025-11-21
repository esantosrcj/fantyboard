<script lang="ts">
	import Icon from '@iconify/svelte';

	export let numDraftedPlayers = 0;
</script>

<div
	class="mb-6 rounded-lg border border-secondary-400 bg-secondary-900 bg-opacity-20 p-4"
>
	<div class="flex items-start">
		<Icon
			icon="mdi:alert-circle"
			class="mr-3 mt-0.5 hidden h-5 w-5 text-secondary-400 sm:block"
		/>
		<div>
			<h3 class="text-sm font-medium text-secondary-300">Draft in Progress</h3>
			<p class="mt-1 text-sm text-secondary-200">
				Settings are locked because you have an ongoing draft with {numDraftedPlayers}
				drafted player{numDraftedPlayers === 1 ? '' : 's'}. To modify settings,
				you must first reset the draft (this will clear all drafted players).
			</p>
		</div>
	</div>
</div>
