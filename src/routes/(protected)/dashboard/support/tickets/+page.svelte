<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/columns';
	let { data }: { data: PageData } = $props();

	const surv = [
		{ id: '1', title: 'Emails', priority: 'medium', status: 'open' },
		{ id: '2', title: 'Messages', priority: 'high', status: 'closed' }
	];
</script>

<DataTable data={surv} {columns} />
