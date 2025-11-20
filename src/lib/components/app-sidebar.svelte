<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	// Lucide Svelte
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
	import LogOut from 'lucide-svelte/icons/log-out';
	import * as Collapsible from '$lib/components/ui/collapsible';
	// forms
	import * as Form from '$lib/components/ui/form';

	import { enhance } from '$app/forms';

	interface Barside {
		title: string;
		url: string;
		icon: any;
		items: any[];
	}

	interface Composition {
		user: string;
		payment_status?: boolean | undefined;
		data: Barside[];
		footer?: boolean | undefined;
		action?: string | undefined;
		url?: string | undefined;
	}
	let {
		user = 'Username',
		payment_status,
		data,
		footer = true,
		action = '',
		url = '/client-console'
	}: Composition = $props();

	const footerItems = [
		{
			title: 'Account',
			url: `${url}/subscription`,
			icon: CircleUserRound
		},
		{
			title: 'Billing',
			url: `${url}/billing`,
			icon: CreditCard
		}
	];
	const shouldRenderFooteritems = (item: any) => {
		if (item.title === 'Billing' && payment_status) {
			return false;
		}
		return true;
	};
	const shouldRenderGroup = (group: any) => {
		if (group.title === 'Audience' || group.title === 'Analytics') {
			return payment_status;
		}
		return true;
	};
</script>

<Sidebar.Root variant="inset">
	<Sidebar.Header />
	<Sidebar.Content>
		<!-- navigation items -->

		<Sidebar.Group />
		<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
		<Sidebar.GroupContent>
			<Sidebar.Menu>
				{#each data as group (group.title)}
					{#if shouldRenderGroup(group)}
						<Collapsible.Root open class="group/collapsible">
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<Collapsible.Trigger {...props}>
											{#if group.url === '/faq'}
												<a href={group.url} {...props} target="_blank">
													<group.icon />
													<span>{group.title}</span>
												</a>
											{:else}
												<a href={group.url} {...props}>
													<group.icon />
													<span>{group.title}</span>
												</a>
											{/if}
										</Collapsible.Trigger>
										<Collapsible.Content>
											<Sidebar.MenuSub>
												{#each group.items as item (item.title)}
													<Sidebar.MenuSubItem>
														<Sidebar.MenuButton>
															{#snippet child({ props })}
																<a href={item.url} {...props}>
																	<item.icon />
																	{item.title}
																</a>
															{/snippet}
														</Sidebar.MenuButton>
													</Sidebar.MenuSubItem>
												{/each}
											</Sidebar.MenuSub>
										</Collapsible.Content>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</Collapsible.Root>
					{/if}
				{/each}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
		<Sidebar.Group />
	</Sidebar.Content>
	<!-- footer -->
	<Sidebar.Footer>
		<Sidebar.Menu>
			{#if footer}
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									{user}'s Menu
									<ChevronUp class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
							{#each footerItems as item (item.title)}
								{#if shouldRenderFooteritems(item)}
									<DropdownMenu.Item>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</DropdownMenu.Item>
								{/if}
							{/each}
							<form {action} method="post" use:enhance>
								<DropdownMenu.Item class="w-full justify-start">
									{#snippet child({ props })}
										<Form.Button variant="ghost" size="sm" {...props}>
											<LogOut />
											<span class="font-normal">Sign out</span>
										</Form.Button>
									{/snippet}
								</DropdownMenu.Item>
							</form>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			{/if}
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
