<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { MessageSquare } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="min-h-screen px-4 py-12">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 flex items-center gap-4">
			<div>
				<h1 class="text-4xl font-bold">Feedback Dashboard</h1>
				<p class="mt-1 text-gray-500">View and manage all submitted feedback</p>
			</div>
		</div>

		<!-- Stats Card -->
		<Card class=" mb-8 p-6">
			<div class="flex items-center gap-4">
				<div class="rounded-lg bg-blue-100 p-3">
					<MessageSquare class="h-6 w-6 text-blue-600" />
				</div>
				<div>
					<p class="text-sm font-medium">Total Feedback</p>
					<p class="text-3xl font-bold">
						{data.feedback.length}
					</p>
				</div>
			</div>
		</Card>

		<!-- Feedback List -->
		{#if data.feedback.length === 0}
			<Card class="p-12 text-center">
				<MessageSquare class="mx-auto mb-4 h-12 w-12" />
				<h2 class="mb-2 text-xl font-semibold">No feedback yet</h2>
				<p class="mb-6 text-gray-600">
					Feedback submissions will appear here once users start sharing their thoughts.
				</p>
			</Card>
		{:else}
			<div class="space-y-4">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-bold">All Feedback</h2>
				</div>

				<div class="grid gap-4">
					{#each data.feedback as feedback}
						<Card class="p-6 transition-shadow hover:shadow-md">
							<div class="mb-4 flex items-start justify-between">
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-gray-100">
										{feedback.name}
									</h3>
									<p class="mt-1 text-sm text-gray-500">
										{feedback.email}
									</p>
								</div>
								<div class="flex items-center gap-2">
									<p class="whitespace-nowrap text-xs text-gray-500">
										{feedback.timestamp}
									</p>
								</div>
							</div>

							<div class="rounded-lg border p-4">
								<p class="whitespace-pre-wrap leading-relaxed text-gray-700">
									{feedback.message}
								</p>
							</div>
						</Card>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>
