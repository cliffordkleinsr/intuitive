<script lang="ts">
	import { likert_options } from '$lib/custom/functions/helpers';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	export let likert_key;
	export let disabled = true;
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
	$: likert_data = likert_categories[likert_key.toLowerCase()];
</script>

{#if likert_data}
	{#each likert_data as opt, id}
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value={opt.option} {disabled} />
			<Label for={opt.option} class="text-muted-foreground">{opt.option}</Label>
		</div>
	{/each}
{:else}
	<p>Invalid Likert key.</p>
{/if}
