<script lang="ts" generics="T">
	import { MediaQuery } from 'runed';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';

	interface Shower {
		trigger: Snippet<[any]>;
		children?: Snippet;
	}
	let { trigger, children }: Shower = $props();

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#if isDesktop.matches}
	<Dialog.Root bind:open>
		<Dialog.Trigger>
			{#snippet child({ props })}
				{@render trigger({ props })}
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title></Dialog.Title>
				<Dialog.Description>
					{@render children?.()}
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				{@render trigger({ props })}
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title></Drawer.Title>
				<Drawer.Description>
					{@render children?.()}
				</Drawer.Description>
			</Drawer.Header>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
