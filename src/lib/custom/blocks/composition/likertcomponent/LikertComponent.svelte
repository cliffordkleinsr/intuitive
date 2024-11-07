<script lang="ts">
	import { likert_options } from '$lib/custom/functions/helpers';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	let { likert_key, disabled = true }: { likert_key: string; disabled: boolean } = $props();
	type Likert = { option: string };

	const likert_categories: { [key: string]: Likert[] } = {
		agreement: likert_options.get('Agreement'),
		frequency: likert_options.get('Frequency'),
		appropriateness: likert_options.get('Appropriateness'),
		satisfaction: likert_options.get('Satisfaction'),
		reflective: likert_options.get('Reflective of me'),
		lod: likert_options.get('Level of difficulty'),
		priority: likert_options.get('Priority'),
		quality: likert_options.get('Quality'),
		importance: likert_options.get('Importance'),
		likelyhood: likert_options.get('Likelyhood')
	};

	// Access the correct likert array based on likert_key
	let likert_data = $derived(likert_categories[likert_key?.toLowerCase()]);
</script>

{#if likert_data}
	{#each likert_data as opt}
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={opt.option} {disabled} />
			<Label for={opt.option} class="text-muted-foreground">{opt.option}</Label>
		</div>
	{/each}
{:else}
	<p>Invalid Likert key.</p>
{/if}
