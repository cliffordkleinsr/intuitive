<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { HelpCircle, X } from 'lucide-svelte';

	let open = $state(true);
</script>

<Tooltip.Provider>
	<Tooltip.Root bind:open>
		<Tooltip.Trigger class="pointer-events-auto fixed bottom-6 left-[270px] z-50">
			{#snippet child({ props })}
				<Button variant="outline" {...props} href="/faq" target="_blank">
					<HelpCircle class="h-6 w-6 text-foreground" />
					FAQ
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content class="ml-[270px] max-w-sm ">
			<Button
				variant="ghost"
				size="icon"
				class=" absolute right-0 top-0"
				onclick={() => (open = false)}
			>
				<X class="h-4 w-4" />
			</Button>
			<p class="text-sm text-muted-foreground">
				Check out our <a class="text-blue-500 underline" target="_blank" href="/faq">FAQ</a> page for
				answers to common questions about our service.
			</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
