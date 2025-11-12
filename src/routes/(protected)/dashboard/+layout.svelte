<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';

	import { toggleMode } from 'mode-watcher';

	// Lucide Svelte
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { Settings } from '$lib/custom/shardedlayouts';
	import House from 'lucide-svelte/icons/house';
	import Users from 'lucide-svelte/icons/users';
	import UserSearch from 'lucide-svelte/icons/user-search';
	import UserPen from 'lucide-svelte/icons/user-pen';
	import ChartArea from 'lucide-svelte/icons/chart-area';
	import FolderKanban from 'lucide-svelte/icons/folder-kanban';
	import Table from 'lucide-svelte/icons/table';
	import SlidersVertical from 'lucide-svelte/icons/sliders-vertical';
	import Tickets from 'lucide-svelte/icons/tickets';
	import Receipt from 'lucide-svelte/icons/receipt';
	import Info from 'lucide-svelte/icons/info';
	import ReceiptText from 'lucide-svelte/icons/receipt-text';
	import UserRoundCog from 'lucide-svelte/icons/user-round-cog';
	import Globe from 'lucide-svelte/icons/globe';
	import Smartphone from 'lucide-svelte/icons/smartphone';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const { fullname } = data.user;
	const layoutItems = {
		data: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: House,
				items: [
					{
						title: 'Source Statistics',
						url: '/dashboard/sources',
						icon: Globe
					},
					{
						title: 'Device Statistics',
						url: '/dashboard/devices',
						icon: Smartphone
					}
				]
			},
			{
				title: 'Users',
				url: '',
				icon: Users,
				items: [
					{
						title: 'Clients',
						url: '/dashboard/users/clients',
						icon: UserPen
					}
					// {
					// 	title: 'Agents',
					// 	url: '/dashboard/users/agents',
					// 	icon: UserSearch
					// },
					// {
					// 	title: 'Report',
					// 	url: '/dashboard/users/report',
					// 	icon: ChartArea
					// },
					// {
					// 	title: 'Modify',
					// 	url: '/dashboard/users/modify',
					// 	icon: UserRoundCog
					// }
				]
			},
			{
				title: 'Surveys',
				url: '',
				icon: Table,
				items: [
					{
						title: 'Manage',
						url: '/dashboard/surveys/manage',
						icon: SlidersVertical
					}
					// {
					// 	title: 'Summary',
					// 	url: '/dashboard/surveys/summary',
					// 	icon: FolderKanban
					// }
				]
			},
			{
				title: 'Support',
				url: '',
				icon: Info,
				items: [
					{
						title: 'Billing',
						url: '/dashboard/support/billing',
						icon: Receipt
					},
					{
						title: 'Create Ticket',
						url: '/dashboard/support/create',
						icon: ReceiptText
					},
					{
						title: 'Tickets',
						url: '/dashboard/support/tickets',
						icon: Tickets
					}
				]
			}
		],
		user: fullname,
		action: '/signout'
	};
	const dropProps = [
		{
			label: 'Profile',
			href: '##'
		}
	];
</script>

<Sidebar.Provider>
	<AppSidebar {...layoutItems} />
	<Sidebar.Inset>
		<header
			class="sticky top-0 z-10 flex h-16 w-full items-center gap-2 rounded-tl-lg border-b px-4 backdrop-blur-lg"
		>
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="##">Audience</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="##">Users</Breadcrumb.Link>
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
				<Settings name={fullname} action={layoutItems.action} items={dropProps} />
			</div>
		</header>
		<main>
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
