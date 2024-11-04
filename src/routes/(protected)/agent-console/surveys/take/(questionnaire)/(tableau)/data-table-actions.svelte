<script lang="ts">
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { id }: { id: string } = $props();

	async function onLinkClick(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		if (e.metaKey || e.ctrlKey) return;
		e.preventDefault();

		const { href } = e.currentTarget;
		const result = await preloadData(href);
		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, {
				available_survs: result.data,
				profile: undefined,
				clients: undefined
			});
		} else {
			goto(href);
		}
	}

	let open = $state(false);
	$effect(() => {
		if ($page.state.available_survs) {
			open = true;
		} else {
			open = false;
		}
	});
</script>

<a
	class={buttonVariants({ variant: 'secondary' })}
	onclick={onLinkClick}
	href="/agent-console/surveys/take/{id}"
>
	Take
	<ArrowUpRight class="size-4" />
</a>
