<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { signupSchema, type SignupSchema } from './schema';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { PhoneInput } from '$lib/components/ui/phone-input';

	let { data }: { data: SuperValidated<Infer<SignupSchema>> } = $props();
	const form = superForm(data, {
		dataType: 'form',
		validators: zod4Client(signupSchema),
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
</script>

<div class="mb-5 mt-10 flex flex-1 justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator></Breadcrumb.Separator>
			<Breadcrumb.Item>
				<Breadcrumb.Page>Client Signup</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>

<form method="post" class="m-2 h-[80dvh]" use:enhance>
	<Card.Root class="mx-auto max-w-lg">
		<Card.Header>
			<Card.Title class="text-xl text-primary">Sign Up</Card.Title>
			<Card.Description>Create a Client account to begin gathering insights</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Form.Field {form} name="fullname">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Full Name</Form.Label>
								<Input
									{...props}
									bind:value={$formData.fullname}
									placeholder="Input your fullname"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input
									{...props}
									type="email"
									bind:value={$formData.email}
									placeholder="Input your email"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="phoneno">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Phone Number</Form.Label>
								<PhoneInput
									{...props}
									class="w-full"
									country="KE"
									placeholder="Enter a phone number"
									bind:value={$formData.phoneno}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
			<div class="grid gap-2">
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<div class="max-w-3xs flex w-full flex-col gap-2">
								<Password.Root>
									<Password.Input
										{...props}
										bind:value={$formData.password as string}
										placeholder="Input password"
									>
										<Password.ToggleVisibility />
									</Password.Input>
								</Password.Root>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid gap-2">
				<Form.Field {form} name="passwordConfirm">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Confirm Password</Form.Label>
							<!-- <Input
									{...props}
									type="password"
									bind:value={$formData.passwordConfirm}
									placeholder="Confirm password"
								/> -->
							<div class="max-w-3xs flex w-full flex-col gap-2">
								<Password.Root>
									<Password.Input
										{...props}
										bind:value={$formData.passwordConfirm as string}
										placeholder="Confirm password"
									>
										<Password.ToggleVisibility />
									</Password.Input>
								</Password.Root>
							</div>
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
				<Form.Button>Create an account</Form.Button>
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
				Or Sign up with Google
			</a>
			<div class="mt-4 text-center text-sm">
				<a href="/client/login" class="underline hover:text-primary"
					>Have an account? login with an email</a
				>
			</div>
		</Card.Content>
		<!-- <SuperDebug data={$formData} /> -->
	</Card.Root>
</form>
