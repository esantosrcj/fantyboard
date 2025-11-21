<script lang="ts">
	export let type:
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'outline-primary'
		| 'outline-secondary'
		| 'outline-accent'
		| 'destructive'
		| 'outline-destructive'
		| 'text' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let submit = false;
	export let disabled = false;
	export let fullWidth = false;
	export let href: string | undefined = undefined;

	// Button style classes with your new color scheme
	const typeClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		accent: 'btn-accent',
		'outline-primary': 'btn-outline-primary',
		'outline-secondary': 'btn-outline-secondary',
		'outline-accent': 'btn-outline-accent',
		destructive: 'btn-destructive',
		'outline-destructive': 'btn-outline-destructive',
		text: 'btn-text'
	};

	// Button size classes with touch-friendly minimum sizes
	const sizeClasses = {
		sm: 'py-2 px-4 text-sm touch-target',
		md: 'py-3 px-6 text-base touch-target',
		lg: 'py-4 px-8 text-lg touch-target-lg'
	};
</script>

{#if href}
	<a
		{href}
		class="{typeClasses[type]} {sizeClasses[size]} touch-active {fullWidth
			? 'w-full'
			: ''} {disabled ? 'cursor-not-allowed opacity-50' : ''}"
		class:pointer-events-none={disabled}
		role="button"
		tabindex={disabled ? -1 : 0}
	>
		<slot />
	</a>
{:else}
	<button
		type={submit ? 'submit' : 'button'}
		{disabled}
		class="{typeClasses[type]} {sizeClasses[size]} touch-active {fullWidth
			? 'w-full'
			: ''} {disabled ? 'cursor-not-allowed opacity-50' : ''}"
		on:click
	>
		<slot />
	</button>
{/if}
