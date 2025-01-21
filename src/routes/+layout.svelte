<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

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
{@render children()}
