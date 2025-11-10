<script lang="ts">
	import type { PageData } from './$types';
	import UserRound from 'lucide-svelte/icons/user-round';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { enhance, applyAction } from '$app/forms';
	import { goto, invalidate, invalidateAll, preloadData } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	
	let { data }: { data: PageData } = $props();
	const { details } = $derived(data);
	let dis_loading = $state(false);
	let del_loading = $state(false)
</script>

<Card.Root
	class="m-5 mx-auto grid max-w-md select-none gap-2 rounded-md p-4 shadow-sm lg:max-w-xl"
>
	<div class="flex gap-3">
		<UserRound class="size-8" />
		<p class="text-2xl font-semibold">{details.name}</p>
	</div>
	<p class="mx-11 text-sm">{details.email}</p>
	<div class="grid gap-5 lg:grid-cols-2">
		<div class="flex gap-2">
			<h1 class="text-lg font-semibold">Name:</h1>
			<p class="py-[7px] text-sm text-muted-foreground underline">
				{details.name}
			</p>
		</div>
		<div class="flex gap-2">
			<h1 class="text-lg font-semibold">Email:</h1>
			<p class="py-[7px] text-sm text-muted-foreground underline">
				{details.email}
			</p>
		</div>
		<div class="flex gap-2">
			<h1 class="text-lg font-semibold">Phone:</h1>
			<p class="py-[7px] text-sm text-muted-foreground underline">
				{details.phone}
			</p>
		</div>
		<div class="flex gap-2">
			<h1 class="text-lg font-semibold">Company:</h1>
			<p class="py-[7px] text-sm text-muted-foreground underline">
				{details.company}
			</p>
		</div>
	</div>
	<Separator class="mt-4" />
	<h1 class="m-5 text-end text-3xl font-bold">Summary Statistics</h1>
	<div class="grid grid-cols-2 gap-2">
		<div class="grid gap-2">
			<h1 class="text-xl font-semibold text-muted-foreground">Total Surveys</h1>
			<p class="text-4xl font-bold text-green-500">{details.surveys}</p>
		</div>
		<div class="grid gap-2">
			<h1 class="text-xl font-semibold text-muted-foreground">Client Subscription</h1>
			<p class="text-4xl font-bold text-green-600">{details.packagetype}</p>
		</div>
		<div class="grid gap-1">
			<h1 class="text-xl font-semibold text-muted-foreground">Active</h1>
			<p class="text-4xl font-bold {details.inactive ? 'text-red-600' : 'text-green-600'} ">
				{!details.inactive}
			</p>
		</div>
	</div>
	<Card.Root class="mt-14">
		<Card.Header>
			<Card.Title class="mx-auto">Danger Zone</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			<form method="post" action="?/disableUser" 
				use:enhance={() => {
					dis_loading = true;
					return async ({ result }) => {
						dis_loading = false;
						if (result.type === 'success') {
							toast.success('Updated Successfully');
							await invalidateAll();
						} else {
							await applyAction(result);
						}
					};	
				}}
			>
				<input type="text" value={!details.inactive} name="active" hidden />
				<input type="text" value={true} name="delete" hidden />
				<Button 
					type="submit"
					variant="secondary"
					class="w-full"
				>
					{#if dis_loading}
						<div class="flex gap-2">
							<span
								class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
								role="status"
								aria-label="loading"
							></span>
							Loading...
						</div>
					{:else}
						{details.inactive ? 'Enable' : 'Disable'}
					{/if}
				</Button>
			</form>
			<form method="post" action="?/deleteUser"
				use:enhance={() => {
					del_loading = true;
					return async ({ result }) => {
						dis_loading = false;
						if (result.type === 'redirect') {
							toast.success('User Deleted');
							goto(result.location, { invalidateAll: true });
						} else {
							await applyAction(result);
						}
					};	
				}}
			>
				<Button 
					type="submit"
					variant="destructive" 
					class="w-full"
				>	
					{#if del_loading}
							<div class="flex gap-2">
								<span
									class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
									role="status"
									aria-label="loading"
								></span>
								Loading...
							</div>
					{:else}
						Delete this user
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
	<!-- <Button class="">Save Changes</Button> -->
</Card.Root>
