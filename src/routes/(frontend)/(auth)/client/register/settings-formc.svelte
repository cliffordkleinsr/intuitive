<script lang="ts">
	// Store
	// SHADCN UI
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Select from '$lib/components/ui/select';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	// Extras
	import { PhoneInput } from '$lib/components/ui/phone-input';
	// sonner
	import { toast } from 'svelte-sonner';

	// Lucid Icons
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';

	// UI variants
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	// SUPER FORMS
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';

	// ZOD SCHEMA
	import { registerCSchema, type RegisterCSchema } from './schema';

	// Local Variables
	import { closeAndFocusTrigger } from '$lib/custom/functions/helpers';
	import { sectors } from '$lib/json/index';
	import Meta from '$lib/custom/seo/meta.svelte';
	import { useId } from 'bits-ui';
	import { LocationSelector } from '$lib/components/ui/location-input';

	// KitLoad<MiddleWare>
	// export let data: SuperValidated<Infer<RegisterCSchema>>;
	let { data }: { data: SuperValidated<Infer<RegisterCSchema>> } = $props();

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(registerCSchema),
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

	let selectedCountry_loc = $state(null);
	let selectedState_loc = $state(null);
	// command
	let open: boolean = $state(false);

	const Pageprops = {
		title: 'Client Sign Up • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...Pageprops} />
<div class="mb-5 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Page>Client Registration</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>

<form method="post" class="m-2" use:enhance>
	<Card.Root class="mx-auto max-w-lg">
		<Card.Header>
			<Card.Title class="text-xl text-primary">Sign Up</Card.Title>
			<Card.Description>Create a Client account to begin gathering insights</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-4 lg:grid-cols-2">
					<div class="grid gap-2">
						<Form.Field {form} name="fullname">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Full Name</Form.Label>
									<Input
										{...props}
										bind:value={$formData.fullname}
										placeholder="Input your fullname"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="grid gap-2">
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
				</div>
				<div class="grid gap-4">
					<div class="grid gap-4 lg:grid-cols-2">
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
				<div class="grid gap-2">
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Password</Form.Label>
								<Input
									{...props}
									type="password"
									bind:value={$formData.password}
									placeholder="Input password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="passwordConfirm">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm Password</Form.Label>
								<Input
									{...props}
									type="password"
									bind:value={$formData.passwordConfirm}
									placeholder="Confirm password"
								/>
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
					<Form.Button>Create an account</Form.Button>
				{/if}
				<!-- <Button type="submit" class="w-full">t</Button> -->
				<!-- <Button variant="outline" class="w-full">Sign up with Google</Button> -->
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/client/login" class="underline hover:text-primary"> Log in </a>
			</div>
		</Card.Content>
		<!-- <SuperDebug data={$formData} /> -->
	</Card.Root>
</form>
