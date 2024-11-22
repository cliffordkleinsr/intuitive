<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	const { phoneno } = $derived(data);
	let payment_plan: any | { plan: string; price: string } = $state();
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
		<form
			action=""
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<Card.Footer class="grid max-w-sm gap-1">
				<p class="text-sm text-muted-foreground">Enter account number</p>
				<Input class="font-extrabold" value={phoneno} disabled />
				<input type="text" value={phoneno} name="phone" hidden />
			</Card.Footer>
			<Card.Footer class="grid max-w-sm gap-1">
				<p class="text-sm text-muted-foreground">Enter amount in KES</p>
				<Input
					class="font-extrabold"
					type="number"
					value={Math.round(payment_plan?.price * 100)}
					disabled
				/>
				<input type="number" name="price" value={Math.round(payment_plan?.price * 100)} hidden />
				<input type="text" name="plan" value={payment_plan?.plan} hidden />
			</Card.Footer>
			<Card.Footer class="grid max-w-sm gap-1">
				<p class="text-center text-sm text-muted-foreground">Rate is KES 100</p>
				<Button variant="black" type="submit">Verify Payment</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
