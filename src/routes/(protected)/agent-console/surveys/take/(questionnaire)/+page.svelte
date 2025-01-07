<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/column';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import AvailableSurvs from './[surveyId]/+page.svelte';
	import { page } from '$app/stores';
	import { MediaQuery } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();
	const isDesktop = new MediaQuery('min-width: 768px');

	const { available_qns } = data;
	let open = $state(false);

	$effect(() => {
		if ($page.state.available_survs) {
			open = true;
		} else {
			open = false;
		}
	});
	// 			controlledOpen={true}
</script>

<DataTable data={available_qns} {columns}>
	{#if isDesktop.current}
		<Dialog.Root
			bind:open
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
			bind:open
			controlledOpen={true}
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
</DataTable>
