<script lang="ts">
	import Meta from '$lib/custom/seo/meta.svelte';
	import type { PageData } from './$types';
	import SettingsQuestion from './settings-question.svelte';
	// import { CldImage } from 'svelte-cloudinary';

	// lucide
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import MapPin from 'lucide-svelte/icons/map-pin';
	let { data }: { data: PageData } = $props();

	const pageprops = {
		title: 'About • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...pageprops} />

<main class="flex-1">
	<section class="w-full bg-muted py-12 md:py-24 lg:py-32">
		<div
			class="container grid gap-6 px-4 md:px-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">
						Intuitive Insights
					</div>
					<h1 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
						Premier platform for comprehensive solutions.
					</h1>
					<p class="max-w-[600px] text-muted-foreground md:text-xl">
						Intuitive Insight is the premier platform for comprehensive solutions. We focus in
						offering solutions tailored to the unique needs of businesses across various sectors.
					</p>
				</div>
			</div>
			<!-- <CldImage
				width="auto"
				height="auto"
				class="mx-auto rounded-xl"
				src="dwlfv0ng4vfr5p1sduvk"
				alt="Woman"
			/> -->
			<img
				src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1734511512/slizkolnzojpzpckzdp8.jpg"
				alt="Woman"
				class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-auto"
			/>
		</div>
	</section>

	<section class="w-full py-12 md:py-24 lg:py-32" id="more">
		<div class="container px-4 md:px-6">
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Mission</div>
					<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
						Empowering Businesses with Insightful Data
					</h2>
					<p
						class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						At Intuitive Insights, our mission is to provide businesses with a powerful and user-
						friendly platform to gather valuable insights that drive informed decision-making. We
						believe that data-driven strategies are the key to sustainable growth and success in
						industries like retail, NGOs, healthcare, financial services, and hospitality in Kenya.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="w-full bg-muted py-12 md:py-24 lg:py-32">
		<div class="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
			<div class="space-y-4">
				<div class="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">
					Our Values
				</div>
				<h2 class="text-3xl font-bold tracking-tighter md:text-4xl/tight">
					Guiding Principles for Success
				</h2>
				<p
					class="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					At the core of Intuitive Insights are our values: innovation, customer-centricity,
					integrity, and continuous improvement. These principles shape our approach and drive us to
					deliver exceptional experiences for our clients in Kenya and beyond.
				</p>
			</div>
			<div class="grid gap-6">
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Innovation</h3>
					<p class="text-sm text-muted-foreground">
						We constantly explore new technologies and methodologies to enhance feedback gathering
						and provide cutting-edge solutions that are tailored to the unique needs of Kenyan
						businesses.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Customer-Centricity</h3>
					<p class="text-sm text-muted-foreground">
						Our clients&#39; success is our top priority. We work closely with them to understand
						their unique needs and deliver tailored solutions for market research, customer
						satisfaction surveys, and more.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Integrity</h3>
					<p class="text-sm text-muted-foreground">
						We are committed to maintaining the highest standards of ethics and transparency in all
						our dealings, ensuring the reliability of our platform and services for businesses in
						Kenya.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Continuous Improvement</h3>
					<p class="text-sm text-muted-foreground">
						We constantly seek feedback and explore new ways to enhance our platform, ensuring that
						our clients always have access to the latest and most effective tools for data
						collection and customer feedback.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="w-full py-9 md:py-16 lg:py-24" id="address">
		<div class="container space-y-3 px-4 md:px-6">
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Address Details</div>
				</div>
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
					Have a question or need assistance?
				</h2>
				<p
					class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					Contact us with the details below
				</p>
			</div>
			<div class="mb-8 overflow-hidden rounded-lg shadow-lg">
				<iframe
					title="Intuitive Insights"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7994116755094!2d36.7898792!3d-1.2949051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11ddf10f0a1b%3A0xd8f7f55cd40764b1!2sIntuitive%20Insights!5e0!3m2!1sen!2ske!4v1736236028078!5m2!1sen!2ske"
					width="100%"
					height="450"
					style={'border:0;'}
					allowfullscreen={true}
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
			<div class="grid gap-8 md:grid-cols-2">
				<div class="rounded-lg p-6 shadow-md">
					<h2 class="mb-4 text-2xl font-semibold">Our Address</h2>
					<div class="mb-4 flex items-start">
						<MapPin class="mr-2 mt-1 flex-shrink-0 text-gray-500" />
						<p>
							Chania Avenue, CMS Africa<br />
							Nairobi, NA 0100<br />
							Kenya
						</p>
					</div>
					<div class="mb-4 flex items-center">
						<Phone class="mr-2 flex-shrink-0 text-gray-500" />
						<p>+(254) 795-057553</p>
					</div>
					<div class="flex items-center">
						<Mail class="mr-2 flex-shrink-0 text-gray-500" />
						<p>info@int-insights.com</p>
					</div>
				</div>

				<div class="rounded-lg p-6 shadow-md">
					<h2 class="mb-4 text-2xl font-semibold">Business Hours</h2>
					<ul class="space-y-2">
						<li><span class="font-semibold">Monday - Friday:</span> 9:00 AM - 4:00 PM</li>
						<li><span class="font-semibold">Saturday:</span> 9:00 AM - 12:00 PM</li>
						<li><span class="font-semibold">Sunday:</span> Closed</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="w-full bg-muted py-12 md:py-24 lg:py-32" id="contact">
		<div class="container px-4 md:px-6">
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">
						Contact Us
					</div>
					<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
						Get in touch to schedule a demo with us
					</h2>
					<p
						class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						Our team is here to help. Fill out the form below and we'll get back to you as soon as
						possible.
					</p>
				</div>
			</div>
			<div class="mx-auto grid max-w-md gap-6 py-12">
				<SettingsQuestion data={data.form} />
			</div>
		</div>
	</section>

	<div class="hidden w-full bg-muted py-9 md:py-16 lg:py-24">
		<!-- Title -->
		<div class="mx-auto mb-6 w-2/3 text-center sm:w-1/2 lg:w-1/3">
			<h2 class="text-gray-600 dark:text-neutral-400">Powered by</h2>
		</div>
		<!-- End Title -->

		<div class="flex justify-center gap-x-6 sm:gap-x-12 lg:gap-x-24">
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<a href="https://orm.drizzle.team/" target="_blank">
				<svg
					class="w-7 hover:text-green-300"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M5.353 11.823a1.036 1.036 0 0 0-.395-1.422a1.063 1.063 0 0 0-1.437.399L.138 16.702a1.035 1.035 0 0 0 .395 1.422a1.063 1.063 0 0 0 1.437-.398zm11.216 0a1.036 1.036 0 0 0-.394-1.422a1.064 1.064 0 0 0-1.438.399l-3.382 5.902a1.036 1.036 0 0 0 .394 1.422c.506.283 1.15.104 1.438-.398zm7.293-4.525a1.036 1.036 0 0 0-.395-1.422a1.06 1.06 0 0 0-1.437.399l-3.383 5.902a1.036 1.036 0 0 0 .395 1.422a1.063 1.063 0 0 0 1.437-.399zm-11.219 0a1.035 1.035 0 0 0-.394-1.422a1.064 1.064 0 0 0-1.438.398l-3.382 5.903a1.036 1.036 0 0 0 .394 1.422c.506.282 1.15.104 1.438-.399z"
					/>
				</svg>
			</a>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<a href="https://www.postgresql.org/">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-7 outline-[#31648C]" viewBox="0 0 24 24">
					<path
						fill="#31648C"
						d="M16.805 1a10 10 0 0 0-2.603.37l-.06.018a10.6 10.6 0 0 0-1.615-.151c-1.113-.019-2.07.243-2.84.68c-.76-.256-2.336-.697-3.997-.609c-1.157.061-2.419.402-3.354 1.36c-.933.958-1.426 2.44-1.322 4.457c.028.557.191 1.464.463 2.64c.27 1.175.652 2.55 1.127 3.805s.996 2.384 1.81 3.15c.406.384.965.707 1.624.68c.463-.018.882-.215 1.243-.506c.176.225.364.323.535.414c.215.114.425.192.642.244a4.6 4.6 0 0 0 1.84.091c.267-.043.548-.127.828-.247c.01.302.022.598.035.898c.038.95.063 1.827.357 2.596c.047.126.176.773.687 1.344c.51.572 1.51.928 2.648.692c.803-.167 1.825-.468 2.503-1.404c.67-.926.973-2.254 1.033-4.409c.015-.116.033-.215.052-.308l.16.014h.018c.857.038 1.787-.08 2.564-.43c.688-.31 1.208-.622 1.587-1.177c.095-.137.199-.303.227-.59c.028-.285-.14-.733-.421-.939c-.563-.414-.916-.257-1.295-.18q-.56.12-1.136.133c1.093-1.784 1.876-3.68 2.323-5.358c.264-.99.413-1.903.425-2.701s-.055-1.505-.548-2.117c-1.541-1.91-3.708-2.438-5.384-2.456q-.078-.002-.156-.001zm-.044.587c1.585-.015 3.611.417 5.065 2.22c.327.405.424.997.413 1.727c-.012.729-.151 1.601-.405 2.557c-.493 1.852-1.425 4.01-2.738 5.948a.7.7 0 0 0 .15.079c.274.11.898.204 2.145-.044c.313-.065.543-.108.781.068a.48.48 0 0 1 .173.39a.64.64 0 0 1-.123.308c-.24.351-.716.684-1.326.958c-.539.244-1.313.371-1.999.379c-.344.003-.661-.023-.93-.104l-.018-.006c-.104.971-.343 2.89-.498 3.765c-.125.706-.343 1.267-.76 1.687c-.416.42-1.004.673-1.796.838c-.981.204-1.696-.016-2.157-.393c-.46-.375-.671-.874-.798-1.18c-.087-.21-.132-.483-.176-.848a18 18 0 0 1-.097-1.315a46 46 0 0 1-.028-2.312c-.41.363-.92.605-1.467.696c-.65.107-1.232.002-1.579-.082a2.2 2.2 0 0 1-.49-.185c-.162-.083-.315-.177-.417-.363a.5.5 0 0 1-.054-.35a.56.56 0 0 1 .206-.303c.188-.148.435-.23.808-.306c.68-.135.917-.228 1.061-.339c.123-.095.262-.287.508-.57l-.003-.037a2.9 2.9 0 0 1-1.257-.328c-.141.144-.865.887-1.748 1.917c-.371.431-.781.678-1.214.696s-.824-.194-1.156-.506c-.665-.626-1.195-1.703-1.657-2.92c-.46-1.218-.836-2.574-1.102-3.729c-.268-1.155-.426-2.086-.448-2.535c-.1-1.909.36-3.195 1.15-4.006S4.652 1.94 5.708 1.882c1.894-.106 3.693.535 4.057.673c.701-.462 1.604-.75 2.733-.732a7.2 7.2 0 0 1 1.588.2l.019-.008q.344-.117.698-.196a9.4 9.4 0 0 1 1.957-.23zm.143.614h-.137a8.5 8.5 0 0 0-1.61.176a7.05 7.05 0 0 1 2.692 2.062a7.7 7.7 0 0 1 1.07 1.76c.104.242.174.447.213.605c.02.08.034.147.038.217a.4.4 0 0 1-.011.132l-.006.012c.029.803-.176 1.347-.201 2.113c-.019.556.127 1.209.163 1.92c.034.67-.049 1.405-.497 2.127q.056.066.108.132c1.185-1.81 2.04-3.814 2.495-5.521c.243-.92.373-1.753.384-2.413c.01-.66-.117-1.139-.279-1.338c-1.268-1.573-2.983-1.974-4.422-1.985m-4.525.235c-1.117.002-1.919.33-2.526.82c-.627.507-1.047 1.2-1.323 1.911a7.9 7.9 0 0 0-.485 2.213l.013-.007c.337-.184.78-.367 1.254-.473c.475-.106.986-.139 1.449.035s.846.584.985 1.206c.665 2.986-.207 4.096-.529 4.933a9 9 0 0 0-.312.929q.06-.017.121-.024a1.06 1.06 0 0 1 .51.1c.324.13.546.402.666.714q.047.124.067.26q.02.057.019.117a49 49 0 0 0 .012 3.426c.022.494.054.928.095 1.271c.04.342.098.602.135.69c.12.294.297.678.617.939s.777.434 1.614.26c.726-.151 1.174-.36 1.474-.663c.298-.301.477-.72.591-1.363c.171-.963.515-3.754.556-4.28c-.018-.395.042-.7.172-.932c.135-.238.343-.384.522-.463c.09-.04.174-.066.243-.085a6 6 0 0 0-.23-.298a4 4 0 0 1-.629-1.007a8 8 0 0 0-.243-.443c-.125-.22-.284-.495-.45-.804c-.333-.619-.695-1.369-.883-2.1c-.187-.729-.215-1.484.265-2.017c.426-.473 1.172-.669 2.293-.559c-.033-.096-.053-.176-.109-.304a7 7 0 0 0-.983-1.617c-.95-1.178-2.487-2.346-4.863-2.384h-.108zm-6.276.047q-.18 0-.36.01c-.954.053-1.856.322-2.501.986c-.647.663-1.072 1.751-.98 3.553c.019.34.172 1.296.434 2.43c.262 1.136.634 2.471 1.08 3.65c.446 1.18.988 2.207 1.502 2.693c.259.243.484.341.688.333c.205-.01.451-.124.753-.475a40 40 0 0 1 1.71-1.877a3.2 3.2 0 0 1-.932-1.307a3.1 3.1 0 0 1-.17-1.58c.097-.678.11-1.312.099-1.812c-.012-.488-.048-.812-.048-1.015v-.028a8.8 8.8 0 0 1 .559-3.095c.264-.682.658-1.375 1.249-1.936c-.58-.185-1.61-.467-2.725-.52a7 7 0 0 0-.36-.01zm11.714 4.842c-.641.008-1.001.169-1.19.379c-.268.298-.293.82-.127 1.464s.507 1.365.829 1.963c.16.3.316.57.442.788c.127.22.22.376.276.51q.08.181.168.331c.248-.509.293-1.008.267-1.529c-.033-.644-.187-1.303-.164-1.97c.025-.78.184-1.289.198-1.892a6 6 0 0 0-.699-.044m-7.78.105a2.7 2.7 0 0 0-.582.068a4.5 4.5 0 0 0-1.09.412q-.173.09-.33.209l-.02.018c.006.134.033.459.045.936c.01.523-.002 1.19-.106 1.91c-.226 1.568.946 2.866 2.324 2.868c.08-.322.213-.648.345-.992c.384-1.003 1.139-1.734.503-4.589c-.104-.467-.31-.656-.594-.763a1.4 1.4 0 0 0-.495-.077m7.48.187h.048q.094.003.17.02a.4.4 0 0 1 .13.051a.15.15 0 0 1 .071.1v.008a.2.2 0 0 1-.034.124a.6.6 0 0 1-.104.137a.65.65 0 0 1-.364.195a.57.57 0 0 1-.388-.095a.6.6 0 0 1-.123-.108a.24.24 0 0 1-.06-.116a.15.15 0 0 1 .04-.118a.4.4 0 0 1 .111-.082a1.3 1.3 0 0 1 .504-.118zm-7.388.154q.075 0 .157.012c.144.02.273.057.371.112q.072.037.126.097q.028.033.042.073t.009.083a.27.27 0 0 1-.071.141a.6.6 0 0 1-.135.12a.62.62 0 0 1-.424.103a.7.7 0 0 1-.396-.209a.7.7 0 0 1-.112-.15a.25.25 0 0 1-.039-.162c.014-.1.099-.15.18-.18a.8.8 0 0 1 .29-.036zm8.56 6.732h-.003c-.139.05-.253.07-.35.11a.42.42 0 0 0-.225.197c-.06.105-.11.292-.095.61a.5.5 0 0 0 .14.064c.161.048.432.08.735.075c.602-.007 1.344-.143 1.738-.321c.323-.146.623-.336.891-.564c-1.317.264-2.06.194-2.517.011a1.3 1.3 0 0 1-.314-.183m-7.588.086h-.02c-.05.004-.123.02-.263.172c-.33.358-.444.582-.716.792c-.27.21-.623.321-1.327.461c-.223.044-.35.093-.436.132c.028.022.025.028.066.049c.103.055.236.103.342.13c.303.073.8.159 1.319.073s1.058-.327 1.518-.953c.08-.108.088-.268.023-.44c-.067-.17-.211-.318-.313-.36a.6.6 0 0 0-.193-.054z"
					/>
				</svg>
			</a>
			<svg class="w-6 hover:text-red-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M22.219 11.784L11.784 22.219a1.045 1.045 0 0 0 1.476 1.476L23.695 13.26a1.045 1.045 0 0 0-1.476-1.476M20.132.305L.305 20.132a1.045 1.045 0 0 0 1.476 1.476L21.608 1.781A1.045 1.045 0 0 0 20.132.305"
				/>
			</svg>
		</div>
	</div>
</main>
