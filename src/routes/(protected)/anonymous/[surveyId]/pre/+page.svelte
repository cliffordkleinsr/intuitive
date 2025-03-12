<script lang="ts">
	import type { PageData } from './$types';
	import { useGeolocation } from 'runed';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';

	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import { toast } from 'svelte-sonner';
	import { educations } from '$lib/json';
	import { LocationSelector } from '$lib/components/ui/location-input';

	let { data }: { data: PageData } = $props();
	const { uri } = data;
	let countryName = $state('') as string;
	let stateName = $state('') as string;
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(schema),
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

	let { form: formData, enhance, message, delayed } = form;

	let selectedCountry: any = $state(null);
	let selectedState: any = $state(null);

	$effect(() => {
		if (!navigator.geolocation) toast.info('Geolocation is not supported by your browser');
		const pos = navigator.geolocation.getCurrentPosition((position) => {
			$formData.location = position.coords;
		});

		$formData.uri = uri;
		return () => {
			countryName = '';
			stateName = '';
			selectedCountry = null;
			selectedState = null;
		};
	});
</script>

<div class="mx-auto max-w-xl px-5 py-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Before you begin</Card.Title>
			<Card.Description>
				<p>We kindly ask that you accept any propmts requested for this page</p>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance class="w-full space-y-2 p-4 lg:p-0">
				<div>
					<Form.Field {form} name="education">
						<Form.Control>
							{#snippet children({ props })}
								<Label class="font-medium">Education Background</Label>
								<Select.Root type="single" bind:value={$formData.education} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.education
											? $formData.education
											: 'Kindly tell us more about youreducational background'}
									</Select.Trigger>
									<Select.Content>
										{#each educations as education}
											<Select.Item value={education.label} label={education.label} />
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				<div>
					<Form.Field {form} name="sector">
						<Form.Control>
							{#snippet children({ props })}
								<Label class="font-medium">Sector</Label>
								<Input
									{...props}
									type="text"
									placeholder="Please tell us more about your sector of expertise"
									bind:value={$formData.sector}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				<div>
					<Form.Field {form} name="loc">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Select Country</Form.Label>
								<LocationSelector
									{...props}
									bind:selectedCountry
									bind:selectedState
									onCountryChange={(country) => {
										countryName = country?.name || '';
										$formData.loc.country = countryName || '';
									}}
									onStateChange={(state) => {
										stateName = state?.name || '';
										$formData.loc.state = stateName;
									}}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div>
					<Form.Field {form} name="location">
						<Form.Control>
							{#snippet children({ props })}
								<Input {...props} type="text" bind:value={$formData.location} class="hidden" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				<div>
					<Form.Field {form} name="uri">
						<Form.Control>
							{#snippet children({ props })}
								<Input {...props} type="text" bind:value={$formData.uri} class="hidden" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-sm text-destructive" />
					</Form.Field>
				</div>
				<div class="py-2">
					{#if $delayed}
						<Button class="flex w-full gap-2" variant="secondary" disabled={$delayed}>
							<span
								class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
								role="status"
								aria-label="loading"
							></span>
							Loading...
						</Button>
					{:else}
						<Form.Button class="w-full" variant="secondary" type="submit"
							>Begin the survey</Form.Button
						>
					{/if}
				</div>
			</form>
			<!-- <SuperDebug data={$formData} /> -->
		</Card.Content>
		<Card.Footer></Card.Footer>
	</Card.Root>
</div>
