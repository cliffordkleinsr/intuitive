<script lang="ts">
	import type { PageData } from './$types';
	// base shad
	import * as Card from '$lib/components/ui/card';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';

	// superforms
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	// schema
	import { billingSchema } from './billing';
	// sonner
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(billingSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.error(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'info') {
				toast.info(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	const { phoneno } = data;
	let ref_number = $state<string>();
	if (phoneno.startsWith('+254')) {
		ref_number = '0' + phoneno.split('+254')[1];
	}
	let payment_plan: any | { plan: string; price: string; packagetype: string } = $state();
	let value = $state('4826298');
	$effect(() => {
		const plan = localStorage.getItem('aurium');
		plan && (payment_plan = JSON.parse(plan));
	});
</script>

<Button variant="outline" class="float-end m-2" href="/client-console/billing">Back</Button>
<div class="m-4 py-12">
	<Card.Root class="mx-auto w-full max-w-sm space-y-2">
		<Card.Header>
			<Card.Title>M-Pesa Paybill Payment</Card.Title>
			<Card.Description>
				You have selected the {payment_plan?.plan} plan.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">Enter Business Number</p>
			<InputOTP.Root maxlength={6} bind:value disabled textalign="center" class="font-extrabold">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 3) as cell}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
					<InputOTP.Separator />
					<InputOTP.Group>
						{#each cells.slice(3, 6) as cell}
							<InputOTP.Slot {cell} class="disabled" />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</Card.Content>
		<Card.Footer class="grid max-w-sm gap-1">
			<p class="text-sm text-muted-foreground">Enter account number</p>
			<Input class="font-extrabold" value={ref_number} disabled />
		</Card.Footer>
		<Card.Footer class="grid max-w-sm gap-1">
			<p class="text-sm text-muted-foreground">Enter amount in KES</p>
			<Input
				class="font-extrabold"
				type="number"
				value={Math.round(payment_plan?.price * 100)}
				disabled
			/>
		</Card.Footer>
		<Card.Footer class="grid max-w-sm gap-1">
			<p class="text-center text-sm text-muted-foreground">Rate is KES 100</p>
			<form action="" method="post" use:enhance>
				<Form.Field {form} name="phone">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} value={ref_number} class="hidden" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="price">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} value={Math.round(payment_plan?.price * 100)} class="hidden" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="plan">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} value={payment_plan?.plan} class="hidden" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="packagetype">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} value={payment_plan?.packagetype} class="hidden" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!-- <SuperDebug data={$formData}/> -->
				{#if $delayed}
					<Button class="flex w-full gap-2" disabled={$delayed} variant="black">
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white dark:text-black"
							role="status"
							aria-label="loading"
						></span>
						Loading...
					</Button>
				{:else}
					<Form.Button variant="black" class="w-full">Verify Payment</Form.Button>
				{/if}
			</form>
		</Card.Footer>
	</Card.Root>
</div>
