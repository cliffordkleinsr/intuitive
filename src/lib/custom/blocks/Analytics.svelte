<script lang="ts">
	import { MapTile } from '$lib/custom/blocks';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="m-4 grid gap-3">
	<div class="grid gap-2 lg:grid-cols-2">
		<div class="grid gap-2">
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Poll Overview</Card.Title>
					<Card.Description>Total Responses:</Card.Description>
				</Card.Header>
				<Card.Footer></Card.Footer>
			</Card.Root>
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Geographical Distribution</Card.Title>
					<Card.Description>Responses by County</Card.Description>
				</Card.Header>
				<Card.Content>
					<MapTile />
				</Card.Content>
			</Card.Root>
		</div>
		<div class="grid gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl">Average Completion Time</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Footer class="text-xl font-semibold">
					<p>4m30s</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Gender Distribution</Card.Title>
					<Card.Description>Responses by Gender</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Card Content</p>
				</Card.Content>
				<Card.Footer>
					<p>Card Footer</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Response Distribution</Card.Title>
					<Card.Description>Share of responses to non-responses</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Card Content</p>
				</Card.Content>
				<Card.Footer>
					<p>Card Footer</p>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">Detailed Results</Card.Title>
			<Card.Description>Breakdown by County</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>Card Content</p>
		</Card.Content>
		<Card.Footer>
			<p>Card Footer</p>
		</Card.Footer>
	</Card.Root>
</div>
