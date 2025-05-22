<script lang="ts">
	// SHADCN UI
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	// SUPER FORMS
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// ZOD SCHEMA
	import { loginSchema } from './schema';

	// sonner
	import { toast } from 'svelte-sonner';
	import Meta from '$lib/custom/seo/meta.svelte';
	import type { PageData } from './$types';

	// KitLoad<MiddleWare>
	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(loginSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.error(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'warning') {
				toast.warning(alertText);
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
	const Pageprops = {
		title: 'Client Sign in • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...Pageprops} />
<div class="mb-10 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
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
					<a class={[buttonVariants({ variant: 'outline' }), 'w-full']} href="/client/login/google">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
							<path
								fill="#ffc107"
								d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
							/>
							<path
								fill="#ff3d00"
								d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
							/>
							<path
								fill="#4caf50"
								d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
							/>
							<path
								fill="#1976d2"
								d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
							/>
						</svg>
						Sign up/ Sign in with Google
					</a>
					<!-- <Button 
						variant="outline"
						href="/client/login/google"
						class="w-full"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
							<path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
							<path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
							<path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
							<path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
						</svg>
						Sign in with Google
						
						</Button> -->
				</div>
				<div class="mt-4 text-center text-sm">
					<a href="/client/register" class="underline hover:text-primary"
						>Or register with an Email</a
					>
				</div>
				<!-- <div class="py-1 text-center text-xs">
					<a href="/client/password/reset" class="underline hover:text-primary">Forgot Password?</a>
				</div> -->
			</Card.Content>
		</Card.Root>
	</form>
</div>
