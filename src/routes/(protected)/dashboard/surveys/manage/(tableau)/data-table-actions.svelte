<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Button } from '$lib/components/ui/button/index.js';

	let { id }: { id: string } = $props();
</script>

<!-- <a class={[buttonVariants({ variant: 'secondary' })]} href="/dashboard/surveys/manage/{id}">
	
</a> -->
<Button variant="secondary" disabled={true}>
	Edit <ArrowUpRight class="size-4" />
</Button>
