<script lang="ts">
	import { ticketSchema } from '$lib/SharedZod/schema';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(ticketSchema),
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
</script>

<form method="post" class="mx-auto grid w-full max-w-md gap-2 py-7" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Create New Ticket</Card.Title>
			<Card.Description></Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-2 gap-3">
				<div class="grid gap-2">
					<Form.Field {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Name</Form.Label>
								<Input {...props} type="text" bind:value={$formData.name} placeholder="Name" />
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
								<Input {...props} type="email" bind:value={$formData.email} placeholder="Email" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="phoneno">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Phone</Form.Label>
								<Input {...props} bind:value={$formData.phoneno} placeholder="Phone" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="issue">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Issue Category</Form.Label>
								<Select.Root type="single" bind:value={$formData.issue} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.issue ? $formData.issue : 'Select an Issue'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="Technical" label="Technical">Technical</Select.Item>
										<Select.Item value="Billing" label="Billing">Billing</Select.Item>
										<Select.Item value="General Inquiry" label="General Inquiry">
											General Inquiry
										</Select.Item>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="priority">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Issue Priority</Form.Label>
								<Select.Root type="single" bind:value={$formData.priority} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.priority ? $formData.priority : 'Select a priority'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="Low" label="Low">Low</Select.Item>
										<Select.Item value="Medium" label="Medium">Medium</Select.Item>
										<Select.Item value="High" label="High">High</Select.Item>
										<Select.Item value="Urgent" label="Urgent">Urgent</Select.Item>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="col-span-2 grid gap-2">
					<Form.Field {form} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Description of the Issue</Form.Label>
								<Textarea {...props} bind:value={$formData.description} placeholder="Description" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
		</Card.Content>
		<Card.Footer>
			{#if $delayed}
				<Button class="flex w-full gap-2" variant="black" disabled={$delayed}>
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</Button>
			{:else}
				<Form.Button class="w-full" variant="black" disabled={$delayed}>Submit Issue</Form.Button>
			{/if}
		</Card.Footer>
	</Card.Root>
	<!-- <SuperDebug data={$formData} /> -->
</form>
