<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';
	import { Badge } from '$lib/components/ui/badge';
	// Lucide Svelte
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import House from 'lucide-svelte/icons/house';
	import Table from 'lucide-svelte/icons/table';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import HeartHandshake from 'lucide-svelte/icons/heart-handshake';
	import Coins from 'lucide-svelte/icons/coins';
	import ChartCandlestick from 'lucide-svelte/icons/chart-candlestick';
	import SlidersVertical from 'lucide-svelte/icons/sliders-vertical';
	import { Settings } from '$lib/custom/shardedlayouts';
	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';
	import Meta from '$lib/custom/seo/meta.svelte';
	import 'driver.js/dist/driver.css';
	import { initChatwoot } from '$lib/custom/functions/helpers';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();

	const dropProps = [
		{
			label: 'Profile',
			href: '/client-console/profile'
		},
		{
			label: 'Subscription',
			href: '/client-console/subscription'
		}
	];
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
						url: '/client-console/surveys/edit',
						icon: SlidersVertical
					}
					// {
					// 	title: 'Go Live',
					// 	url: '/client-console/surveys/live',
					// 	icon: RadioTower
					// }
				]
			},
			{
				title: 'View Plan',
				url: '/client-console/subscription',
				icon: Coins,
				items: []
			},
			// {
			// 	title: 'Audience',
			// 	url: '/client-console/audience',
			// 	icon: Earth,
			// 	items: []
			// },
			{
				title: 'Statistics',
				url: '/client-console/statistics',
				icon: ChartLine,
				items: []
			},
			{
				title: 'User Guide',
				url: '/faq',
				icon: HeartHandshake,
				items: []
			}
		],
		user: data.user?.fullname as string,
		payment_status: data.payment as boolean,
		action: '/client/signout'
	};
	const profile = data.user.pfp ?? '';
	// $inspect(profile)
	const pageprops = {
		title: 'Intuitive Insights Console',
		description: 'Your all in one analysis tool',
		type: 'Website'
	};

	onMount(() => {
		initChatwoot();
	});
</script>

<Meta {...pageprops} />
<Sidebar.Provider>
	<AppSidebar {...ClientlayoutItems} />
	<Sidebar.Inset>
		<header
			class="sticky top-0 z-10 flex h-16 w-full items-center gap-2 rounded-tl-lg border-b px-4 backdrop-blur-lg"
		>
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<!-- <Breadcrumb.Item>
						<Breadcrumb.Link href="/client-console/audience">Audience</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator /> -->
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/client-console/statistics">Statistics</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Dashboard</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div class="ml-auto flex gap-2">
				<!-- <div class="flex items-center justify-center">
					<a href="/faq" aria-label="faq">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								><path
									d="M4.842 13.657V7.691A1.49 1.49 0 0 1 6.334 6.2h1.491m-2.983 4.474h2.237m3.13 2.983V7.691a1.492 1.492 0 1 1 2.983 0v5.966m-2.983-2.983h2.983m5.966 1.491a1.492 1.492 0 1 1-2.983 0V7.691a1.492 1.492 0 1 1 2.983 0zm-1.492 1.492l1.492 1.491"
								/><path
									d="M22.2 2.571H1.8A1.054 1.054 0 0 0 .75 3.625v13.588a1.054 1.054 0 0 0 1.05 1.054h2.443a7.8 7.8 0 0 1-1.386 3.16c3.05.044 4.98-1.136 6.138-3.16H22.2a1.054 1.054 0 0 0 1.054-1.054V3.625A1.054 1.054 0 0 0 22.2 2.571"
								/></g
							></svg
						>
					</a>
				</div>
				<Badge variant="outline">
					<Popover.Root>
						<Popover.Trigger><CircleQuestionMark class="size-5" /></Popover.Trigger>
						<Popover.Content>
							<Card.Root>
								<Card.Header>
									<Card.Title class="flex justify-center">
										<svg
											class="size-10 text-primary"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path
												d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
											/><path d="M12 9v4" /><path d="M12 17h.01" /></svg
										>
									</Card.Title>
									<Card.Title class="text-center">Issue</Card.Title>
									<Card.Description class="text-center">have an issue?</Card.Description>
								</Card.Header>
								<Card.Content>
									<Button
										variant="outline"
										data-sveltekit-reload
										href="/about#contact"
										class="w-full">Get Help</Button
									>
								</Card.Content>
							</Card.Root>
						</Popover.Content>
					</Popover.Root>
				</Badge> -->
				{#if !data.payment}
					<div class="my-2 hidden h-5 md:block">
						<Badge variant="outline"><a href="/client-console/billing">Unlock Pro</a></Badge>
					</div>
				{/if}
				<Button onclick={toggleMode} variant="ghost" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<Settings
					name={String(data.user?.fullname)}
					action={ClientlayoutItems.action}
					items={dropProps}
					{profile}
				/>
			</div>
		</header>
		<main>
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
