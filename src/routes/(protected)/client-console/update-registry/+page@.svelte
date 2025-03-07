<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	// add your own path
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import PhoneInput from '$lib/components/ui/phone-input/phone-input.svelte';
	import { LocationSelector } from '$lib/components/ui/location-input';

	let open = $state(false);
	let combovalue = $state('');

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.

	import * as Select from '$lib/components/ui/select/index';
	import { zod } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import { toast } from 'svelte-sonner';
	import { useId } from 'bits-ui';
	import { closeAndFocusTrigger } from '$lib/custom/functions/helpers';
	import { counties, sectors } from '$lib/json';
	import { countyMap } from '$lib/json/subcountis';

	let {
		data
	}: {
		data: PageData;
	} = $props();

	let countryName = $state('') as string;
	let stateName = $state('') as string;
	const form = superForm(data.form, {
		dataType: 'json',
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
	const triggerId = useId();
	const { form: formData, enhance, message, delayed } = form;

	let selectedCountry: any = $state(null);
	let selectedState: any = $state(null);
</script>

<div class="flex flex-col items-center justify-center py-10">
	<h1 class="py-4 text-center text-lg text-muted-foreground">
		Update Your details before proceeding
	</h1>
	<form method="post" use:enhance class="w-full max-w-md space-y-2 p-4 lg:p-0">
		<div>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input
							{...props}
							type="email"
							bind:value={$formData.email}
							placeholder="Input your email"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div>
			<Form.Field {form} name="company">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label for="company">Company</Form.Label>
						<Input
							{...props}
							placeholder="Enter your company name"
							bind:value={$formData.company}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div>
			<Form.Field {form} name="phoneno">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label for="phoneno">Phone number</Form.Label>
						<PhoneInput
							class="w-full"
							{...props}
							country="US"
							placeholder="Enter a phone number"
							bind:value={$formData.phoneno}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div>
			<Form.Field {form} name="location">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Select Country</Form.Label>
						<LocationSelector
							{...props}
							bind:selectedCountry
							bind:selectedState
							onCountryChange={(country) => {
								countryName = country?.name || '';
								$formData.location.country = countryName || '';
							}}
							onStateChange={(state) => {
								stateName = state?.name || '';
								$formData.location.state = stateName;
							}}
						/>
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div>
			<Form.Field {form} name="sector">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label for="sector">Sector</Form.Label>
						<Select.Root type="single" bind:value={$formData.sector} {...props}>
							<Select.Trigger id="sector">
								{$formData.sector ? $formData.sector : 'Select your sector of expertise'}
							</Select.Trigger>
							<Select.Content>
								{#each sectors as sector}
									<Select.Item value={sector.value} label={sector.label}></Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<!-- <SuperDebug data={$formData} /> -->
		{#if $delayed}
			<Button class="flex w-full gap-2" variant="outline" disabled={$delayed}>
				<span
					class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
					role="status"
					aria-label="loading"
				></span>
				Loading...
			</Button>
		{:else}
			<Form.Button class="w-full" variant="outline">Save</Form.Button>
		{/if}
	</form>
</div>
