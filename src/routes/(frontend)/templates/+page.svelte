<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from 'lucide-svelte';
	import Meta from '$lib/custom/seo/meta.svelte';
	import { Badge } from '$lib/components/ui/badge';

	let { data }: PageProps = $props();
	const templates = [
		{
			name: 'Customer Satisfaction (CSAT)',
			gradient: 'from-red-500 to-orange-500',
			description:
				'Measure how well your business meets customer expectations.This template helps you evaluate satisfaction, service quality, and overall experience, allowing you to identify areas that drive loyalty and retention.',
			questionCount: 5,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="M30.24 6.212q.387.213.76.444c4.937 3.058 8.238 8.46 8.313 14.63l3.747 5.223c.563.785.465 1.846-.363 2.344c-.83.5-2.063 1.084-3.734 1.488l-.566 6.718a3 3 0 0 1-3.358 2.725l-2.8-.346V43a2 2 0 0 1-1.998 2H13.014a2 2 0 0 1-1.999-2v-7.5c-4.295-3.192-7.075-8.275-7.075-14c0-6.26 3.321-11.75 8.315-14.844"/><path d="M17.023 14.057a8 8 0 1 0 7.954 0Q24.998 12.738 25 11c0-2.551-.044-4.405-.09-5.645c-.043-1.2-.854-2.187-2.05-2.285A24 24 0 0 0 21 3c-.732 0-1.35.029-1.86.07c-1.196.098-2.007 1.085-2.05 2.285C17.043 6.595 17 8.449 17 11q.001 1.739.023 3.057"/><path d="M21 29c3 3 7.6 5 12 5"/></g></svg>'
		},
		{
			name: 'Employee Engagement Survey',
			gradient: 'from-slate-600 to-slate-900',
			description:
				'Gain meaningful insights into how your employees feel about their roles, leadership, and workplace culture. Use this template to assess motivation, recognition, and communication — and uncover opportunities to strengthen employee satisfaction and performance.',
			questionCount: 6,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" d="M5 13.5h14m-7 0V24M6.5 11V6.5H5.328a3 3 0 0 0-2.906 2.255L.5 16.25v.25h7V18c0 1.5 0 2.5.75 4c0 0 .75 1.5 1.75 1.5M17.5 11V6.5h1.172a3 3 0 0 1 2.906 2.255L23.5 16.25v.25h-7V18c0 1.5 0 2.5-.75 4c0 0-.75 1.5-1.75 1.5m-7.65-19s-1.6-1-1.6-2.25a1.747 1.747 0 1 1 3.496 0C8.246 3.5 6.65 4.5 6.65 4.5zm11.3 0s1.6-1 1.6-2.25A1.75 1.75 0 0 0 17.5.5c-.966 0-1.746.784-1.746 1.75c0 1.25 1.596 2.25 1.596 2.25z" stroke-width="1"/></svg>'
		},
		{
			name: 'Post-Purchase / Service Feedback',
			gradient: 'from-blue-500 to-cyan-500',
			description:
				'Understand the customer journey after a transaction.This template helps you measure satisfaction with product quality, staff assistance, and value for money, enabling your team to refine the post-purchase experience and improve retention.',
			questionCount: 6,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M8.06 5.11a.75.75 0 0 0-1 .25L5.67 7.63a.27.27 0 0 1-.22.12h-.28a.48.48 0 0 0-.4.2a.5.5 0 0 0-.08.44l1.5 5a.49.49 0 0 0 .48.36h5a.5.5 0 0 0 .47-.34l1.67-5a.5.5 0 0 0-.47-.66h-.45a.27.27 0 0 1-.22-.12l-1.36-2.27a.75.75 0 0 0-1.31.78l.74 1.23a.28.28 0 0 1 0 .25a.25.25 0 0 1-.22.13H7.79a.26.26 0 0 1-.22-.38l.74-1.23a.75.75 0 0 0-.25-1.03m15.58 13.06a1.29 1.29 0 0 0-.89-1.52L19 15.56a.25.25 0 0 1-.18-.24v-4.57a1 1 0 0 0-2 0v7.06a.25.25 0 0 1-.18.24a.26.26 0 0 1-.28-.1c-1.48-2.14-3.8-1.46-2.71.21l3 4.48a.23.23 0 0 0 .2.11h5.78a.26.26 0 0 0 .25-.21l.73-4Z"/><path fill="currentColor" d="M12.83 20.25a1 1 0 0 0-1-1h-.25a.25.25 0 0 1-.25-.25v-.53a.25.25 0 0 1 .2-.24a1 1 0 0 0-.2-2h-8.5a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5h18a.5.5 0 0 1 .5.5v10.5a1 1 0 0 0 2 0v-11a2 2 0 0 0-2-2h-19a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6.75a.25.25 0 0 1 .25.25V19a.25.25 0 0 1-.25.25H6.83a1 1 0 1 0 0 2h5a1 1 0 0 0 1-1"/></svg>'
		},
		{
			name: 'Market Research / Product Development',
			gradient: 'from-purple-500 to-pink-500',
			description:
				'Explore new opportunities and test your ideas before launch. This template helps you evaluate customer interest, pricing perceptions, and desired features — giving your business the data it needs to make informed development decisions.',
			questionCount: 6,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m4 0V7m-8 4h.01M3 3h1m17 0h-1m0 0v12h-6m6-12H4m0 0v12h6m0 0l-2 6m2-6h4m0 0l2 6"/></svg>'
		},
		{
			name: 'Patient Experience Survey',
			gradient: 'from-emerald-500 to-teal-500',
			description:
				'Enhance the quality of care through direct feedback from patients. This template measures key experience factors such as professionalism, communication, facility conditions, and appointment accessibility — helping healthcare organizations identify and improve critical touchpoints.',
			questionCount: 6,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64"><path fill="currentColor" d="M10.643 35.727a4.233 4.233 0 0 1 4.24-4.235a4.236 4.236 0 0 1 4.242 4.235a4.241 4.241 0 0 1-8.482 0m40.954-2.594c1.865 0 3.371 1.462 3.387 3.313l.007 8.944H20.958V33.142zm-34.558 12.25c1.151 0 2.086-.935 2.086-2.086s-.935-2.086-2.086-2.086h-6.03a2.083 2.083 0 0 0-2.084 2.086c0 1.151.928 2.086 2.084 2.086z"/><path fill="currentColor" d="M57.009 54.179v9.327h5.523V33.928a2.756 2.756 0 0 0-2.755-2.759a2.764 2.764 0 0 0-2.768 2.759v13.575H7.42V28.348c0-1.523-1.328-2.762-2.855-2.762v.002c-1.522 0-2.721 1.237-2.721 2.759v35.158h5.575v-9.327h49.59zM39.508.14c1.767 0 4.661.743 6.271 2.505l-2.17 4.168a5.17 5.17 0 0 0-4.101-2.014c-1.649 0-3.116.77-4.065 1.973L33.23 2.737C35.093.873 37.669.139 39.508.139zm-.625 4.2h1.238V3.101h1.239V1.865h-1.239V.627h-1.238v1.238h-1.237v1.236h1.237z"/><path fill="currentColor" d="M43.482 10.248a3.982 3.982 0 1 1-7.965 0a3.982 3.982 0 0 1 7.965 0m-7.812 5.117c-2.784.015-4.397 2.274-4.76 3.55l-3.392 11.133h3.433l2.5-8.542h1.779l-2.493 8.54h13.507l-2.475-8.54h1.778l2.566 8.542h3.382L48.09 18.915c-.362-1.26-1.941-3.476-4.664-3.544zm-25.377 2.56c-4.888 0-8.86-3.974-8.86-8.862c0-4.889 3.971-8.864 8.86-8.864c4.886 0 8.864 3.976 8.864 8.864s-3.979 8.862-8.864 8.862m-.003-2.194c3.678 0 6.672-2.991 6.672-6.67c0-3.675-2.993-6.671-6.672-6.671c-3.676 0-6.665 2.995-6.665 6.671c0 3.68 2.989 6.67 6.665 6.67"/><path fill="currentColor" d="M10.338 10.233a.66.66 0 0 1-.639-.048a.66.66 0 0 1-.296-.46l-.009-5.151a.667.667 0 0 1 1.333 0V8.57l3.416-1.609a.666.666 0 0 1 .566 1.204z"/></svg>'
		},
		{
			name: 'Community / Program Impact Survey',
			gradient: 'from-amber-500 to-orange-500',
			description:
				'Evaluate how your initiatives are performing and identify areas for greater impact. This template captures insights on program relevance, participation, support, and outcomes empowering organizations to strengthen future programs and demonstrate accountability to stakeholders.',
			questionCount: 6,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M6.396 15.442q-.605 0-1.04-.435t-.433-1.045q0-.633.435-1.057t1.046-.424q.603 0 1.032.424t.43 1.047t-.432 1.057t-1.038.433m11.193 0q-.606 0-1.04-.435q-.433-.435-.433-1.046q0-.632.434-1.056q.435-.424 1.046-.424q.603 0 1.032.424t.43 1.047t-.432 1.057q-.431.433-1.037.433m-5.56-.961q-.81 0-1.381-.569t-.571-1.393q0-.838.569-1.4t1.392-.561q.8 0 1.381.561T14 12.51t-.58 1.4q-.581.572-1.391.572M7.773 20q.33-1.475 1.509-2.44q1.177-.964 2.754-.964t2.748.965t1.5 2.439zM3 20q0-1.42.992-2.411t2.412-.993q.43 0 .81.095q.38.094.734.282q-.593.602-.989 1.38q-.395.778-.56 1.647zm14.65 0q-.156-.889-.55-1.662t-1.01-1.384q.35-.17.72-.264q.368-.094.786-.094q1.42 0 2.412.993T21 20zM2.662 11.385l-.585-.793L12.039 3l3.98 3.03V4H18v3.542l4 3.05l-.604.792l-9.358-7.128z"/></svg>'
		}
	];
	const pageprops = {
		title: 'Templates • Intuitive Insights',
		description:
			'Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...pageprops} />

<main class="min-h-screen bg-background">
	<!-- Header Section  -->
	<section class="border-b border-border">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
					Survey Templates
				</h1>
				<Badge>Ready to Use</Badge>
				<p class="mt-4 text-base text-muted-foreground">
					Creating an effective survey doesn’t need to be complicated. At Intuitive Insights, we’ve
					developed ready-to-use templates designed by research professionals to help you collect
					actionable feedback quickly and confidently. Each template is built around proven survey
					models and includes a mix of rating scales, multiple-choice, and open-ended questions all
					fully customizable to your organization’s needs.
				</p>
			</div>
		</div>
	</section>
	<!-- Templates Grid  -->
	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each templates as template}
				<Card.Root
					class="group overflow-hidden border-0 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
				>
					<!-- Gradient Header -->
					<div
						class={[
							'h-32 bg-gradient-to-r  transition-transform duration-300 group-hover:scale-105',
							template.gradient
						]}
					></div>

					<!-- Content -->
					<div class="p-6">
						<div class="mb-3 flex items-start justify-between">
							<div class="text-4xl">{@html template.icon}</div>
							<span
								class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
							>
								{template.questionCount} questions
							</span>
						</div>

						<h3 class="mb-2 text-xl font-semibold text-card-foreground">{template.name}</h3>

						<p class="mb-6 text-sm text-muted-foreground">{template.description}</p>

						<Button href="/client/login" variant="outline" class="group/btn w-full bg-transparent">
							Use Template
							<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</Button>
					</div>
				</Card.Root>
			{/each}
		</div>
	</section>
	<!-- CTA Section -->
	<section class="border-t border-border bg-muted/30">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-balance text-2xl font-bold text-foreground">Ready to gather insights?</h2>
				<p class="mt-2 text-muted-foreground">
					Start with any template and customize it to match your needs
				</p>
				<Button href="/client/login" class="mt-6">Create Your First Survey</Button>
			</div>
		</div>
	</section>
</main>
