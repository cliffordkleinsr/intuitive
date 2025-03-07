<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { id, survey }: { id: string; survey: string } = $props();
</script>

{#if survey === 'Draft'}
	<a class={buttonVariants({ variant: 'secondary' })} href="/client-console/surveys/edit/{id}">
		Edit
		<ArrowUpRight class="size-4" />
	</a>
{:else}
	<p></p>
{/if}
