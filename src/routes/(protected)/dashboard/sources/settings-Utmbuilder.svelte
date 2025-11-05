<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/state';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import Copy from "lucide-svelte/icons/copy"
    import CopyCheck from "lucide-svelte/icons/copy-check"

	let baseUrl = $state(page.url.origin);

	const utmsources = [
		{
			label: 'FaceBook',
			value: 'faceBook'
		},
		{
			label: 'Instagram',
			value: 'instagram'
		},
		{
			label: 'Linkedin',
			value: 'linkedin'
		},
		{
			label: 'Whatsapp',
			value: 'whatsapp'
		}
	];
	const utmmediums = [
		{
			label: 'CPC',
			value: 'cpc'
		},
		{
			label: 'Paid Social',
			value: 'paid_social'
		},
		{
			label: 'Custom',
			value: 'custom'
		}
	];
    let clicked = $state(false);
	let sourceValue = $state('');
	const sourcesContent = $derived(
		utmsources.find((s) => s.value === sourceValue)?.label ?? 'Select a UTM Source'
	);

	let mediumValue = $state('');
	const mediumContent = $derived(
		utmmediums.find((m) => m.value === mediumValue)?.label ?? 'Select a UTM Medium'
	);
	let utmCampaign = $state('');
	// $inspect({baseUrl,  sourceValue, mediumValue, utmCampaign})
	let utmURl = $state('');

	// Errors
	let errorSorces = $state(false);
	let errorMediums = $state(false);
	let errorCampaigns = $state(false);

    let renderUrl = $state(false)
</script>

<section>
	<div class="mt-5 flex w-full flex-col gap-1.5">
		<Label for="baseUrl">Base URL</Label>
		<Input
			class="pointer-events-none cursor-not-allowed opacity-50"
			type="text"
			id="baseUrl"
			name="baseUrl"
			bind:value={baseUrl}
			placeholder={page.url.origin}
		/>
	</div>
	<div class="grid grid-cols-3 gap-2">
		<div class="mt-2">
			<Label for="utmSources">UTM Source</Label>
			<Select.Root
				type="single"
				name="utmSources"
				bind:value={sourceValue}
				onValueChange={() => (errorSorces = false)}
			>
				<Select.Trigger>
					{sourcesContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each utmsources as source (source.value)}
							<Select.Item value={source.value} label={source.label}>
								{source.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			{#if errorSorces}
				<p class=" text-sm text-destructive">Please enter a UTM Source</p>
			{/if}
		</div>
		<div class="mt-2">
			<Label for="utmMedium">UTM Medium</Label>
			<Select.Root
				type="single"
				name="utmMedium"
				bind:value={mediumValue}
				onValueChange={() => (errorMediums = false)}
			>
				<Select.Trigger>
					{mediumContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each utmmediums as medium (medium.value)}
							<Select.Item value={medium.value} label={medium.label}>
								{medium.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			{#if errorMediums}
				<p class=" text-sm text-destructive">Please enter a UTM Medium</p>
			{/if}
		</div>
		<div class="mt-2">
			<Label for="utmCampaign">UTM Campaign</Label>
			<Input
				type="text"
				id="utmCampaign"
				name="utmCampaign"
				bind:value={utmCampaign}
				placeholder="Type your campaign"
				oninput={() => {
					errorCampaigns = false;
				}}
			/>
			{#if errorCampaigns}
				<p class=" text-sm text-destructive">Please enter a UTM Campaign</p>
			{/if}
		</div>
	</div>
	<div class="mt-4 flex items-center justify-end gap-2">
		<Button
			onclick={() => {
				if (sourceValue === '') {
					errorSorces = true;
				}
				if (mediumValue === '') {
					errorMediums = true;
				}
				if (utmCampaign === '') {
					errorCampaigns = true;
				}
                else {
                    utmURl = `${baseUrl}/?utm_source=${sourceValue}&utm_medium=${mediumValue}&utm_campaign=${utmCampaign}`;
                    renderUrl = true
                }
				
			}}>Generate URL</Button
		>
	</div>
    {#if renderUrl}
        <div
            class="rounded-lg border p-4 sm:p-5 mt-4"
        >
            <span class="mb-3 block text-xs font-semibold text-gray-700 sm:text-sm">Generated URL</span>
            <div class="flex gap-2">
                <input
                    data-slot="input"
                    class="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 w-full min-w-0 flex-1 rounded-md rounded-l-lg border-2 bg-white px-3 py-1 font-mono text-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 sm:text-sm md:text-sm"
                    type="text"
                    value={utmURl}
                />
                <Button
					variant="secondary"
					onclick={() => {
						clicked = !clicked;
						navigator.clipboard.writeText(utmURl).then(
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
            </div>
        </div> 
    {/if}
</section>
