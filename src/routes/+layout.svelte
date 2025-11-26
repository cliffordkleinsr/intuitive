<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { getFlash } from 'sveltekit-flash-message';
	// import { page } from '$app/stores';
	import { navigating, page } from '$app/state';
	import Clockloader from '$lib/custom/blocks/spinner/Clockloader.svelte';

	const flash = getFlash(page);

	$effect(() => {
		if ($flash) {
			switch ($flash.type) {
				case 'success':
					toast.success($flash.message);
					break;
				case 'error':
					toast.error($flash.message);
					break;
				case 'info':
					toast.info($flash.message);
					break;
			}
			$flash = undefined;
		}
	});

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster position="top-right" richColors />
{#if navigating.to}
	<div class="flex min-h-screen flex-col items-center justify-center">
		<div class="mb-8">
			<Clockloader size="60" color="#FF3E00" unit="px" duration="5s" />
		</div>
		<div class="mx-auto max-w-md px-4">
			<p class="text-center text-lg font-semibold text-primary">Loading...</p>
			<!-- <p class="text-center font-semibold italic">{data.quote}</p>
			<p class="text-center text-xs italic">by {data.author}</p> -->
		</div>
	</div>
{:else}
	{@render children()}
{/if}
