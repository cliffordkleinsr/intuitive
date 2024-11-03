<script lang="ts">
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import AvailableSurvs from '../[surveyId]/+page.svelte';

	import { MediaQuery } from 'runed';
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
	const isDesktop = new MediaQuery('(min-width: 768px)');
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

{#if isDesktop.matches}
	<Dialog.Root
		{open}
		onOpenChange={(open) => {
			if (!open) {
				history.back();
			}
		}}
	>
		<Dialog.Content class="max-w-md lg:max-w-2xl">
			<AvailableSurvs data={$page.state.available_survs} />
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root
		{open}
		onOpenChange={(open) => {
			if (!open) {
				history.back();
			}
		}}
	>
		<Drawer.Content>
			<AvailableSurvs data={$page.state.available_survs} />
		</Drawer.Content>
	</Drawer.Root>
{/if}
