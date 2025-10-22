<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './(tableau)/columns';
	import Portal from '$lib/custom/blocks/Portals/Portal.svelte';
	import Copy from 'lucide-svelte/icons/copy';
	import CopyCheck from 'lucide-svelte/icons/copy-check';
	import Mail from 'lucide-svelte/icons/mail';
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog';
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import Template from '$lib/custom/blocks/Portals/Template.svelte';
	import { tempList } from './templates';

	let { data }: { data: PageData } = $props();
	const { all_surv, draft_surv, live_surv, closed_surv, count, payment } = data;

	let loading = $state(false);

	let temp = $state('');
</script>

<div class="m-4 mt-4 flex flex-col gap-10">
	<div class="grid gap-2 md:grid-cols-4 md:gap-8">
		<Card.Root class="space-y-5">
			<Card.Header>
				<Card.Title>
					<ChartLine class="size-6 text-primary" />
				</Card.Title>
				<Card.Description class="text-balance leading-relaxed">
					Create engaging surveys to improve your audience:
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button variant="default" href="/client-console/surveys/create">Create New Survey</Button>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="max-w-lg">
			<Card.Header class="pb-2">
				<Card.Title class="text-3xl">{data.features.plan === 'Free' ? 1 : tempList.size}</Card.Title
				>
				<Card.Description>Available Templates</Card.Description>
			</Card.Header>
			<Card.Content></Card.Content>
			<Card.Footer>
				<Portal title="Choose a template" class="max-w-[800px]" variant="default">
					{#snippet trigger()}
						Use Available Templates
						<ArrowUpRight />
					{/snippet}
					<div class="grid grid-cols-3 gap-2">
						{#each Array.from(tempList.entries()) as [title, config]}
							<Card.Root
								class={[
									config.gradient,
									data.features.plan === 'Free' && title === 'Customer Satisfaction (CSAT)'
										? ''
										: 'pointer-events-none select-none opacity-60 blur-sm'
								]}
							>
								<Card.Header>
									<Card.Title class="text-start text-white">{title}</Card.Title>
									<Card.Description class="text-white"
										>Total questions: {config.questions.length}</Card.Description
									>
								</Card.Header>
								<Card.Content></Card.Content>
								<Card.Footer>
									<Template
										title="Preview"
										class="max-w-[600px]"
										onclick={() => (temp = temp = title)}
									>
										<form
											action="?/addTemplate"
											method="post"
											class="flex flex-col gap-2"
											use:enhance={() => {
												loading = true;
												return async ({ result }) => {
													if (result.type === 'redirect') {
														loading = false;
														goto(result.location, { invalidateAll: true });
													} else {
														await applyAction(result);
													}
												};
											}}
										>
											<!-- Title input -->
											<div class="flex items-center justify-center gap-3">
												<span class="font-semibold">Title</span>
												<Input type="text" bind:value={temp} name="title" />
											</div>

											<!-- Questions -->
											{#each config.questions as template}
												<div class="flex items-center justify-center gap-3">
													<span>{template.id + 1}</span>
													<Input
														type="text"
														bind:value={template.qns}
														name={template.name === 'optional_question'
															? `${template.name}_${template.id}`
															: template.name}
													/>
												</div>
												<div class="mx-7 mr-auto flex max-w-xs flex-col items-center gap-1">
													{#if template.name === 'optional_question'}
														{#each template.options as _, idx}
															<Input
																type="text"
																value={template?.options?.[idx]}
																name={`radio_option_${template.id}`}
															/>
														{/each}
													{/if}
												</div>
											{/each}
											<Button class="w-full" type="submit" disabled={loading} variant="black">
												{#if loading}
													<div class="flex gap-2">
														<span
															class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white dark:text-black"
															role="status"
															aria-label="loading"
														></span>
														Loading...
													</div>
												{:else}
													Add
												{/if}
											</Button>
										</form>
									</Template>
								</Card.Footer>
							</Card.Root>
						{/each}
					</div>
				</Portal>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="max-w-lg">
			<Card.Header class="pb-2 ">
				<Card.Title class="text-4xl">{all_surv.length}</Card.Title>
				<Card.Description>Total surveys</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-xs text-muted-foreground">+{all_surv.length}% all time</div>
			</Card.Content>
			<Card.Footer>
				<Progress value={all_surv.length} aria-label="{all_surv.length}% increase" />
			</Card.Footer>
		</Card.Root>
		<Card.Root class="max-w-lg">
			<Card.Header class="pb-2">
				<Card.Title class="text-3xl">{count}</Card.Title>
				<Card.Description>Total agents</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-xs text-muted-foreground">+{count / 100}% from last month</div>
			</Card.Content>
			<Card.Footer>
				<Progress value={count} aria-label="{count / 100}% increase" />
			</Card.Footer>
		</Card.Root>

		{#if live_surv.length > 0}
			<Card.Root class="max-w-lg">
				<Card.Header class="pb-2">
					<Card.Title class="text-end text-lg">Total Running Surveys</Card.Title>
					<Card.Description class="text-end text-lg">
						<Badge variant="secondary">
							{live_surv.length}
						</Badge>
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button class="w-1/2" href="/client-console/shared" variant="secondary">View All</Button>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
	<Tabs.Root value="draft" class="mx-auto w-96 lg:w-full">
		<Tabs.List class="mx-5 grid w-80 grid-cols-3 lg:w-[35rem]">
			<Tabs.Trigger value="draft" data-intro="This tab shows draft surveys.">Draft</Tabs.Trigger>
			<Tabs.Trigger value="running" data-intro="This tab shows surveys that are live."
				>Running</Tabs.Trigger
			>
			<Tabs.Trigger value="completed" data-intro="This tab shows surveys that have been completed."
				>Completed</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="draft">
			<DataTable data={draft_surv} columns={columns('Draft')} />
		</Tabs.Content>
		<Tabs.Content value="running">
			<DataTable data={live_surv} columns={columns('Live')} />
		</Tabs.Content>
		<Tabs.Content value="completed">
			<DataTable data={closed_surv} columns={columns('Closed')} />
		</Tabs.Content>
	</Tabs.Root>
</div>
