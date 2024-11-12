<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	// lucide
	import CheckCheck from 'lucide-svelte/icons/check-check';
	// superforms
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { multipleSchema, type MultipleSchema } from '../super_schema';
	// sonner
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';

	let {
		data,
		question,
		optionid,
		options,
		cur_id
	}: {
		data: SuperValidated<Infer<MultipleSchema>>;
		question: string;
		optionid: string[];
		options: string[];
		cur_id: string;
	} = $props();

	const combined = optionid.map((id, index) => ({
		id: id,
		label: options[index]
	}));
	const form = superForm(data, {
		id: cur_id,
		dataType: 'json',
		validators: zodClient(multipleSchema),
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

	function addItem(id: string, label: string) {
		$formData.items = [...$formData.items, { id, label }];
	}

	function removeItem(id: string) {
		$formData.items = $formData.items.filter((i) => i.id !== id);
	}
</script>

<form action="?/checkboxMultiple" method="POST" class="w-2/3 space-y-6 lg:w-1/4" use:enhance>
	<Form.Fieldset {form} name="items" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="py-1 text-base">{question}</Form.Legend>
			<Form.Description>Select all that are applicable.</Form.Description>
		</div>
		<div class="space-y-2">
			{#each combined as item}
				{@const checked = $formData.items.some((i) => i.id === item.id)}
				<div class="flex flex-row items-start space-x-3">
					<Form.Control>
						{#snippet children({ props })}
							<Checkbox
								{...props}
								{checked}
								value={item.id}
								onCheckedChange={(v) => {
									if (v) {
										addItem(item.id, item.label);
									} else {
										removeItem(item.id);
									}
								}}
							/>
							<Form.Label class="font-normal">
								{item.label}
							</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
			{/each}
			<Form.FieldErrors />
		</div>
	</Form.Fieldset>
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
			Next
		</Form.Button>
	{/if}
	<!-- <SuperDebug data={$formData} /> -->
</form>
