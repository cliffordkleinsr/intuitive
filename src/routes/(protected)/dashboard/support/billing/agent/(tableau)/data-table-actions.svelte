<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { id, status }: { id: string; status: string } = $props();
</script>

{#if status === 'pending'}
	<a
		class={buttonVariants({ variant: 'secondary', size: 'sm' })}
		href="/dashboard/support/billing/agent/{id}"
	>
		Complete
		<ArrowUpRight class="size-4" />
	</a>
{/if}
