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
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">A Platform You Can Rely On</h2>
				<p
					class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					Intuitive Insights is a trusted survey platform designed to help organizations capture
					feedback and act on it with confidence.
				</p>
			</div>
		</div>
		<div
			class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
		>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Ready-Made Templates</h3>
				<p class="text-sm text-muted-foreground">
					Accelarate your survey building process with intuitive templates
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Mobile-first design</h3>
				<p class="text-sm text-muted-foreground">
					Access your surveys through a wide range of devices
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Real-time charts and reporting</h3>
				<p class="text-sm text-muted-foreground">
					See your results in realtime with our intuitive analytics dashboard
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Export results</h3>
				<p class="text-sm text-muted-foreground">
					Access your data through a wide range of formats including CSV & PDF with custom API
					access support
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Simple, transparent pricing</h3>
				<p class="text-sm text-muted-foreground">Flexible pricing based on budget and outcome.</p>
			</div>
			<!-- <div class="grid gap-1">
				<h3 class="text-lg font-bold">Seamless Integrations</h3>
				<p class="text-sm text-muted-foreground">
					Seamlessly connect your data with your favorite tools and platforms.
				</p>
			</div> -->
		</div>
		<div class="flex flex-row items-start justify-center gap-4">
			<Button href="/client/login" variant="black" size="lg">Start for Free</Button>
			<Button data-sveltekit-reload href="/about#contact" variant="outline" size="lg"
				>Schedule a Demo</Button
			>
		</div>
	</div>
</section>
