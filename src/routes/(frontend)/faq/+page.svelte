<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

	const faqItems = [
		{
			id: 'register',
			question: 'HOW TO REGISTER ON INTUITIVE INSIGHTS',
			answer: `
        <div class="space-y-4">
          <ol class="list-decimal list-inside space-y-2">
            <li>Visit int-insights.com</li>
            <li>Click the "Client Signup" button on the banner.</li>
            <li>
              Choose one of the following options:
              <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Sign up with Google — accept the Google login prompts.</li>
                <li>Register with Email — fill in your details and click Submit.</li>
              </ul>
            </li>
            <li>Once done, you'll be redirected to your dashboard.</li>
          </ol>
        </div>
      `
		},
		{
			id: 'create-scratch',
			question: 'HOW TO CREATE SURVEY QUESTIONS FROM SCRATCH',
			answer: `
        <div class="space-y-4">
          <ol class="list-decimal list-inside space-y-2">
            <li>Log in to your dashboard.</li>
            <li>Click the "Create New Survey" button at the top of your dashboard.</li>
            <li>Enter your Title and Description, then click Submit.</li>
            <li>You'll be directed to the survey creation dashboard.</li>
            <li>The center section displays your survey questions.</li>
            <li>The right panel shows the available question types and options.</li>
            <li>The left panel helps you navigate different areas of the dashboard.</li>
            <li>Click "Preview Question" at the bottom to review and edit your questions.</li>
            <li>When you click on a question, a pop-up will appear where you can add the question, options, and then Save.</li>
          </ol>
        </div>
      `
		},
		{
			id: 'create-templates',
			question: 'HOW TO CREATE SURVEY QUESTIONS USING TEMPLATES',
			answer: `
        <div class="space-y-4">
          <ol class="list-decimal list-inside space-y-2">
            <li>Log in to your dashboard.</li>
            <li>Click "Use Available Templates" at the top of your dashboard.</li>
            <li>Click "Preview Questions." Please note: Free accounts can only use the Customer Satisfaction template.</li>
            <li>Edit the Title, Questions, and Options as needed.</li>
            <li>Click the "Add" button at the bottom to save your edits.</li>
            <li>Use the "Preview Question" button to review and adjust your survey.</li>
          </ol>
        </div>
      `
		},
		{
			id: 'go-live',
			question: 'HOW TO SET MY SURVEY TO GO LIVE',
			answer: `
        <div class="space-y-4">
          <ol class="list-decimal list-inside space-y-2">
            <li>Once you've finished creating your survey, click the "Go Live" button at the bottom.</li>
            <li>A pop-up will appear asking for confirmation.</li>
            <li>Click "Go Live" again to publish your survey and you're all set!</li>
          </ol>
        </div>
      `
		},
		{
			id: 'share-surveys',
			question: 'HOW TO SHARE SURVEYS',
			answer: `
        <div class="space-y-4">
          <ol class="list-decimal list-inside space-y-2">
            <li>Log in to your account.</li>
            <li>Create and publish your survey by clicking the "Go Live" button.</li>
            <li>Click the "Dashboard" button on the left panel to return to your main dashboard.</li>
            <li>Click "View All" under the "Create New Survey" section.</li>
            <li>From the list of active surveys, click the "Share" button next to the survey you want to share.</li>
            <li>
              Choose your preferred sharing option:
              <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Copy Link</li>
                <li>Send Mail</li>
                <li>Print QR Code</li>
              </ul>
            </li>
          </ol>
        </div>
      `
		}
	];
</script>

<main class="min-h-screen bg-gradient-to-b from-background to-muted/30">
	<!-- Header Section -->
	<section class="border-b border-border">
		<div class="mx-auto max-w-5xl px-4 py-16 md:py-24">
			<div class="space-y-4">
				<h1 class="text-5xl font-bold text-foreground md:text-6xl">Frequently Asked Questions</h1>
				<p class="max-w-2xl text-lg text-muted-foreground">
					Everything you need to make your experience with Intuitive Insights memorable
				</p>
			</div>
		</div>
	</section>

	<!-- FAQ Content -->
	<section class="mx-auto max-w-4xl px-4 py-16 md:py-24">
		<Accordion.Root type="single" class="w-full space-y-4">
			{#each faqItems as item (item.id)}
				<Accordion.Item value={item.id} class="rounded-lg border border-border px-6">
					<Accordion.Trigger
						class="text-base font-semibold text-foreground hover:text-primary md:text-lg"
					>
						{item.question}
					</Accordion.Trigger>
					<Accordion.Content class="pt-4 leading-relaxed text-muted-foreground">
						{@html item.answer}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>

	<!-- Contact Section -->
	<section class="bg-secondary">
		<div class="mx-auto max-w-4xl px-4 py-16 md:py-24">
			<div class="space-y-8">
				<div>
					<h2 class="mb-4 text-3xl font-bold md:text-4xl">Need Help Getting Started?</h2>
					<p class="text-lg opacity-90">
						Can't find what you're looking for? Reach out to our support team.
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<p class="font-semibold">Address</p>
						<p class="opacity-90">Chania Avenue, CMS Africa, Nairobi, Kenya</p>
					</div>

					<div class="space-y-2">
						<p class="font-semibold">Phone</p>
						<p class="opacity-90">+(254) 795-057553</p>
					</div>

					<div class="space-y-2">
						<p class="font-semibold">Email</p>
						<a href="mailto:info@int-insights.com" class="underline opacity-90 hover:opacity-100">
							info@int-insights.com
						</a>
					</div>

					<div class="space-y-2">
						<p class="font-semibold">Website</p>
						<a href="https://int-insights.com" class="underline opacity-90 hover:opacity-100">
							int-insights.com
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
