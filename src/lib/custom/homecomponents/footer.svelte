<script>
	import { Separator } from '$lib/components/ui/separator';

	const year = $state(new Date().getFullYear());
</script>

<Separator />
<footer
	class="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6"
>
	<p class="text-xs text-muted-foreground">© {year} Intuitive Insights. All rights reserved.</p>
	<nav class="flex gap-4 sm:ml-auto sm:gap-6">
		<a class="text-xs underline-offset-4 hover:underline" href="/terms"> Terms of Service </a>
		<a class="text-xs underline-offset-4 hover:underline" href="/privacy"> Privacy Policy </a>
	</nav>
</footer>
