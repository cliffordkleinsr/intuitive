<script>
	import { Button } from '$lib/components/ui/button';
</script>

<section class="w-full py-12">
	<div class="container space-y-12 px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
					Powerful Platform Features
				</div>
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
					Strengthen your brand strategy
				</h2>
				<p
					class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					We offer a wide range of features to help you gather insightful feedback, analyze data,
					and make informed decisions. Our platform ensures you stay ahead of the competition.
				</p>
			</div>
		</div>
		<div
			class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
		>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Brand strategy & positioning</h3>
				<p class="text-sm text-muted-foreground">
					Strengthen brand perception, trust & market relevance.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Digital marketing execution</h3>
				<p class="text-sm text-muted-foreground">
					Drive engagement, awareness & leads using digital tools.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Web presence consulting</h3>
				<p class="text-sm text-muted-foreground">
					Help clients improve or launch digital platforms that reflect customer needs.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Customer engagement strategy</h3>
				<p class="text-sm text-muted-foreground">
					Translate insights into deeper long term engagement.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Campaign strategy execution</h3>
				<p class="text-sm text-muted-foreground">
					Help organizations run specific campaigns for visibility, launches or repositioning.
				</p>
			</div>
			<!-- <div class="grid gap-1">
				<h3 class="text-lg font-bold">Seamless Integrations</h3>
				<p class="text-sm text-muted-foreground">
					Seamlessly connect your data with your favorite tools and platforms.
				</p>
			</div> -->
		</div>
		<div class="flex flex-row items-start justify-center gap-4">
			<Button href="/client/signin" variant="black" size="lg">Start for Free</Button>
			<Button data-sveltekit-reload href="/about#contact" variant="outline" size="lg"
				>Schedule a Demo</Button
			>
		</div>
	</div>
</section>
