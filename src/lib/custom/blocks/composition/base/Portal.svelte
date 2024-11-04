<script lang="ts">
	import { MediaQuery } from 'runed';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType, Snippet } from 'svelte';

    interface Shower {
        triggerText: string
        triggerIcon: ComponentType<Icon>
        title: string
        description?:string
        children?: Snippet

    }
    let { 
        triggerIcon,
        triggerText,
        title,
        description,
        children,
    }: Shower = $props()

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#if isDesktop.matches}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<triggerIcon></triggerIcon>
            {triggerText}
        </Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
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
		<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>
            <triggerIcon></triggerIcon>
            {triggerText}
        </Drawer.Trigger>
		<Drawer.Content>
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
