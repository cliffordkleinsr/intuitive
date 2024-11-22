<script lang="ts">
	// SHADCN UI
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	// SUPER FORMS
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// ZOD SCHEMA
	import { signinCSchema, type SigninCSchema } from './schema';

	// sonner
	import { toast } from 'svelte-sonner';
	// app stores
	import { page } from '$app/stores';
	// custom toaster
	import Pretoast from '$lib/custom/blocks/pretoast.svelte';

	import { sineInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import Meta from '$lib/custom/seo/meta.svelte';

	// KitLoad<MiddleWare>
	let { data }: { data: SuperValidated<Infer<SigninCSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(signinCSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.error(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	// custom param message

	let visible = $state(true);

	setTimeout(() => {
		visible = false;
	}, 2000);

	let msg: string = $derived($page.url.searchParams.get('notification') ?? '');

	const Pageprops = {
		title: 'Client Sign in • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...Pageprops} />
{#if visible && msg}
	<div transition:fade={{ delay: 200, duration: 300, easing: sineInOut }}>
		<Pretoast message={msg} type="warning" />
	</div>
{/if}
<div class="mb-10 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/client/register">Client Registration</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Page>Client Login</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
<div class="mb-56 w-full place-content-center">
	<!-- <SuperDebug data={$formData}/> -->
	<form method="post" use:enhance>
		<Card.Root class="mx-auto mb-16 max-w-sm lg:mx-auto lg:max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl text-primary">Login</Card.Title>
				<Card.Description>Login To The Client DashBoard</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-2">
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input {...props} type="email" bind:value={$formData.email} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="grid gap-2">
						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password</Form.Label>
									<Input {...props} type="password" bind:value={$formData.password} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					{#if $delayed}
						<Button class="flex gap-2" disabled={$delayed}>
							<span
								class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
								role="status"
								aria-label="loading"
							></span>
							Loading...
						</Button>
					{:else}
						<Form.Button>Login</Form.Button>
					{/if}
					<!-- <Button variant="outline" class="w-full">Sign up with Google</Button> -->
				</div>
				<div class="mt-4 text-center text-sm">
					Don't have an account?
					<a href="/client/register" class="underline hover:text-primary"> Register </a>
				</div>
				<div class="mt-4 text-center text-sm">
					<a href="/client/password/reset" class="underline hover:text-primary">Forgot Password?</a>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
