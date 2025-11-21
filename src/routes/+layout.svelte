<script lang="ts">
	import '../app.css';
	import { toasts } from '$lib/stores/toast';
	import Toast from '$lib/components/Toast.svelte';
	import TouchOptimizer from '$lib/components/TouchOptimizer.svelte';
	// import DeviceDebugger from '$lib/components/DeviceDebugger.svelte';

	// Stack toasts vertically
	$: toastList = $toasts;
</script>

<TouchOptimizer />

<div class="flex min-h-screen flex-col bg-dark-900 text-gray-100">
	<main class="flex-grow">
		<slot />
	</main>
</div>

<!-- Toast Container -->
<div class="fixed right-4 top-4 z-50 flex flex-col gap-3">
	{#each toastList as toast (toast.id)}
		<Toast id={toast.id} message={toast.message} type={toast.type} />
	{/each}
</div>

<!-- Device Debugger (development only) -->
