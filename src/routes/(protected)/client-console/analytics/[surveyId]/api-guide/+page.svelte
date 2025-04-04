<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { Info } from 'lucide-svelte';
	import { page } from '$app/state';
</script>

<div class="container mx-auto max-w-4xl py-10">
	<div class="space-y-6">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight">API Documentation</h1>
			<p class="text-muted-foreground">
				Learn how to use our GET endpoint with skip functionality and fuzzy search capabilities.
			</p>
		</div>

		<div class="space-y-4">
			<h2 class="text-2xl font-bold tracking-tight">Endpoint Overview</h2>
			<div class="flex items-center space-x-2">
				<Badge variant="outline" class="border-green-600 text-green-600">GET</Badge>
				<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
					>{page.url.origin + '/client-console/analytics/' + page.params.surveyId + '/rest'}
				</code>
			</div>
			<p>
				This endpoint allows you to retrieve items from the database with support for pagination and
				fuzzy search.
			</p>
		</div>

		<div class="space-y-4">
			<h2 class="text-2xl font-bold tracking-tight">Query Parameters</h2>
			<div class="grid gap-4">
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">Pagination Parameters</h3>
					<div class="grid gap-2">
						<div class="grid grid-cols-3 items-start gap-4">
							<div class="font-mono">skip</div>
							<div class="col-span-2">
								<p>Number of records to skip (for pagination)</p>
								<p class="text-sm text-muted-foreground">
									Example: <code>?skip=10</code> skips the first 10 records
								</p>
							</div>
						</div>
						<div class="grid grid-cols-3 items-start gap-4">
							<div class="font-mono">limit</div>
							<div class="col-span-2">
								<p>Maximum number of records to return</p>
								<p class="text-sm text-muted-foreground">
									Example: <code>?limit=20</code> returns up to 20 records
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<h3 class="text-lg font-semibold">Search Parameters</h3>
					<div class="grid gap-2">
						<div class="grid grid-cols-3 items-start gap-4">
							<div class="font-mono">question</div>
							<div class="col-span-2">
								<p>Search query string</p>
								<p class="text-sm text-muted-foreground">
									Example: <code>?question=keyboard</code> searches for "keyboard"
								</p>
							</div>
						</div>
						<!-- <div class="grid grid-cols-3 gap-4 items-start">
                <div class="font-mono">fuzzy</div>
                <div class="col-span-2">
                  <p>Enable fuzzy matching (true/false)</p>
                  <p class="text-sm text-muted-foreground">
                    Example: <code>?fuzzy=true</code> enables fuzzy search
                  </p>
                </div>
              </div> -->
					</div>
				</div>
			</div>
		</div>

		<Alert.Root>
			<Info class="h-4 w-4" />
			<Alert.Title>Fuzzy Search Implementation</Alert.Title>
			<Alert.Description>
				Our API uses the pg_search extension with BM25 indexing for efficient fuzzy searching. This
				allows for typo-tolerant searches and improved relevance ranking.
			</Alert.Description>
		</Alert.Root>

		<div class="space-y-4">
			<h2 class="text-2xl font-bold tracking-tight">Example Usage</h2>
			<Tabs.Root value="basic">
				<Tabs.List>
					<Tabs.Trigger value="basic">Basic Usage</Tabs.Trigger>
					<Tabs.Trigger value="pagination">Pagination</Tabs.Trigger>
					<Tabs.Trigger value="fuzzy">Fuzzy Search</Tabs.Trigger>
					<Tabs.Trigger value="combined">Combined Parameters</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="basic" class="space-y-4">
					<h3 class="text-lg font-semibold">Basic Search</h3>
					<p>Retrieve items containing the word "keyboard":</p>
					<div class="rounded-md bg-muted p-4">
						<code>GET /api/items?q=keyboard</code>
					</div>
				</Tabs.Content>

				<Tabs.Content value="pagination" class="space-y-4">
					<h3 class="text-lg font-semibold">Pagination</h3>
					<p>Skip the first 10 results and limit to 5 items:</p>
					<div class="rounded-md bg-muted p-4">
						<code>GET /api/items?skip=10&limit=5</code>
					</div>
				</Tabs.Content>

				<Tabs.Content value="fuzzy" class="space-y-4">
					<h3 class="text-lg font-semibold">Fuzzy Search</h3>
					<p>Search for "runing" with fuzzy matching (will match "running"):</p>
					<div class="rounded-md bg-muted p-4">
						<code>GET /api/items?question=runing</code>
					</div>
				</Tabs.Content>

				<Tabs.Content value="combined" class="space-y-4">
					<h3 class="text-lg font-semibold">Combined Parameters</h3>
					<p>
						Search for "shoes" in the "Footwear" category with a minimum rating of 4, using
						pagination:
					</p>
					<div class="rounded-md bg-muted p-4">
						<code>GET /api/items?question=shoes&skip=0&limit=2</code>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
