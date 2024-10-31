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
					Elevate Your Feedback Gathering
				</h2>
				<p
					class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					We offer a wide range of features to help you gather insightful feedback, analyze data,
					and make informed decisions.
				</p>
			</div>
		</div>
		<div
			class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
		>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Customizable</h3>
				<p class="text-sm text-muted-foreground">
					Create platform insights with a variety of customization options to match your brand.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Real-Time Reporting</h3>
				<p class="text-sm text-muted-foreground">
					Get instant insights with our advanced analytics and reporting tools.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Seamless Distribution</h3>
				<p class="text-sm text-muted-foreground">
					Gather insights via email, social media, or embed them on your website.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Multilingual Support</h3>
				<p class="text-sm text-muted-foreground">
					Reach a global audience by creating surveys in multiple languages.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Secure and Compliant</h3>
				<p class="text-sm text-muted-foreground">
					Ensure data privacy and security with our robust compliance features.
				</p>
			</div>
			<div class="grid gap-1">
				<h3 class="text-lg font-bold">Seamless Integrations</h3>
				<p class="text-sm text-muted-foreground">
					Seamlessly connect your data with your favorite tools and platforms.
				</p>
			</div>
		</div>
		<div class="flex flex-row items-start justify-center gap-4">
			<Button href="/client/signin" variant="black" size="lg">Start for Free</Button>
			<!-- <a
          class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          href="/agent/signin"
        >
          Start for Free
        </a> -->
			<Button href="/about#contact" variant="outline" size="lg">Schedule a Demo</Button>
			<!-- <a
          class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          href="/about#contact"
        >
          Schedule a Demo
        </a> -->
		</div>
	</div>
</section>
