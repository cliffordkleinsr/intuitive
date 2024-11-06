<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { id }: { id: string } = $props();
</script>

<a class={buttonVariants({ variant: 'secondary' })} href="/client-console/surveys/edit/{id}">
	View
	<ArrowUpRight class="size-4" />
</a>
