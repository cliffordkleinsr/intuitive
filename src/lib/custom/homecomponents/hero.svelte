<script>
	import { Button } from '$lib/components/ui/button';
</script>

<!-- Hero -->
<div
	class="relative h-full overflow-hidden bg-[rgba(0,0,0,0.45)] before:absolute before:start-1/2 before:top-0 before:-z-[1] before:size-full before:-translate-x-1/2 before:transform before:bg-[url('https://res.cloudinary.com/dmy8yp9el/image/upload/f_auto,q_auto/laptop-lcp')] before:bg-center before:bg-no-repeat dark:before:bg-[url('https://images.unsplash.com/photo-1668455199701-284281127a87?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]"
>
	<div class="relative z-10">
		<div class="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
			<div class="mx-auto max-w-screen-xl text-start lg:py-40">
				<!-- <p class="text-sm font-medium bg-clip-text bg-gradient-to-l from-orange-300 to-red-500 text-transparent dark:from-pink-500 dark:to-violet-500">
            The shape of tomorrow 
          </p> -->
				<!-- Title -->
				<div class="mt-5 max-w-3xl space-y-1">
					<!-- <span class="text-primary"></span> -->
					<h1
						class="block text-4xl font-semibold text-primary drop-shadow-xl dark:text-neutral-200 sm:text-6xl"
					>
						Intuitive Insights
					</h1>

					<h1
						class="block text-xl font-semibold text-neutral-50 drop-shadow-xl dark:text-neutral-200 md:text-2xl lg:text-3xl"
					>
						Corporate reputation <span class=" font-extralight">|</span> Customer experience
					</h1>
				</div>
				<!-- End Title -->

				<div class="flex flex-col gap-1">
					<div class="mt-5 flex max-w-2xl gap-2">
						<p class="text-5xl font-extralight text-white">|</p>
						<p class="text-md text-neutral-50 drop-shadow-md dark:text-neutral-400">
							We provide strategies and insights to enhance corporate reputation and brand image,
							elevate brand visibility and give customers the best experience.
						</p>
					</div>
				</div>
				<div class="flex justify-center gap-5 pt-10 lg:justify-start">
					<Button href="/about#more" size="lg" variant="secondary">About Us</Button>
					<Button variant="black" href="/client/signin" size="lg">Client Login</Button>
				</div>
			</div>
		</div>
	</div>
</div>
