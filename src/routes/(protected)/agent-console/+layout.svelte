<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
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
	import SquarePen from 'lucide-svelte/icons/square-pen';
	import FileClock from 'lucide-svelte/icons/file-clock';
	import HandCoins from 'lucide-svelte/icons/hand-coins';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const AgentlayoutItems = {
		data: [
			{
				title: 'Dashboard',
				url: '/agent-console',
				icon: House,
				items: []
			},
			{
				title: 'Surveys',
				url: '',
				icon: Table,
				items: [
					{
						title: 'Take Survey',
						url: '/agent-console/surveys/take',
						icon: SquarePen
					},
					{
						title: 'Survey History',
						url: '/agent-console/surveys/history',
						icon: FileClock
					}
				]
			},
			{
				title: 'Recieve Payments',
				url: '/agent-console/billing',
				icon: HandCoins,
				items: []
			}
		],
		user: data.AuthedUser,
		action: '/agent/signout',
		url: '/agent-console'
	};
</script>

<Sidebar.Provider>
	<AppSidebar {...AgentlayoutItems} />
	<Sidebar.Inset>
		<header
			class="sticky top-0 flex h-16 w-full items-center gap-2 border-b px-4 backdrop-blur-lg lg:backdrop-blur-none"
		>
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link><a href="/agent-console/surveys/history">History</a></Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link><a href="/agent-console/surveys/take">Questions</a></Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page><a href="/agent-console">Dashboard</a></Breadcrumb.Page>
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
