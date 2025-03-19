<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	// SUPER FORMS
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { resetSchema } from './schema';
	import { Input } from '$lib/components/ui/input';
	import { useId } from 'bits-ui';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { educations, employments, incomes } from '$lib/json';
	import { closeAndFocusTrigger } from '$lib/custom/functions/helpers';

	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';
	import { cn } from '$lib/utils';
	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetSchema),
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

	let open: boolean = $state(false);
	const triggerId = useId();
</script>

<div class="flex items-center justify-center p-4">
	<form method="post" class="grid gap-2" use:enhance>
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-xl">Update Profile and Change Password</Card.Title>
				<Card.Description>Please update your information and set a new password</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-2">
					<div class="grid gap-2 md:grid-cols-2">
						<Form.Field {form} name="dateofbirth">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Date of Birth</Form.Label>
									<Input {...props} type="date" bind:value={$formData.dateofbirth} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="phoneno">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Phone number</Form.Label>
									<Input
										{...props}
										bind:value={$formData.phoneno}
										placeholder="Add a safaricom number"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<!-- <Form.Field {form} name="county" class="grid gap-2">
							<Popover.Root bind:open>
								<Form.Control id={triggerId}>
									{#snippet children({ props })}
										<Form.Label>County Residence</Form.Label>
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
								<Popover.Content class="w-auto p-0" side="bottom">
									<Command.Root>
										<Command.Input autofocus placeholder="Search County..." class="h-9" />
										<Command.Empty>No County found.</Command.Empty>
										<Command.Group>
											<ScrollArea class="h-[200px] lg:h-96">
												{#each counties as cty}
													<Command.Item
														value={cty.name}
														onSelect={() => {
															$formData.county = cty.name;
															closeAndFocusTrigger(triggerId);
															open = !open;
														}}
													>
														{cty.name}
														<Check
															class={cn(
																'ml-auto h-4 w-4',
																cty.name !== $formData.county && 'text-transparent'
															)}
														/>
													</Command.Item>
												{/each}
											</ScrollArea>
										</Command.Group>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="subctys">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Sub-County</Form.Label>
									<Select.Root type="single" bind:value={$formData.subctys} name={props.name}>
										<Select.Trigger {...props}>
											{$formData.subctys ? $formData.subctys : 'Select your area sub-county'}
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
						</Form.Field> -->

						<Form.Field {form} name="income">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Income</Form.Label>
									<Select.Root type="single" bind:value={$formData.income} name={props.name}>
										<Select.Trigger {...props}>
											{$formData.income ? $formData.income : 'Select an income bracket'}
										</Select.Trigger>
										<Select.Content>
											{#each incomes as income}
												<Select.Item value={income.label} label={income.label}></Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="employment">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Employment</Form.Label>
									<Select.Root type="single" bind:value={$formData.employment} name={props.name}>
										<Select.Trigger {...props}>
											{$formData.employment ? $formData.employment : 'Select an employment bracket'}
										</Select.Trigger>
										<Select.Content>
											{#each employments as employment}
												<Select.Item value={employment.label} label={employment.label}
												></Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Field {form} name="referal">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Referral</Form.Label>
								<Input
									{...props}
									bind:value={$formData.referal}
									placeholder="Specify who referred you"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="education" class="w-76">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Education</Form.Label>
								<Select.Root type="single" bind:value={$formData.education} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.education ? $formData.education : 'Select an education bracket'}
									</Select.Trigger>
									<Select.Content>
										{#each educations as education}
											<Select.Item value={education.label} label={education.label}></Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="sector">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Sector</Form.Label>
								<Input
									{...props}
									bind:value={$formData.sector}
									placeholder="Specify a sector of expertise"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="grid gap-2">
						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>New Password</Form.Label>
									<Input
										{...props}
										type="password"
										bind:value={$formData.password}
										placeholder="New Password"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="passwordConfirm">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm New Password</Form.Label>
								<Input
									{...props}
									type="password"
									bind:value={$formData.passwordConfirm}
									placeholder="Confirm New Password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<!-- <SuperDebug data={$formData} /> -->
			</Card.Content>
			<Card.Footer>
				{#if $delayed}
					<Button class="flex w-full gap-2 " disabled={$delayed}>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
							role="status"
							aria-label="loading"
						></span>
						Loading...
					</Button>
				{:else}
					<Form.Button variant="black" class="w-full"
						>Update Profile And Change Password</Form.Button
					>
				{/if}
			</Card.Footer>
		</Card.Root>
	</form>
</div>
