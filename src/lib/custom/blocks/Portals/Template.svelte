<script lang="ts" generics="T">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { buttonVariants, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { MediaQuery } from 'svelte/reactivity';
	import type { WithElementRef } from 'bits-ui';

	interface Shower {
		class?: string | null | undefined;
		title: string;
		description?: string;
		variant?: WithElementRef<ButtonVariant>;
		disabled?: boolean;
		children?: Snippet;
		onclick?: () => any;
	}
	let {
		class: classname = 'sm:max-w-[425px]',
		title,
		description,
		variant = 'outline',
		disabled = false,
		children,
		onclick
	}: Shower = $props();

	let open = $state(false);
	const isDesktop = new MediaQuery('min-width: 768px');
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger {onclick}>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>
					Preview Questions
					<ArrowUpRight />
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class={classname}>
			<Dialog.Header>
				<Dialog.Title>
					{title}
				</Dialog.Title>
				<Dialog.Description>
					{description}
				</Dialog.Description>
			</Dialog.Header>
			{@render children?.()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger {onclick}>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>
					Use Available Templates
					<ArrowUpRight />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content class={cn(classname)}>
			<Drawer.Header class="text-left">
				<Drawer.Title>
					{title}
				</Drawer.Title>
				<Drawer.Description>
					{description}
				</Drawer.Description>
			</Drawer.Header>
			{@render children?.()}
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
