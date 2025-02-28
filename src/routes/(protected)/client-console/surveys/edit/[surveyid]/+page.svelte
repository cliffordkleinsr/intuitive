<script lang="ts">
	import type { PageData } from './$types';

	// shadcn
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	// lucide
	import { QuestionType } from '$lib/custom/blocks/index';
	import { capitalizeFirstLetter } from '$lib/custom/functions/helpers';
	import RootQuest from '$lib/custom/blocks/question_composition/base/RootQuest.svelte';
	import Portal from '$lib/custom/blocks/Portals/Portal.svelte';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { PreviewComp } from '$lib/custom/blocks/question_composition';
	import { Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll, preloadData, pushState } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Select from '$lib/components/ui/select';
	import Tree from '$lib/custom/blocks/d3tree/Tree.svelte';
	import SettingsBranch from './[questionid]/settingsBranch.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import AvailableQns from './[questionid]/+page.svelte';
	import Split from 'lucide-svelte/icons/split';

	import { MediaQuery } from 'svelte/reactivity';
	import { page } from '$app/state';

	interface PageProps {
		data: PageData;
		form: any;
	}
	let { form, data }: PageProps = $props();

	let portProps = {
		title: 'Question List',
		description: ''
	};
	let { surveydata, surveyqns, features } = $derived(data);

	let loading = $state(false);
	let open = $state(false);

	async function onLinkClick(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		if (e.metaKey || e.ctrlKey) return;
		e.preventDefault();

		const { href } = e.currentTarget;
		const result = await preloadData(href);
		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, {
				available_qns: result.data,
				profile: undefined,
				clients: undefined,
				available_survs: undefined
			});
		} else {
			goto(href);
		}
	}

	$effect(() => {
		if (page.state.available_qns) {
			open = true;
		} else {
			open = false;
		}
	});

	const isDesktop = new MediaQuery('min-width: 768px');
</script>

<div class="m-3">
	<div class="mx-auto grid max-w-screen-xl gap-4">
		<!-- Survey Title -->
		<h1 class="text-lg font-semibold">
			Title: {capitalizeFirstLetter(surveydata.title.toLocaleLowerCase())}
		</h1>
		{#if surveydata.desc}
			<p><span class="font-semibold">Description:</span> {surveydata.desc}</p>
		{/if}
		<!-- Survey Questionnaire -->
		<div class="grid gap-2 md:grid-cols-2">
			<Card.Root class="space-y-3">
				<Card.Header>
					<Card.Title>Survey questions</Card.Title>
					<Card.Description>
						Add questions and select the type of answer to be given.
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-3 lg:grid-cols-2">
					{#if surveyqns.length === features.max_questions}
						<div
							class="rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800/10 dark:text-yellow-500"
							role="alert"
						>
							<span class="font-bold">Warning</span> alert! You have exceeded the maximum available questions
							for your plan
						</div>
					{:else}
						<RootQuest {form} />
					{/if}
				</Card.Content>
			</Card.Root>
			<!-- Types of Questions  -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Types of questions</Card.Title>
					<Card.Description
						>Description on the types of questions that can be generated</Card.Description
					>
				</Card.Header>
				<Card.Content class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
					<QuestionType />
				</Card.Content>
			</Card.Root>
		</div>
		<Portal {...portProps} class="max-h-full max-w-xl">
			{#snippet trigger()}
				Preview Questions
				<ArrowUpRight />
			{/snippet}
			<div class="overflow-auto">
				{#each surveyqns as qs, index}
					<PreviewComp {index} {qs}>
						{#if qs.question_type === 'Optional'}
							<a
								class={[buttonVariants({ variant: 'outline' })]}
								onclick={onLinkClick}
								href="/client-console/surveys/edit/{page.params.surveyid}/{qs.id}"
							>
								Branch
								<Split />
							</a>
							{#if isDesktop.current}
								<Dialog.Root
									bind:open
									onOpenChange={(open) => {
										if (!open) {
											history.back();
										}
									}}
								>
									<Dialog.Content class="max-w-md lg:max-w-2xl">
										<AvailableQns data={page.state.available_qns} />
									</Dialog.Content>
								</Dialog.Root>
							{:else}
								<Drawer.Root
									bind:open
									onOpenChange={(open) => {
										if (!open) {
											history.back();
										}
									}}
								>
									<Drawer.Content>
										<AvailableQns data={page.state.available_qns} />
									</Drawer.Content>
								</Drawer.Root>
							{/if}
						{/if}

						{#snippet edits()}
							<form action="?/editSurvQns" method="post" use:enhance>
								<AlertDialog.Footer>
									<div class="grid w-full gap-2">
										<Input type="text" value={qs.question} name="question" />
										<Input type="text" value={qs.id} class="hidden" name="questionId" />
										{#if qs.question_type === 'Optional' || qs.question_type === 'Multiple'}
											<Label>Options</Label>
											{#each qs.options as option, i}
												{@const id = qs.optionid[i]}
												{#if option != null}
													<div class="flex gap-4">
														<Input type="text" value={option} name="option" />
														<Input type="text" value={id} name="optionId" class="hidden" />
														<!-- svelte-ignore node_invalid_placement_ssr -->
														<form action="?/deleteOpt" method="post">
															<Input type="text" value={id} name="optionId" class="hidden" />
															<Button size="icon" variant="secondary" type="submit">
																<Trash2 class="size-4 text-destructive" />
															</Button>
														</form>
													</div>
												{/if}
											{/each}
										{/if}
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<Button type="submit">Save</Button>
									</div>

									<!--<AlertDialog.Action>Continue</AlertDialog.Action> -->
								</AlertDialog.Footer>
							</form>
						{/snippet}
						{#snippet deletes()}
							<form
								action="?/deleteSurvQns"
								method="post"
								use:enhance={() => {
									loading = true;
									return async ({ result, update }) => {
										if (result.type === 'success') {
											loading = false;
											await invalidateAll();

											loading = false;
											toast.success('Deleted Successfully');
										} else {
											loading = false;
											await update();
										}
									};
								}}
							>
								<Input type="text" value={qs.id} class="hidden" name="questionId" />
								<Input type="text" value={qs.question_type} class="hidden" name="questionType" />
								<Button class="w-full" type="submit" disabled={loading} variant="destructive">
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
										Continue
									{/if}
								</Button>
							</form>
						{/snippet}
					</PreviewComp>
				{/each}
			</div>
		</Portal>
		<Portal title="Logic Path" description="" class=" max-w-[90rem]">
			{#snippet trigger()}
				Preview logic path
				<ArrowUpRight />
			{/snippet}
			<Tree />
		</Portal>
	</div>
</div>
