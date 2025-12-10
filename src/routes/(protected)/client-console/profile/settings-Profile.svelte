<script lang="ts">
	// SHADCN UI
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Select from '$lib/components/ui/select';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	// sonner
	import { toast } from 'svelte-sonner';
	// UI variants
	import { Button } from '$lib/components/ui/button/index.js';

	// SUPER FORMS
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';

	// ZOD SCHEMA
	import { profileSchema, type ProfileSchema } from './schema';
	// Local Variables
	import { sectors } from '$lib/json/index';
	import Meta from '$lib/custom/seo/meta.svelte';
	import { useId } from 'bits-ui';
	import { LocationSelector } from '$lib/components/ui/location-input';
	import { PhoneInput } from '$lib/components/ui/phone-input';

	let { data }: { data: SuperValidated<Infer<ProfileSchema>> } = $props();

	const form = superForm(data, {
		dataType: 'json',
		validators: zod4Client(profileSchema),
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

	let selectedCountry_loc = $state(null);
	let selectedState_loc = $state(null);

	const Pageprops = {
		title: 'Client Sign Up • Intuitive Insights KE',
		description:
			'Run Online Surveys Kenya, Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...Pageprops} />

<form method="post" class="m-2 mt-10" use:enhance>
	<Card.Root class="mx-auto max-w-lg">
		<Card.Header>
			<Card.Title class="text-xl text-primary">Update Profile</Card.Title>
			<Card.Description>Manage your personal information and preferences</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-4">
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Form.Field {form} name="company">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Company Name</Form.Label>
										<Input
											{...props}
											bind:value={$formData.company}
											placeholder="Input company name"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid gap-2">
							<Form.Field {form} name="phoneno">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Phone Number</Form.Label>
										<PhoneInput
											{...props}
											class="w-full"
											country="KE"
											placeholder="Enter a phone number"
											bind:value={$formData.phoneno}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</div>
				</div>
				<div>
					<Form.Field {form} name="location">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Select Country</Form.Label>
								<LocationSelector
									{...props}
									bind:selectedCountry={selectedCountry_loc}
									bind:selectedState={selectedState_loc}
									onCountryChange={(country) => {
										$formData.location.country = (country?.name as string) || '';
									}}
									onStateChange={(state) => {
										$formData.location.state = (state?.name as string) || '';
									}}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="sector">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Sectors</Form.Label>
								<Select.Root type="single" bind:value={$formData.sector} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.sector ? $formData.sector : 'Select your a sector'}
									</Select.Trigger>
									<Select.Content side="bottom">
										<ScrollArea class="h-[200px] lg:h-96">
											{#each sectors as sector}
												<Select.Item value={sector.value} label={sector.label}></Select.Item>
											{/each}
										</ScrollArea>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				{#if $delayed}
					<Button class="flex gap-2" disabled={$delayed}>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
							role="status"
							aria-label="loading"
						></span>
						Loading...
					</Button>
				{:else}
					<Form.Button>Save Changes</Form.Button>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</form>
