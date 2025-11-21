<script lang="ts">
	import Button from './Button.svelte';
	import Icon from '@iconify/svelte';

	export let isOpen = false;
	export let onConfirm: () => void;
	export let onCancel: () => void;
	export let title: string = 'Warning';
	export let message: string = 'Message';
	export let warningMessage: string | undefined = undefined;
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
	>
		<div class="card w-full max-w-sm p-6 shadow-xl sm:max-w-md">
			<div class="mb-4 flex items-start sm:items-center">
				<Icon
					icon="mdi:alert-circle"
					class="mr-3 mt-0.5 text-xl text-amber-500 sm:mt-0 sm:text-2xl"
				/>
				<h3
					class="text-base font-semibold leading-tight text-gray-100 sm:text-lg"
				>
					{title}
				</h3>
			</div>

			<p class="mb-4 text-sm leading-relaxed text-gray-300 sm:text-base">
				{message}
			</p>

			{#if warningMessage}
				<div
					class="mb-6 rounded-lg border border-secondary-400 bg-secondary-900 bg-opacity-20 p-4"
				>
					<div class="flex items-start">
						<Icon
							icon="mdi:alert-triangle"
							class="mr-3 mt-0.5 h-5 w-5 text-secondary-400"
						/>
						<div>
							<h4 class="text-sm font-medium text-secondary-300">Warning</h4>
							<p class="mt-1 text-sm text-secondary-200">
								{warningMessage}
							</p>
						</div>
					</div>
				</div>
			{/if}

			<div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
				<Button type="outline-accent" on:click={onCancel} fullWidth={true}>
					Cancel
				</Button>
				<Button type="destructive" on:click={onConfirm} fullWidth={true}>
					Continue
				</Button>
			</div>
		</div>
	</div>
{/if}
