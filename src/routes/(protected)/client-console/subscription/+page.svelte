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
	import { mode } from 'mode-watcher';

	let { data }: { data: PageData } = $props();
	const {
		payment,
		consumer: { businessName, businessAddressLine1, invoiceNumber, invoiceDate, expiryDates }
	} = data;
</script>

{#if payment}
	<div class="mx-auto w-full max-w-4xl rounded-lg p-20 py-10 shadow-xl">
		<!-- Header with Logo, Title, and Contact Details -->
		<div class="mb-12 flex items-center justify-between">
			<!-- Logo and Title -->
			<div class="flex items-center">
				{#if $mode === 'light'}
					<img
						src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1736234406/faviconbk_pdt2fp.ico"
						alt="Company Logo"
						class="mr-4 h-16 w-16"
					/>
				{:else}
					<img
						src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1732875705/jikwt8fpsaznpcoxdywn.ico"
						alt="Company Logo"
						class="mr-4 h-16 w-16"
					/>
				{/if}

				<h1 class="font-customHeading text-5xl font-bold">INVOICE</h1>
			</div>

			<!-- Contact Details and Address -->
			<div id="contact-details" class="text-left">
				<p class="font-customHeading font-semibold">{businessName}</p>
				<p>{businessAddressLine1}</p>
				<p></p>
			</div>
		</div>

		<div class="mb-12 flex items-start justify-between">
			<div id="billed-to" class="mt-6">
				<h2 class="font-customHeading pb-1 text-lg font-medium">BILLED TO:</h2>
				<p>{businessName}</p>
				<p>{businessAddressLine1}</p>
			</div>

			<div class="mt-6">
				<h2 class="font-customHeading pb-1 text-lg font-medium">INVOICE INFORMATION:</h2>
				<div id="invoice-info" class="grid w-80 grid-cols-2">
					<span class="text-left">Invoice Number:</span>
					<span class="text-right">{invoiceNumber}</span>

					<span class="text-left">Invoice Date:</span>
					<span class="text-right">{invoiceDate}</span>

					<span class="text-left">Expiry Dates:</span>
					<span class="text-right">{expiryDates}</span>
				</div>
			</div>
		</div>

		<div class="mb-12 flex justify-end">
			<table id="total-due" class="w-52 rounded-sm outline outline-1">
				<thead>
					<tr class="border-b">
						<th class="font-customHeading w-24 p-1 text-left font-medium">Total Due:</th>
						<th class="p-1 text-left indent-2">$99</th>
					</tr>
					<tr class="">
						<th class="font-customHeading w-24 p-1 text-left font-medium">Due Date:</th>
						<th class="p-1 text-left indent-2">{invoiceDate}</th>
					</tr>
				</thead>
			</table>
		</div>

		<div class="my-6 flex items-start justify-between">
			<div>
				<h2 class="font-customHeading pb-1 text-lg font-medium">PAYMENT INFORMATION:</h2>
				<div id="invoice-info" class="w-84 grid grid-cols-2 gap-x-2">
					<span class="text-left">Account Name:</span>
					<span class="text-left">{businessName}</span>

					<span class="text-left">Account Number:</span>
					<span class="text-left uppercase">xxxxxxxxxxx</span>
				</div>
			</div>

			<div>
				<p class="font-customHeading pb-1 text-lg font-medium">SIGNATURE:</p>
				{#if $mode === 'dark'}
					<img
						src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1740574483/signature_1_bwjxjs.png"
						alt="Signature"
						class="w-52 py-2"
					/>
				{:else}
					<img
						src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1740574226/signature_kvelcl.png"
						alt="Signature"
						class="w-52 py-2"
					/>
				{/if}
			</div>
		</div>
	</div>
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
