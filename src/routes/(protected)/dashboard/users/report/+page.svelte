<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { BarChart, PieChart, ScatterChart } from 'layerchart';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { counties } from '$lib/geojson/counties';
	import { CakeMap } from '$lib/custom/blocks';
	import FileText from 'lucide-svelte/icons/file-text';
	let { data }: { data: PageData } = $props();
	const {
		age_groups: { age_distribution },
		level_education,
		county_analytics,
		gender_analytics,
		income_analytics,
		sector_analytics
	} = data;

	let printstate = $state(false) as boolean;

	$effect(() => {
		window.onafterprint = function () {
			printstate = !printstate;
		};
	});
</script>

<div class="mx-auto grid gap-2 py-5">
	<div id="kutton" class="flex gap-2 pl-3">
		<Button
			variant="secondary"
			onclick={() => {
				printstate = !printstate;
				setTimeout(() => {
					window.print();
				}, 50);
			}}
			size="sm"
		>
			Export PDF <FileText />
		</Button>
	</div>
	<div class="grid gap-2 px-2 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Age distribution</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-[300px] rounded border p-4">
					<BarChart
						data={age_distribution}
						x="label"
						y="value"
						props={{
							bars: { class: 'fill-orange-400' }
						}}
					/>
				</div>
			</Card.Content>
			<Card.Footer></Card.Footer>
		</Card.Root>
		<!-- End -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Education Level</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-[300px] rounded border p-4">
					<BarChart
						data={level_education}
						padding={{ left: 60, bottom: 16 }}
						x="percentage"
						y="education"
						props={{
							bars: { class: 'fill-orange-400' }
						}}
						orientation="horizontal"
					/>
				</div>
			</Card.Content>
			<Card.Footer></Card.Footer>
		</Card.Root>
	</div>
	<!-- End -->
	<div class="grid gap-2 px-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Geographical Distribution</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<div class={printstate ? 'h-[480px]' : 'h-[600px]'}>
					<CakeMap geoObject={counties} locale_analytics={county_analytics} />
				</div>
			</Card.Content>
		</Card.Root>
		<!-- End -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Sector Distribution</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-[450px] p-4 {printstate ? 'max-w-[1150px]' : ''} mb-3 rounded border">
					<BarChart
						data={sector_analytics}
						padding={{ left: 90, bottom: 20 }}
						x="count"
						y="sector"
						props={{
							bars: { class: 'fill-orange-400' }
						}}
						orientation="horizontal"
					/>
				</div>
			</Card.Content>
		</Card.Root>
		<!-- End -->
		<div class="grid gap-2 lg:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Gender Distribution</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[300px] rounded border p-4">
						<PieChart
							data={gender_analytics}
							key="gender"
							value="count"
							legend
							cRange={['hsl(var(--orange-base))', 'hsl(var(--orange-light))']}
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<!-- End -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Income Distribution</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[300px] rounded border p-4">
						<BarChart
							data={income_analytics}
							x="income"
							y="count"
							props={{
								bars: { class: 'fill-orange-400' }
							}}
						/>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<!-- End -->
	</div>
</div>

<style>
	:root {
		--orange-light: 34, 100%, 92%;
		--orange-base: 27, 96%, 61%;
	}
	@media print {
		@page {
			size: auto; /* auto is the initial value */
			margin: 0; /* this affects the margin in the printer settings */
		}
		#kutton {
			visibility: hidden;
		}
	}
</style>
