<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	let { options, ...rest }: { options: string[] } = $props();
	let rankings: any = $state([]);

	rankings = options.map(() => 0);

	function setRank(index: number, rank: number) {
		if (rankings[index] === rank) {
			// If the same rank is clicked again, unset it
			rankings[index] = 0;
		} else {
			// Clear the rank from any other option
			rankings = rankings.map((r: number) => (r === rank ? 0 : r));
			// Set the new rank for the selected option
			rankings[index] = rank;
		}
		rankings = [...rankings];
	}
	function isRankDisabled(rank: number) {
		return rankings.includes(rank);
	}
</script>

{#each options as opt, id}
	<Label for="option">{opt}</Label>
	<div class="grid max-w-lg grid-cols-5 gap-1">
		{#each [1, 2, 3, 4, 5] as rank}
			{#if rankings[id] !== rank}
				<Button
					variant="secondary"
					size="icon"
					onclick={(e) => {
						e.preventDefault();
						setRank(id, rank);
					}}
					disabled={rankings[id] !== rank && isRankDisabled(rank)}
				>
					{rank}
				</Button>
			{:else}
				<Button
					variant="secondary"
					size="icon"
					class="bg-primary text-white"
					onclick={(e) => {
						e.preventDefault();
						setRank(id, rank);
					}}
					disabled={rankings[id] !== rank && isRankDisabled(rank)}
				>
					{rank}
				</Button>
			{/if}
		{/each}
		<Input value={rankings[id]} name="rankId" class="hidden" />
		<Input value={opt} name="option" class="hidden" />
	</div>
{/each}
