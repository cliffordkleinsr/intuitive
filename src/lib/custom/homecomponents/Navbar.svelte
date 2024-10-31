<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	// Light Switch
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cn } from '$lib/utils';

	let dialogOpen = $state(false);
</script>

<header
	class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 bg-primary px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6"
>
	<div class="hidden lg:block">
		<Package2 class="h-6 w-6" />
	</div>
	<nav
		class="hidden font-medium md:flex md:basis-11/12 md:flex-row md:justify-center md:gap-5 lg:gap-9"
	>
		<a href="/" class="text-foreground transition-colors hover:text-primary"> Home </a>

		<a href="/about" class="text-muted-foreground transition-colors hover:text-primary"> About </a>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="text-muted-foreground transition-colors hover:text-primary"
				>Industries</DropdownMenu.Trigger
			>
			<DropdownMenu.Content class="mt-4 text-muted-foreground transition-colors">
				<DropdownMenu.Group>
					<DropdownMenu.Item><a href="/industries/hospitality">Hospitality</a></DropdownMenu.Item>
					<DropdownMenu.Item> <a href="/industries/healthcare">Healthcare</a></DropdownMenu.Item>
					<DropdownMenu.Item> <a href="/industries/retail_fmcg">Retail</a></DropdownMenu.Item>
					<DropdownMenu.Item
						><a href="/industries/financial_services">Financial services</a></DropdownMenu.Item
					>
					<DropdownMenu.Item> <a href="/industries/ngo">NGO's</a></DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="text-muted-foreground transition-colors hover:text-primary"
				>Services</DropdownMenu.Trigger
			>
			<DropdownMenu.Content class="mt-4 text-muted-foreground transition-colors">
				<DropdownMenu.Group>
					<DropdownMenu.Item> <a href="/services/corp_rep">Corporate reputation</a></DropdownMenu.Item>
					<DropdownMenu.Item ><a href="/services/brand_image">Brand image</a></DropdownMenu.Item>
					<DropdownMenu.Item 
						><a href="/services/customer_experience">Customer experience</a></DropdownMenu.Item
					>
					<DropdownMenu.Item 
						><a href="/services/product_assessment">Product assessment</a></DropdownMenu.Item
					>
					<DropdownMenu.Item ><a href="/services/market_reaserch">Market research</a></DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<a href="/pricing" class="text-muted-foreground transition-colors hover:text-primary">
			Pricing
		</a>
	</nav>
	<Sheet.Root bind:open={dialogOpen}>
		<Sheet.Trigger class={cn(buttonVariants({variant: 'outline', size: 'icon'}), "shrink-0 md:hidden")}>
			<Menu class="h-5 w-5" />
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<nav class="grid gap-6 text-lg font-medium">
				<a
					href="/"
					class="flex items-center gap-2 text-lg font-semibold"
					onclick={() => (dialogOpen = !dialogOpen)}
				>
					<Package2 class="h-6 w-6" />
				</a>
				<a
					href="/"
					class="text-muted-foreground hover:text-primary"
					onclick={() => (dialogOpen = !dialogOpen)}
				>
					Home
				</a>
				<a
					href="/about"
					class="text-muted-foreground hover:text-primary"
					onclick={() => (dialogOpen = !dialogOpen)}
				>
					About
				</a>
				<Collapsible.Root class="space-y-2">
					<Collapsible.Trigger class="text-muted-foreground transition-colors hover:text-primary"
						>Industries
					</Collapsible.Trigger>
					<Collapsible.Content class="ml-2 flex max-w-48 flex-col gap-2 text-sm">
						<a
							href="/industries/hospitality"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Hospitality
						</a>
						<Separator />
						<a
							href="/industries/healthcare"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Healthcare
						</a>
						<Separator />
						<a
							href="/industries/retail_fmcg"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Retail
						</a>
						<Separator />
						<a
							href="/industries/financial_services"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Financial services
						</a>
						<Separator />
						<a
							href="/industries/ngo"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							NGO's
						</a>
					</Collapsible.Content>
				</Collapsible.Root>
				<Collapsible.Root class="space-y-2">
					<Collapsible.Trigger class="text-muted-foreground transition-colors hover:text-primary ">
						Services
					</Collapsible.Trigger>
					<Collapsible.Content class="ml-2 mt-1 flex max-w-48 flex-col gap-2 text-sm">
						<a
							href="/services/corp_rep"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Corporate reputation
						</a>
						<Separator />
						<a
							href="/services/brand_image"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Brand image
						</a>
						<Separator />
						<a
							href="/services/customer_experience"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Customer experience
						</a>
						<Separator />
						<a
							href="/services/product_assessment"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Product assessment
						</a>
						<Separator />
						<a
							href="/services/market_reaserch"
							class="text-muted-foreground transition-colors hover:text-primary"
							onclick={() => (dialogOpen = !dialogOpen)}
						>
							Market research
						</a>
					</Collapsible.Content>
				</Collapsible.Root>
				<a
					href="/pricing"
					class="text-muted-foreground transition-colors hover:text-primary"
					onclick={() => (dialogOpen = !dialogOpen)}
				>
					Pricing
				</a>
				<a
					href="/agent/signin"
					class="text-muted-foreground transition-colors hover:text-primary"
					onclick={() => (dialogOpen = !dialogOpen)}
				>
					Agent Login
				</a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<div class="flex flex-auto justify-end gap-2">
		<Button size="default" variant="black" class="hidden md:flex" href="/agent/signin"
			>Agent Login</Button
		>
		<Button onclick={toggleMode} variant="ghost" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
