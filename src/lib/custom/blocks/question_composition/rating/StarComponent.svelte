<script lang="ts">
	let { value = $bindable(0), disabled = false, name = '', ...rest } = $props();
</script>

<div class="flex flex-row-reverse items-center justify-end gap-2">
	{#each [5, 4, 3, 2, 1] as rating}
		<input
			id="rating-{rating}"
			type="radio"
			class="peer -ms-5 size-5 cursor-pointer appearance-none border-0 bg-transparent text-transparent checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
			{name}
			{disabled}
			{value}
			onchange={() => (value = rating)}
			checked={value === rating}
			{...rest}
		/>
		<label
			for="rating-{rating}"
			class="pointer-events-none text-gray-300 peer-checked:text-yellow-400 dark:text-neutral-600 dark:peer-checked:text-yellow-600"
		>
			<svg
				class="size-5 flex-shrink-0"
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
				></path>
			</svg>
		</label>
	{/each}
</div>
