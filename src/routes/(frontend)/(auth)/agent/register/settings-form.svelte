<script lang="ts">
	// SHADCN UI
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	// sonner
	import { toast } from 'svelte-sonner';
	// ZOD SCHEMA
	import { counties, registerRSchema, type RegisterRSchema } from './schema';

	// Lucid Icons
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';
	import * as Select from '$lib/components/ui/select';

	// UI variants
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { CalendarIcon } from 'lucide-svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	// SUPER FORMS
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';

	// DatePicker Utils
	import {
		CalendarDate,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';

	// Local Variables
	import { incomes, employments, educations, sectors, gender } from '$lib/json/index';
	import { items, df, closeAndFocusTrigger } from '$lib/custom/functions/helpers';
	import type { Snapshot } from './$types';
	import Meta from '$lib/custom/seo/meta.svelte';
	import { countyMap } from '$lib/json/subcountis';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { useId } from 'bits-ui';

	// KitLoad<MiddleWare>
	export let data: SuperValidated<Infer<RegisterRSchema>>;

	const form = superForm(data, {
		validators: zodClient(registerRSchema),
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

	// formData.update(
	//   ($formData) => {
	//     $formData.income = "0 - 10000"
	//     $formData.sector = "Others"
	//     return $formData
	//   },
	//   { taint : false }
	// )
	// export const snapshot:Snapshot = {
	//   capture: () => formData,
	//   restore: (value) => (formData.set(value))
	// }
	// DatePicker

	let value: DateValue | undefined;

	// Reactive Props for select inputs
	// County
	let previousCounty = '';

	$: if ($formData.county !== previousCounty) {
		$formData.subctys = 'Select your area sub-county';
		previousCounty = $formData.county;
	}
	// // Student
	$: if ($formData.employment === 'Student') {
		$formData.income = '0 - 10000';
	}
	// Unemployed
	$: if ($formData.employment === 'Unemployed' || $formData.employment === 'Student') {
		$formData.sector = 'Others';
	}
	// Ozers
	$: value = $formData.dateofbirth ? parseDate($formData.dateofbirth) : undefined;
	$: selectedGender = $formData.gender
		? {
				label: $formData.gender,
				value: $formData.gender
			}
		: undefined;
	$: selectedScty = $formData.subctys
		? {
				label: $formData.subctys,
				value: $formData.subctys
			}
		: undefined;
	$: selectedEmployment = $formData.employment
		? {
				label: $formData.employment,
				value: $formData.employment
			}
		: undefined;
	$: selectedIncome = $formData.income
		? {
				label: $formData.income,
				value: $formData.income
			}
		: undefined;
	$: selectedEducation = $formData.education
		? {
				label: $formData.education,
				value: $formData.education
			}
		: undefined;
	$: selectedSector = $formData.sector
		? {
				label: $formData.sector,
				value: $formData.sector
			}
		: undefined;

	// let ital = today(getLocalTimeZone()).subtract({years: 18})
	let open: boolean = false;
	let lender = false;
	const props = {
		title: 'Agent Sign Up • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
	const triggerId = useId();
	// console.log('Select an income bracket'.length)
</script>

<Meta {...props} />

<div class="mb-5 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/agent/signin">Agent SignIn</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Page>Agent Registration</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
<div class="mb-16 mt-5 h-full w-full">
	<!-- <SuperDebug data={$formData}/> -->
	<form method="post" class="m-2" use:enhance>
		<Card.Root class="mx-auto max-w-md lg:mx-auto lg:max-w-xl">
			<Card.Header>
				<Card.Title class="text-xl text-primary">Sign Up</Card.Title>
				<Card.Description>Create a Agent account to start earning</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-4 lg:grid-cols-2">
						<div class="grid gap-2">
							<Form.Field {form} name="fullname">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Full Name</Form.Label>
										<Input {...props} bind:value={$formData.fullname} />
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
										<Input {...props} type="email" bind:value={$formData.email} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</div>
	
					<div class="grid gap-4">
						<div class="grid gap-4 lg:grid-cols-2">
							<div class="grid gap-2">
								<Form.Field {form} name="phoneno">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Phone Number</Form.Label>
											<Input {...props} bind:value={$formData.phoneno} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<div class="grid gap-2">
								<Form.Field {form} name="gender">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Gender</Form.Label>
											<Select.Root
												type="single"
												bind:value={$formData.gender}
												name={props.name}
											>
												<Select.Trigger {...props}>
													{$formData.gender ?? "Select your Gender"}
												</Select.Trigger>
												<Select.Content>
													{#each gender as gen}
														<Select.Item value={gen.label} label={gen.label}></Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<div class="grid gap-2">
								<Form.Field {form} name="dateofbirth" class="grid gap-2">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Date of birth</Form.Label>
											<Popover.Root bind:open={lender}>
												<Popover.Trigger
													{...props}
													class={cn(
														buttonVariants({ variant: 'outline' }),
														'w-[250px] justify-start pl-4 text-left font-normal',
														!value && 'text-muted-foreground'
													)}
												>
													{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
													<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
												</Popover.Trigger>
												<Popover.Content class="w-auto p-0" side="bottom">
													<Calendar
														type="single"
														value={value as DateValue}
														minValue={new CalendarDate(1900, 1, 1)}
														maxValue={today(getLocalTimeZone())}
														calendarLabel="Date of birth"
														initialFocus
														onValueChange={(v) => {
															if (v) {
																$formData.dateofbirth = v.toString();
															} else {
																$formData.dateofbirth = '';
															}
														}}
													/>
												</Popover.Content>
											</Popover.Root>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<div class="grid gap-2">
								<Form.Field {form} name="education" class="w-76">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Education</Form.Label>
											<Select.Root
												type="single"
												bind:value={$formData.education}
												name={props.name}
											>
												<Select.Trigger {...props}>
													{$formData.education ?? "Select an Education bracket"}
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
							</div>
						</div>
					</div>
	
					<div class="grid gap-2">
						<div class="grid gap-4 lg:grid-cols-2">
							<div class="grid gap-2">
								<Form.Field {form} name="county">
									<Popover.Root bind:open>
										<Form.Control id={triggerId}>
											{#snippet children({ props })}
												<Form.Label>County Residence</Form.Label>
												<Popover.Trigger
													class={cn(
														buttonVariants({ variant: 'outline' }),
														'w-[200px] justify-between',
														!$formData.county && 'text-muted-foreground'
													)}
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
							</div>
							<div class="grid gap-2">
								<Form.Field {form} name="subctys">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Sub-County</Form.Label>
											<Select.Root
												type="single"
												bind:value={$formData.subctys}
												name={props.name}
											>
												<Select.Trigger {...props}>
													{$formData.subctys ?? "Select your area sub-county"}
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
	
					<div class="grid gap-2">
						<div class="grid gap-4 lg:grid-cols-2">
							<div class="grid gap-2 {$formData.employment === 'Student' ? 'col-span-2' : ''}">
								<Form.Field {form} name="employment">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Employment</Form.Label>
											<Select.Root
												type="single"
												bind:value={$formData.employment}
												name={props.name}
											>
												<Select.Trigger {...props}>
													{$formData.employment ?? "Select an Employment bracket"}
												</Select.Trigger>
												<Select.Content>
													{#each employments as employment}
														<Select.Item value={employment.label} label={employment.label}></Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							{#if $formData.employment !== 'Student'}
								<div
									class="grid gap-2"
									transition:fly={{ x: 100, duration: 400, easing: quintOut }}
								>
									<Form.Field {form} name="income">
										<Form.Control>
											{#snippet children({ props })}
												<Form.Label>Income</Form.Label>
												<Select.Root
													type="single"
													bind:value={$formData.income}
													name={props.name}
												>
													<Select.Trigger {...props}>
														{$formData.income ?? "Select an income bracket"}
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
								</div>
							{/if}
						</div>
					</div>
	
					{#if $formData.employment === 'Student' || $formData.employment === 'Unemployed'}
						<p></p>
					{:else}
						<div class="grid gap-2" transition:fly={{ y: 100, duration: 400, easing: quintOut }}>
							<Form.Field {form} name="sector">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Sectors</Form.Label>
										<Select.Root
											type="single"
											bind:value={$formData.sector}
											name={props.name}
										>
											<Select.Trigger {...props}>
												{$formData.sector ?? "Select a Sector"}
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
					{/if}
	
					<div class="grid gap-2">
						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password</Form.Label>
									<Input {...props} type="password" bind:value={$formData.password} />
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
									<Input {...props} type="password" bind:value={$formData.passwordConfirm} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					{#if $delayed}
						<Button class="flex gap-2">
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
				</div>
				<div class="mt-4 text-center text-sm">
					Already have an account?
					<a href="/agent/signin" class="underline hover:text-primary"> Sign in </a>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
