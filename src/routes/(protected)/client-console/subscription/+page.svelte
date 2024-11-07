<script lang="ts">
	import type { PageData } from './$types';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Copy from 'lucide-svelte/icons/copy';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import Truck from 'lucide-svelte/icons/truck';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { getInitials } from '$lib/custom/functions/helpers';
	import FileText from 'lucide-svelte/icons/file-text';

	let { data }: { data: PageData } = $props();

	const { client_pack, AuthedUser, email } = data;
	let date: string[] = [
		new Date(client_pack.at!).toDateString(),
		new Date(client_pack.at!).toLocaleTimeString()
	];
	let expiry: string[] = [
		new Date(client_pack.expiry!).toDateString(),
		new Date(client_pack.expiry!).toLocaleTimeString()
	];
	const price = client_pack.plan!;
	const vat = Math.round(parseInt(price) * 0.16);
</script>

{#if client_pack.payment_status}
	<div id="printable" class="m-4 mx-auto w-full max-w-xl">
		<Card.Root class="w-full">
			<Card.Header class="flex w-full flex-col items-start bg-muted/50 p-4 sm:flex-row sm:p-6">
				<div class="mb-4 grid gap-0.5 sm:mb-0">
					<Card.Title class="group flex items-center gap-2 text-lg">
						<Button
							size="icon"
							variant="outline"
							class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Copy class="h-3 w-3" />
							<span class="sr-only">Copy Order ID</span>
						</Button>
					</Card.Title>
					<Card.Description class="grid gap-1">
						<span class="font-bold">Subscribed on:</span>
						{date}
						<span class="font-bold">Expires at:</span>
						{expiry}
					</Card.Description>
				</div>
				<div class="flex items-center gap-1 sm:ml-auto" id="non-printable">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} size="icon" variant="ghost" class="relative h-8 w-8">
									<EllipsisVertical class="h-3.5 w-3.5" />
									<span class="sr-only">More</span>
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<div class="" id="non-printable">
								<Button variant="ghost" class="w-full gap-3" onclick={() => window.print()}>
									<FileText class="size-4" />
									Export
								</Button>
							</div>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Card.Header>
			<Card.Content class="p-4 text-sm sm:p-6">
				<div class="grid gap-3">
					<div class="font-semibold">Order Details</div>
					<ul class="grid gap-3">
						<li class="flex items-center justify-between">
							<span class="text-muted-foreground">
								package type: {client_pack.desc}
							</span>
							<span>${Math.round(parseInt(price) - vat)}</span>
						</li>
						<li class="flex items-center justify-between">
							<span class="text-muted-foreground"> VAT </span>
							<span>${vat}</span>
						</li>
					</ul>
					<Separator class="my-2" />
					<ul class="grid gap-3">
						<li class="flex items-center justify-between">
							<span class="text-muted-foreground">Subtotal</span>
							<span>${price}</span>
						</li>
						<li class="flex items-center justify-between">
							<span class="text-muted-foreground">Tax</span>
							<span>Inclusive</span>
						</li>
						<li class="flex items-center justify-between font-semibold">
							<span class="text-muted-foreground">Total</span>
							<span>${price}</span>
						</li>
					</ul>
				</div>
				<Separator class="my-4" />
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="grid gap-3">
						<div class="font-semibold">Customer Information</div>
						<address class="grid gap-0.5 not-italic text-muted-foreground">
							<span>{AuthedUser}</span>
							<span>{client_pack.count}.</span>
							<span>{client_pack.count}, {getInitials(client_pack.count)} 12345</span>
						</address>
					</div>
					<div class="grid auto-rows-max gap-3">
						<div class="font-semibold">Billing Information</div>
						<div class="text-muted-foreground">Same as shipping address</div>
					</div>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Customer Information</div>
					<dl class="grid gap-3">
						<div class="flex items-center justify-between">
							<dt class="text-muted-foreground">Customer</dt>
							<dd>{AuthedUser}</dd>
						</div>
						<div class="flex items-center justify-between">
							<dt class="text-muted-foreground">Email</dt>
							<dd>
								<a href="mailto:">{email}</a>
							</dd>
						</div>
						<div class="flex items-center justify-between">
							<dt class="text-muted-foreground">Phone</dt>
							<dd>
								<a href="tel:">{client_pack.Phone}</a>
							</dd>
						</div>
					</dl>
				</div>
				<Separator class="my-4" />
				<div class="grid gap-3">
					<div class="font-semibold">Payment Information</div>
					<dl class="grid gap-3">
						<div class="flex items-center justify-between">
							<dt class="flex items-center gap-1 text-muted-foreground">
								<CreditCard class="h-4 w-4" />
								Mpesa
							</dt>
							<dd>**** **** ****</dd>
						</div>
					</dl>
				</div>
			</Card.Content>
			<Card.Footer
				class="flex flex-col items-center border-t bg-muted/50 px-4 py-3 sm:flex-row sm:px-6"
			>
				<div class="mb-2 text-xs text-muted-foreground sm:mb-0">
					Updated {new Date().toDateString()}
					{new Date().toLocaleTimeString()}
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
	<style lang="css">
		@media print {
			:global(body) {
				visibility: hidden;
			}
			#non-printable {
				display: none;
			}
			#printable {
				display: block;
			}
		}
	</style>
{:else}
	<div class="p-4 text-center">
		<h1 class="mb-4 text-2xl sm:text-3xl">You have not subscribed to any plan yet!</h1>
		<p class="mb-6 text-lg sm:text-xl">Subscribe to a plan in order to go live</p>
		<img
			class="mx-auto w-full max-w-md"
			src="https://i.postimg.cc/jjMJt36P/coming-soon.png"
			alt="soon"
		/>
	</div>
{/if}
