<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	// lucide
	import UserSearch from 'lucide-svelte/icons/user-search';
	import UserPen from 'lucide-svelte/icons/user-pen';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto px-4 py-8">
	<h1 class="text-center text-3xl font-semibold">Select Billing Role</h1>
	<div class="mx-auto grid max-w-3xl gap-6 py-9">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<UserPen />
					<span>Client</span>
				</Card.Title>
				<Card.Description>View Recent Client Subscriptions</Card.Description>
			</Card.Header>
			<Card.Content></Card.Content>
			<Card.Footer>
				<Button variant="secondary" class="w-full" href="/dashboard/support/billing/client"
					>Select</Button
				>
			</Card.Footer>
		</Card.Root>
		<!-- <Card.Root> -->
		<!-- <Card.Header>
				<Card.Title class="flex items-center gap-2">
					<UserSearch />
					<span>Agent</span>
				</Card.Title>
				<Card.Description>View payout requests</Card.Description>
			</Card.Header>
			<Card.Content></Card.Content>
			<Card.Footer>
				<Button variant="secondary" class="w-full">Select</Button>
			</Card.Footer>
		</Card.Root> -->
	</div>
</div>
