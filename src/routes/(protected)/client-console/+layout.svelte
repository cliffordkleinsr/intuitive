<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';
	import * as Avatar from '$lib/components/ui/avatar';
	// Lucide Svelte
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import House from 'lucide-svelte/icons/house';
	import Table from 'lucide-svelte/icons/table';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Earth from 'lucide-svelte/icons/earth';
	import RadioTower from 'lucide-svelte/icons/radio-tower';
	import Coins from 'lucide-svelte/icons/coins';
	import ChartCandlestick from 'lucide-svelte/icons/chart-candlestick';
	import SlidersVertical from 'lucide-svelte/icons/sliders-vertical';

	let { children, data } = $props();
	const ClientlayoutItems = {
		data: [
			{
				title: 'Dashboard',
				url: '/client-console',
				icon: House,
				items: []
			},
			{
				title: 'Surveys',
				url: '',
				icon: Table,
				items: [
					{
						title: 'Generate Surveys',
						url: '/client-console/surveys/create',
						icon: ChartCandlestick
					},
					{
						title: 'Manage Surveys',
						url: '/client-console/surveys/questionnaire',
						icon: SlidersVertical
					},
					{
						title: 'Go Live',
						url: '/client-console',
						icon: RadioTower
					}
				]
			},
			{
				title: 'View Plan',
				url: '/client-console',
				icon: Coins,
				items: []
			},
			{
				title: 'Audience',
				url: '/client-console',
				icon: Earth,
				items: []
			},
			{
				title: 'Analytics',
				url: '/client-console',
				icon: ChartLine,
				items: []
			}
		],
		user: data.AuthedUser,
		payment_status: data.payment.status,
		action: '/client/signout'
	};
</script>

<Sidebar.Provider>
	<AppSidebar {...ClientlayoutItems} />
	<Sidebar.Inset>
		<header class="sticky top-0 flex h-16 w-full items-center gap-2 border-b px-4">
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/client-console">Audience</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/client-console">Analytics</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Dashboard</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div class="ml-auto flex gap-2">
				<Button onclick={toggleMode} variant="ghost" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<Avatar.Root>
					<Avatar.Image src="" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<span class="sr-only">Toggle user menu</span>
			</div>
		</header>
		<main>
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
