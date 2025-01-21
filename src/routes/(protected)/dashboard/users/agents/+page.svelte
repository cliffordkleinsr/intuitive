<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/columns';

	let { data }: { data: PageData } = $props();
	const { agent_list } = data;
</script>

<DataTable data={agent_list} {columns} filter="name" />
