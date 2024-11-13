<script lang="ts">
	import { VornoMap } from '$lib/custom/blocks';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { world, capitals } = data;
</script>

<h1 class="text-center text-xl">Global Analytics Coming Soon</h1>
<div class="hidden h-[80vh] lg:block">
	<VornoMap {world} {capitals} />
</div>
