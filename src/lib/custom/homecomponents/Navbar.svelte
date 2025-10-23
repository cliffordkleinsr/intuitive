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
	import { cn } from '$lib/utils';
	import { page } from '$app/state';
</script>

<header
	class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 bg-primary px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6"
>
	<div class="hidden lg:block">
		<Package2 class="h-6 w-6" />
		<!-- <img src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1732781696/bdo6gntiz5pdxptwq5fe.png" class="w-7" alt="logo"> -->
	</div>
	<nav
		class="hidden font-medium md:flex md:basis-11/12 md:flex-row md:justify-center md:gap-5 lg:gap-9"
	>
		<a
			href="/"
			class="{page.url.pathname === '/'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-primary"
		>
			Home
		</a>

		<a
			href="/about"
			class="{page.url.pathname === '/about'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-primary"
		>
			About
		</a>

		<a
			href="/templates"
			class="{page.url.pathname === '/templates'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-primary"
		>
			Templates
		</a>

		<a
			href="/pricing"
			class="{page.url.pathname === '/pricing'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-primary"
		>
			Pricing
		</a>
	</nav>
	<Sheet.Root>
		<Sheet.Trigger
			class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'shrink-0 md:hidden')}
		>
			<Menu class="h-5 w-5" />
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<nav class="grid gap-6 text-lg font-medium">
				<a href="/" class="flex items-center gap-2 text-lg font-semibold">
					<!-- <Package2 class="h-6 w-6" /> -->
					<img
						src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1732781696/bdo6gntiz5pdxptwq5fe.png"
						class="w-5"
						alt="logo"
					/>
				</a>
				<a href="/" class="text-muted-foreground hover:text-primary"> Home </a>
				<a href="/about" class="text-muted-foreground hover:text-primary"> About </a>
				<a href="/templates" class="text-muted-foreground hover:text-primary"> Templates </a>
				<a href="/pricing" class="text-muted-foreground transition-colors hover:text-primary">
					Pricing
				</a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<div class="flex flex-auto justify-end gap-2">
		<!-- <a
			data-sveltekit-reload
			href="/about#address"
			class={[
				'py-5 text-muted-foreground transition-colors hover:text-primary',
				buttonVariants({ variant: 'secondary', size: 'sm' })
			]}
		>
			Contact
		</a> -->
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
