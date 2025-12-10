<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import type { PageData } from './$types';
	import { columns } from './(tableau)/columns';

	let { data }: { data: PageData } = $props();
	const { surv } = data;
</script>

<div class="h-full">
	<DataTable data={surv} {columns} no_page={true} />
</div>
