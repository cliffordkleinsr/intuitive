<!--
	jsrepo 1.36.0
	Installed from github/ieedan/shadcn-svelte-extras
	2-14-2025
-->

<script lang="ts">
	import * as Popover from '../popover';
	import { Button } from '../button';
	import * as Command from '../command';
	import { ScrollArea } from '../scroll-area';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { cn } from '../../../blocks/utils/utils';
	import Flag from './flag.svelte';
	import type { Country, CountryCode } from 'svelte-tel-input/types';
	import { tick } from 'svelte';

	interface Props {
		/** List of countries */
		countries: Country[];
		disabled?: boolean;
		selected?: CountryCode | null;
		onselect?: (val: CountryCode | null) => void;
		/** Default ordering is alphabetical by country name supply this function to customize the sorting behavior  */
		order?: (a: Country, b: Country) => number;
	}

	let {
		countries,
		disabled = false,
		selected = $bindable(null),
		onselect = undefined,
		order = (a, b) => {
			return a.name.localeCompare(b.name);
		}
	}: Props = $props();

	let selectedCountry = $derived(countries.find((a) => a.iso2 == selected));

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
	const selectCountry = (country: Country) => {
		selected = country.iso2;
		open = false;
		onselect?.(selected);
		closeAndFocusTrigger();
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				type="button"
				variant="outline"
				class={cn('flex gap-1 rounded-e-none rounded-s-lg px-3')}
				{disabled}
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				<Flag country={selectedCountry} />
				<ChevronsUpDown
					class={cn('-mr-2 h-4 w-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
				/>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[300px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search country..." />
			<Command.List>
				<ScrollArea class="h-72">
					<Command.Empty>No country found.</Command.Empty>
					<Command.Group>
						{#each countries.sort(order) as country}
							<Command.Item
								class="gap-2"
								value={country.name}
								onSelect={() => selectCountry(country)}
							>
								<Flag {country} />
								<span class="flex-1 text-sm">{country.name}</span>
								<span class="text-sm text-foreground/50">
									+{country.dialCode}
								</span>
								<div class="w-4">
									{#if country.iso2 == selected}
										<Check class="size-4" />
									{/if}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</ScrollArea>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
