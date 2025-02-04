<script lang="ts">
	import Portal2 from '../Portals/Portal2.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import PackageItems from './PackageItems.svelte';

	let { table = false } = $props();
	let pkg_pack = $state('onepack');
</script>

<div class="mx-auto grid h-[80vh] max-w-5xl gap-2 py-10">
	<Tabs.Root value="onepack">
		<Tabs.List class="grid grid-cols-3">
			<Tabs.Trigger value="onepack">
				{#snippet child({ props })}
					<Button variant="secondary" size="sm" {...props} onclick={() => (pkg_pack = 'onepack')}>
						On Demand
					</Button>
				{/snippet}
			</Tabs.Trigger>
			<Tabs.Trigger value="advantage">
				{#snippet child({ props })}
					<Button variant="secondary" size="sm" {...props} onclick={() => (pkg_pack = 'advantage')}>
						Advantage
					</Button>
				{/snippet}
			</Tabs.Trigger>
			<Tabs.Trigger value="advanced">
				{#snippet child({ props })}
					<Button variant="secondary" size="sm" {...props} onclick={() => (pkg_pack = 'advanced')}>
						Advanced
					</Button>
				{/snippet}
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="onepack">
			<PackageItems cluster={pkg_pack} />
		</Tabs.Content>
		<Tabs.Content value="advantage">
			<PackageItems cluster={pkg_pack} />
		</Tabs.Content>
		<Tabs.Content value="advanced">
			<PackageItems cluster={pkg_pack} />
		</Tabs.Content>
	</Tabs.Root>
</div>
