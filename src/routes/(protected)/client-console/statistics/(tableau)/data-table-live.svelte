<script lang="ts">
	let { id }: { id?: string } = $props();
</script>

<div>
	<span
		class="relative inline-flex items-center gap-x-1 rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/10 dark:text-teal-500"
	>
		<svg
			class="size-3 shrink-0"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
			<path d="m9 12 2 2 4-4"></path>
		</svg>
		Updating Live
		<span class="absolute end-0 top-0 -me-1.5 -mt-1.5 flex size-2">
			<span
				class="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75 dark:bg-cyan-600"
			></span>
			<span class="relative inline-flex size-2 rounded-full bg-green-500"></span>
		</span>
	</span>
</div>
