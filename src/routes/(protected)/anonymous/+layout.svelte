<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

{@render children()}
<div class="relative grid place-items-center">
	<Button onclick={toggleMode} variant="ghost" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
