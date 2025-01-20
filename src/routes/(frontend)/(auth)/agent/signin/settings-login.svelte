<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signinRSchema, type SigninRSchema } from './schema';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import Meta from '$lib/custom/seo/meta.svelte';

	// KitLoad<MiddleWare>
	export let data: SuperValidated<Infer<SigninRSchema>>;

	const form = superForm(data, {
		validators: zodClient(signinRSchema)
	});

	const { form: formData, enhance, delayed } = form;
	const props = {
		title: 'Agent Sign In • Intuitive Insights KE',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...props} />
<div class="mb-10 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/agent/register">Agent Registration</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Page>Agent Login</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
<div class="mb-56 w-full place-content-center">
	<form action="" method="POST" use:enhance>
		<Card.Root class="mx-auto mb-16 max-w-sm lg:mx-auto lg:max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl text-primary">Login</Card.Title>
				<Card.Description>Login To The Agent DashBoard</Card.Description>
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
					<!-- <SuperDebug data={$formData}/> -->
					<!-- <Button type="submit" class="w-full">t</Button> -->
					<!-- <Button variant="outline" class="w-full">Sign up with Google</Button> -->
				</div>
				<div class="mt-4 text-center text-sm">
					Don't have an account?
					<a href="/agent/register" class="underline hover:text-primary"> Register </a>
				</div>
				<div class="mt-4 text-center text-sm">
					<a href="/agent/password/reset" class="underline hover:text-primary">Forgot Password?</a>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
