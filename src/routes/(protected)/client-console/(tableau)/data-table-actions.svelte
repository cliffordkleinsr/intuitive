<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	// export let id: string;
	// export let payment_stat: boolean;
	// export let status: string;

	interface DataActions {
		id: string;
		payment_stat: boolean;
		status: string;
	}
	let { id, payment_stat, status }: DataActions = $props();
</script>

{#if status !== 'Closed' && status !== 'Live'}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="relative h-8 w-8 p-0">
					<span class="sr-only">Open menu</span>
					<Ellipsis class="h-4 w-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
				<DropdownMenu.Item>
					<a href="/client-console/surveys/questionnaire/{id}">Manage Question</a>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			{#if payment_stat}
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<a href="/client-console/surveys/live/{id}">Go Live</a>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<a class={buttonVariants({ variant: 'secondary' })} href="/client-console/analytics/{id}">
		View
		<ArrowUpRight class="size-4" />
	</a>
{/if}
