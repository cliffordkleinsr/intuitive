<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Copy from 'lucide-svelte/icons/copy';
	import CopyCheck from 'lucide-svelte/icons/copy-check';
	import { page } from '$app/state';
	import Mail from 'lucide-svelte/icons/mail';
	import SettingsUpload from './settingsUpload.svelte';
	import * as Table from '$lib/components/ui/table';
	import QRCode from 'qrcode';
	import QrCode from 'lucide-svelte/icons/qr-code';
	let { data }: { data: PageData } = $props();
	const {
		shared_surv: { title, description },
		features: { plan },
		form
	} = data;

	let clicked = $state(false);
	let text = `${page.url.origin}/anonymous/${page.params.surveyId}`;

	let canvasEL: HTMLCanvasElement | undefined;
	$effect(() => {
		if (!canvasEL) return;
		QRCode.toCanvas(canvasEL, text, function (error) {
			if (error) console.error(error);
			console.log('success!');
		});
	});
</script>

<div class="mx-auto flex max-w-xl flex-col gap-2 px-2 py-16">
	<Card.Root class="items-center text-center">
		<Card.Header>
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex justify-center gap-2">
				<Button
					variant="secondary"
					onclick={() => {
						clicked = !clicked;
						navigator.clipboard.writeText(text).then(
							function () {
								console.log('Async: Copying to clipboard was successful!');
							},
							function (err) {
								console.error('Async: Could not copy text: ', err);
							}
						);
						setTimeout(() => {
							clicked = !clicked;
						}, 2000);
					}}
				>
					{#if clicked}
						<CopyCheck /> Copied
					{:else}
						<Copy /> Copy Link
					{/if}
				</Button>
				<a
					class={buttonVariants({ variant: 'secondary' })}
					href="mailto:?subject=You are invited to a survey&body=Hope you’re doing well. I wanted to invite you to participate in a survey.You can view the survey at this link:{text}.Hope to see you there!"
				>
					<Mail />
					Send Mail
				</a>
				<canvas width="500px" height="500px" bind:this={canvasEL} id="qrCanvas"></canvas>
				<Button variant="secondary" onclick={() => window.print()}>
					<QrCode />
					Print QR Code
				</Button>
			</div>
		</Card.Content>
		<Card.Footer class="grid w-full gap-2">
			{#if plan === 'Premium'}
				<SettingsUpload data={form} />
			{/if}
		</Card.Footer>
	</Card.Root>
	{#if plan === 'Premium'}
		<p class="text-start text-sm italic text-muted-foreground">Example Data format:</p>
	{/if}
	<Card.Root class={[plan === 'Premium' ? '' : 'pointer-events-none blur-sm']}>
		<Card.Content>
			<Table.Root>
				<Table.Caption>list of names & emails</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head></Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Email</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-medium">1</Table.Cell>
						<Table.Cell class="text-left">John Doe</Table.Cell>
						<Table.Cell class="text-left">johndoe@gmail.com</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>

<style>
	#qrCanvas {
		visibility: hidden;
		display: none;
	}
	@media print {
		@page {
			size: auto; /* auto is the initial value */
			margin: 0; /* this affects the margin in the printer settings */
		}
		:global(body) {
			visibility: hidden;
		}
		#qrCanvas {
			display: block;
			visibility: visible;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
