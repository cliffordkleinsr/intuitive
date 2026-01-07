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
	import { page } from '$app/state';

	interface Barside {
		title: string;
		url: string;
		icon: any;
		items: any[];
	}

	interface Composition {
		user: string;
		data: Barside[];
		footer?: boolean | undefined;
		action?: string | undefined;
		url?: string | undefined;
	}
	let {
		user = 'Username',
		data,
		footer = true,
		action = '',
		url = '/client-console'
	}: Composition = $props();

	const footerItems = [
		{
			title: 'Account',
			url: `${url}/account`,
			icon: CircleUserRound
		}
	];
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
					<Collapsible.Root open class="group/collapsible">
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={page.url.pathname === group.url ||
									page.url.pathname.split('/').at(-2)?.includes(group.title.toLowerCase())}
							>
								{#snippet child({ props })}
									<Collapsible.Trigger {...props}>
										<a href={group.url} {...props}>
											<group.icon />
											<span>{group.title}</span>
										</a>
									</Collapsible.Trigger>
									<Collapsible.Content>
										<Sidebar.MenuSub>
											{#each group.items as item (item.title)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuButton>
														{#snippet child({ props })}
															<a
																href={item.url}
																{...props}
																target={item.title === 'Chat Support' ? '_blank' : '_self'}
															>
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
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</DropdownMenu.Item>
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
