<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/column';

	let { data }: { data: PageData } = $props();

	const { available_qns } = data;
</script>

<DataTable data={available_qns} {columns} />
