<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import Clock from '$lib/custom/blocks/clock.svelte';
	import type { PageData, ActionData } from './$types.js';
	import { goto } from '$app/navigation';
	import { addMonths } from '$lib/custom/functions/helpers.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import { schema } from './schema.js';

	let {
		data
	}: {
		data: PageData;
	} = $props();

	const { consumer_details } = data;

	const form = superForm(data.form, {
		validators: zodClient(schema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.error(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="m-4 flex flex-col items-center justify-center gap-5 lg:m-16">
	<form method="post" class="grid w-full max-w-2xl space-y-2 p-4 lg:p-0" use:enhance>
		<Card.Root class="col-span-2">
			<Card.Header>
				<Card.Title>Generate a survey</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<div>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="font-medium">Survey Title</Form.Label>
								<Input
									{...props}
									type="text"
									placeholder="Give your survey a title"
									bind:value={$formData.title}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				<div>
					<Form.Field {form} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="font-medium">Description</Form.Label>
								<Textarea
									{...props}
									name="description"
									id="description"
									placeholder="Give your survey a description"
									bind:value={$formData.description}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				{#if consumer_details.surveys > 0}
					<div
						class="mt-2 rounded-lg bg-red-500 p-4 text-sm text-white"
						role="alert"
						tabindex="-1"
						aria-labelledby="hs-solid-color-danger-label"
					>
						<span id="hs-solid-color-danger-label" class="font-bold">Error!</span>
						You have exceeded your survey limit for your current subscription!
					</div>
				{:else if $delayed}
					<Button class="flex w-full gap-2" disabled={$delayed}>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
							role="status"
							aria-label="loading"
						></span>
						Loading...
					</Button>
				{:else}
					<Form.Button class="w-full">Submit</Form.Button>
				{/if}
			</Card.Content>
		</Card.Root>

		<Button class="" variant="outline" href="/client-console">Cancel</Button>

		<!-- <Button variant="outline" on:click={addData} on:click={() => active=false}>Save</Button> -->
	</form>
</div>
