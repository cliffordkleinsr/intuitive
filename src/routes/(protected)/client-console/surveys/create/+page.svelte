<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { enhance } from '$app/forms';
	import Clock from '$lib/custom/blocks/clock.svelte';
	import type { PageData, ActionData } from './$types.js';
	import { goto } from '$app/navigation';

	interface Lotto {
		data: PageData;
		form: ActionData;
	}
	let { form, data }: Lotto = $props();

	let loading = $state(false);
	const { surveys, features } = data;
</script>

<div class="m-4 flex max-w-screen-lg flex-col gap-5 lg:m-16">
	<h1 class="ml-3 text-2xl">Create a new project</h1>
	<form
		method="post"
		class="grid gap-4 lg:grid-cols-3"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				switch (true) {
					case result.type === 'failure':
						loading = false;
						await update();
						break;
					case result.type === 'success':
						loading = true;
						await update();
						break;
					case result.type === 'redirect':
						loading = true;
						await update();
						break;
					default:
						break;
				}
			};
		}}
	>
		<Card.Root class="col-span-2">
			<Card.Header>
				<Card.Title>Survey Details</Card.Title>
				<Card.Description>Generate a survey</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6">
					<Label for="title">Survey Title</Label>
					<input
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						type="text"
						name="surveyTitle"
					/>
					<Label for="description">Description</Label>
					<textarea
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						name="surveyDescription"
					></textarea>
					{#if form?.message}
						<Label class="text-red-600">{form.message}</Label>
					{/if}
					{#if features === undefined}
						<div
							class="mt-2 rounded-lg bg-red-500 p-4 text-sm text-white"
							role="alert"
							tabindex="-1"
							aria-labelledby="hs-solid-color-danger-label"
						>
							<span id="hs-solid-color-danger-label" class="font-bold">Error!</span> You are not subscribed
							to any plan!
						</div>
					{:else if surveys.length === features?.maxsurv}
						<div
							class="rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800/10 dark:text-yellow-500"
							role="alert"
						>
							<span class="font-bold">Warning</span> alert! You have exceeded the maximum available surveys
							for your plan
						</div>
					{:else}
						<Form.Button class="max-w-sm" disabled={loading}>
							{#if loading}
								<div class="flex gap-2">
									<span
										class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
										role="status"
										aria-label="loading"
									></span>
									Loading...
								</div>
							{:else}
								Submit
							{/if}
						</Form.Button>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
		<Clock />
		<Button class="max-w-md" variant="outline" href="/client-dash">Cancel</Button>

		<!-- <Button variant="outline" on:click={addData} on:click={() => active=false}>Save</Button> -->
	</form>
	<img class="w-52" src="https://i.postimg.cc/zXc27ndm/vector.png" alt="" />
</div>
