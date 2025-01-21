<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { id }: { id: string } = $props();
</script>

<a class={buttonVariants({ variant: 'secondary', size: 'sm' })} href="/dashboard/users/agents/{id}">
	View Agent
	<ArrowUpRight class="size-4" />
</a>
