<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';

	let { options, preselectedRanks = [] }: { options: string[]; preselectedRanks: number[] } =
		$props();

	let rankings = $state(options.map(() => 0)) as number[];
	$effect(() => {
		rankings = options.map((opt, index) => {
			const preselectedRank = preselectedRanks[index];
			return preselectedRank ? preselectedRank : 0;
		});
	});

	function setRank(index: number, rank: number) {
		if (rankings[index] === rank) {
			// If the same rank is clicked again, unset it
			rankings[index] = 0;
		} else {
			// Clear the rank from any other option
			rankings = rankings.map((r) => (r === rank ? 0 : r));
			// Set the new rank for the selected option
			rankings[index] = rank;
		}
		rankings = [...rankings];
	}
</script>

{#each options as opt, id}
	<Label for="option">{opt}</Label>
	<div class="grid max-w-lg grid-cols-5 gap-1">
		{#each [1, 2, 3, 4, 5] as rank}
			<Button
				variant="secondary"
				size="icon"
				class={rankings[id] === rank ? 'bg-green-500' : ''}
				onclick={() => setRank(id, rank)}
				disabled
			>
				{rank}
			</Button>
		{/each}
		<Input value={rankings[id]} name="rankId" class="hidden" />
		<Input value={opt} name="option" class="hidden" />
	</div>
{/each}
