<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	// add your own path
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import PhoneInput from '$lib/components/ui/phone-input/phone-input.svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Command from '$lib/components/ui/command/index';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';

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
	const triggerId = useId();
	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center">
	<h1 class="text-center text-2xl">Update Your details before proceeding</h1>
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
							country="KE"
							placeholder="Enter a phone number"
							bind:value={$formData.phoneno}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid gap-2">
			<div class="grid gap-4 lg:grid-cols-2">
				<div class="grid gap-2">
					<Form.Field {form} name="county">
						<Popover.Root bind:open>
							<Form.Control id={triggerId}>
								{#snippet children({ props })}
									<Form.Label>Company Location</Form.Label>
									<Popover.Trigger
										class={[
											buttonVariants({ variant: 'outline' }),
											'w-[200px] justify-between',
											!$formData.county && 'text-muted-foreground'
										]}
										role="combobox"
										{...props}
									>
										{counties.find((f) => f.name === $formData.county)?.name ?? 'Select a County'}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Popover.Trigger>
									<input hidden value={$formData.county} name={props.name} />
								{/snippet}
							</Form.Control>
							<Popover.Content align="start" class="w-full p-0">
								<Command.Root>
									<Command.Input placeholder="Select your area of operation" class="h-9" />
									<Command.List>
										<Command.Empty>No framework found.</Command.Empty>
										<Command.Group>
											{#each counties as cty}
												<Command.Item
													value={cty.name}
													onSelect={() => {
														combovalue = cty.name;
														$formData.county = cty.name;
														closeAndFocusTrigger(triggerId);
													}}
												>
													<Check class={cn(cty.name !== $formData.county && 'text-transparent')} />
													{cty.name}
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="subctys">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label for="subctys">Sub county</Form.Label>
								<Select.Root type="single" bind:value={$formData.subctys} {...props}>
									<Select.Trigger id="subctys">
										{$formData.subctys ? $formData.subctys : 'select your area sub-county'}
									</Select.Trigger>
									<Select.Content>
										{#if countyMap.has($formData.county)}
											{@const ctys = countyMap.get($formData.county)}
											{#each ctys as ct}
												<Select.Item value={ct} label={ct}></Select.Item>
											{/each}
										{/if}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
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
