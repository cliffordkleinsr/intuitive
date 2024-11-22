<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	import Zap from 'lucide-svelte/icons/zap';
	import Shield from 'lucide-svelte/icons/shield';
	import Users from 'lucide-svelte/icons/users';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	import { Confetti } from 'svelte-confetti';
	let { data }: { data: PageData } = $props();
</script>

<div class="fullscreen">
	<Confetti
		x={[-5, 5]}
		y={[0, 0.1]}
		delay={[500, 2000]}
		duration={5000}
		amount={200}
		fallDistance="200vh"
	/>
</div>
<div class="bg-gradient-to-b from-blue-50 to-white">
	<main class="container mx-auto px-4 py-16">
		<section class="mb-16 text-center">
			<h1 class="mb-4 text-4xl font-bold">Welcome to Our Platform!</h1>
			<p class="mb-8 text-xl text-gray-600">
				We're excited to have you on board. Let's get started on your journey.
			</p>
		</section>
		<section class="grid gap-8 md:grid-cols-3">
			<Card.Root>
				<Card.Header>
					<Zap class="mb-2 h-8 w-8 text-blue-500" />
					<Card.Title>Lightning Fast</Card.Title>
					<Card.Description>Experience blazing fast performance</Card.Description>
				</Card.Header>
				<Card.Content>
					Our platform is optimized for speed, ensuring you can work on polls efficiently without
					any delays.
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Shield class="mb-2 h-8 w-8 text-green-500" />
					<Card.Title>Secure & Reliable</Card.Title>
					<Card.Description>Your data is safe with us</Card.Description>
				</Card.Header>
				<Card.Content>All data belongs to you and can only be created by you.</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Users class="mb-2 h-8 w-8 text-purple-500" />
					<Card.Title>Demographics</Card.Title>
					<Card.Description>Access a wide variety of demographics</Card.Description>
				</Card.Header>
				<Card.Content>Our platform makes it easy to reach a diverse audience.</Card.Content>
			</Card.Root>
		</section>
		<section class="mt-16 text-center">
			<h2 class="mb-4 text-2xl font-semibold">Ready to dive in?</h2>
			<Button variant="black" size="lg" href="/client-console">
				Go to Dashboard <ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</section>
	</main>
</div>

<style lang="css">
	.fullscreen {
		position: fixed;
		top: -50px;
		left: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		overflow: hidden;
		pointer-events: none;
	}
</style>
