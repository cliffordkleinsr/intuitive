<script lang="ts">
	import Starsvg from './starsvg.svelte';
	const components = [5, 4, 3, 2, 1];
	export let disabled = true;
	export let checked: number = 0;
</script>

<!-- Rating -->
<div class="flex flex-row-reverse items-center justify-end gap-2">
	{#each components as cmp}
		<input
			id="hs-ratings-readonly-{cmp}"
			type="radio"
			class="peer -ms-5 size-5 cursor-pointer appearance-none border-0 bg-transparent text-transparent checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
			name="answer"
			value={cmp}
			{disabled}
			bind:group={checked}
		/>
		<label
			for="hs-ratings-readonly-{cmp}"
			class="pointer-events-none text-gray-300 peer-checked:text-yellow-400 dark:text-neutral-600 dark:peer-checked:text-yellow-600"
		>
			<Starsvg />
		</label>
	{/each}
</div>
<!-- End Rating -->
