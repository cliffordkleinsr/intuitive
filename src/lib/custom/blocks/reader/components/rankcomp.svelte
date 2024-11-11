<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { rankBuilder, type RankSchema } from '../super_schema';
	import { Input } from '$lib/components/ui/input';

	let {
		data,
		question,
		options,
		cur_id
	}: {
		data: SuperValidated<Infer<RankSchema>>;
		question: string;
		options: string[];
		cur_id: string;
	} = $props();

	const rankSchema = rankBuilder(options);
	const form = superForm(data, {
		id: cur_id,
		validators: zodClient(rankSchema),
		onUpdated: () => {
			if (!$message) return;
			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.success(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
	// Define the rank type to match the enum
	type RankValue = '1' | '2' | '3' | '4' | '5';
	const RANKS: RankValue[] = ['1', '2', '3', '4', '5'];
	// Initialize `selectedRanks` with `null` values for each option
	// Keep track of temporary null states without affecting the form data
	let tempNulls: Record<string, boolean> = $state({});

	// Function to check if a rank is already used
	function isRankTaken(currentAspect: string, rank: RankValue) {
		return Object.entries($formData).some(
			([aspect, value]) => aspect !== currentAspect && !tempNulls[aspect] && value === rank
		);
	}

	// Function to handle rank selection
	function setRank(aspect: string, rank: RankValue) {
		if ($formData[aspect] === rank) {
			// If the same rank is clicked again, we need to handle the temporary null state
			tempNulls[aspect] = true;
			$formData[aspect] = 'null';
			tempNulls[aspect] = false;
		} else {
			// Set the new rank for the selected aspect
			tempNulls[aspect] = false;
			$formData[aspect] = rank;
		}
	}
</script>

<form action="?/rankform" method="POST" class="absolute inset-auto top-20 m-5" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>{question}</Card.Title>
			<Card.Description
				>Please rate the following aspects on a scale of 1 (high) to 5 (low)</Card.Description
			>
		</Card.Header>
		<Card.Content>
			{#each options as aspect}
				<Form.Field {form} name={aspect}>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{aspect}</Form.Label>
							<div class="grid grid-cols-5 gap-1 lg:max-w-lg">
								{#each RANKS as rank}
									{@const isSelected = !tempNulls[aspect] && $formData[aspect] === rank}
									{@const isDisabled = !isSelected && isRankTaken(aspect, rank)}
									<Button
										{...props}
										type="button"
										variant={isSelected ? 'default' : 'secondary'}
										size="icon"
										disabled={isDisabled}
										class={isSelected ? 'bg-primary text-primary-foreground' : ''}
										onclick={() => setRank(aspect, rank)}
									>
										{rank}
									</Button>
									<Input {...props} bind:value={$formData[aspect]} class="hidden" />
								{/each}
							</div>
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
			{/each}
		</Card.Content>
		<Card.Footer>
			{#if $delayed}
				<Button class="flex w-full gap-2" variant="outline">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent dark:text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</Button>
			{:else}
				<Form.Button variant="outline" class="w-full">
					<CheckCheck />
					Submit
				</Form.Button>
			{/if}
		</Card.Footer>
	</Card.Root>
	<!-- <SuperDebug data={$formData} /> -->
</form>
