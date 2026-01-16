<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/columns';

	let { data }: { data: PageData } = $props();
	const { client_list } = data;
</script>

<div class="h-[240dvh]">
	<DataTable data={client_list} {columns} filter="name" no_page={true} />
</div>
