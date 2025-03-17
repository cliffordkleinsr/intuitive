<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { fade } from 'svelte/transition';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { geoAlbersUsa, geoAlbers, geoMercator, geoOrthographic, geoNaturalEarth1 } from 'd3-geo';
	import { feature } from 'topojson-client';
	import * as Table from '$lib/components/ui/table';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import {
		Canvas,
		Chart,
		GeoPath,
		Svg,
		Graticule,
		Tooltip,
		geoFitObjectTransform,
		TransformContext,
		Legend,
		BarChart,
		PieChart
	} from 'layerchart';
	import type { GeometryObjectA } from 'topojson-specification';
	import { index } from 'd3-array';
	import { scaleQuantile } from 'd3-scale';
	import { interpolateOranges, schemeOranges } from 'd3-scale-chromatic';
	import { format, stringify } from '@layerstack/utils';
	import { quantize } from 'd3-interpolate';

	import UnfoldVertical from 'lucide-svelte/icons/unfold-vertical';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	// import { states } from '$lib/geojson/states';
	import { cn } from '$lib/utils';
	let { data }: { data: PageData } = $props();

	let variable = $state() as boolean[];
	variable = data.analytics.map(
		(x) => x.question_type !== 'Ranking' && x.question_type !== 'Single'
	);
	const countries = feature(data.geojson, data.geojson.objects.countries);
	let selectedState: GeometryObjectA['id'] | null = $state(null);

	const populationByFipsSt = index(
		data.popn_cnty.map((v) => ({
			id: v.id?.trim()?.toUpperCase(), // Convert to uppercase to match COUNTY_NAM
			count: v.count
		})),
		(d) => d.id
	);

	// let selectedCountiesFeatures = $derived(
	// 	states
	// 		.filter((f) => String(f.id) === selectedState)
	// 		.flatMap((county) =>
	// 			county.features.map((feature) => ({
	// 				...feature,
	// 				properties: {
	// 					...feature.properties,
	// 					name:
	// 						feature.properties?.COUNTY_NAM ||
	// 						feature.properties?.CONSTITUEN ||
	// 						`County ${feature.id}`,
	// 					data: populationByFipsSt.get(feature?.properties?.COUNTY_NAM)
	// 				}
	// 			}))
	// 		)
	// );

	const populationByFips = index(data.popn, (d) => d.id);
	let enrichedCountriesFeatures = $derived.by(() => {
		return countries.features.map((feature) => {
			return {
				...feature,
				properties: {
					...feature.properties,
					data: populationByFips.get(feature.properties.name)
				}
			};
		});
	});
	let colorScale = $derived.by(() => {
		// Determine the dataset based on zoom level
		const dataset = selectedState
			? data.popn_cnty.map((d: any) => d.count) // Use county data if zoomed in
			: data.popn.map((d: any) => d.count); // Use country data otherwise

		return scaleQuantile<string, string>().domain(dataset).range(schemeOranges[7]);
	});

	let printstate = $state(false) as boolean;
	let processedData: any[] = $state([]);
	let proxyprocessedData = () => processedData;
	let rankData: any[] = [];
	for (const { question_type, answer_statistics } of data.analytics) {
		if (question_type === 'Ranking') {
			processedData = ['1', '2', '3', '4', '5'].map((rank) => {
				rankData = answer_statistics.filter((d) => d.rank === rank);
				return {
					rank,
					...Object.fromEntries(rankData.map((d) => [d.answer, d.percentage]))
				};
			});
		}
	}

	let keys: any = $state({});
	let series: any[] = $state([]);
	const keyColors = [
		'hsl(var(--color-orange))',
		'hsl(var(--color-violet))',
		'hsl(var(--color-cyan))',
		'hsl(var(--color-blue))',
		'hsl(var(--color-stone))'
	];
	if (proxyprocessedData().length > 0) {
		keys = Object.keys(proxyprocessedData()[0]).filter((k) => k !== 'rank');
		series = proxyprocessedData().map((_, index) => ({
			key: keys[index],
			color: keyColors[index]
		}));
	}

	$effect(() => {
		window.onafterprint = function () {
			variable = variable.map((x) => (x = !x));
			printstate = !printstate;
		};

		return () => {
			processedData = [];
			rankData = [];
			variable = [];
		};
	});
	// $inspect(selectedCountiesFeatures)
	// data.sec = [...data.sec, {id:"Health", count: 3}, {id:"Politics", count: 5}, {id: "Agriculture", count:3}, {id: "Education", count:3}]
</script>

<div class="px-3 py-5">
	<div class="grid grid-cols-[repeat(2,1fr)] gap-x-[10px] gap-y-[10px]">
		<div class="col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Geographical Distribution</Card.Title>
					<Card.Description>Responses Globally</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="relative h-[550px] overflow-hidden">
						<Chart
							geo={{
								projection: geoNaturalEarth1,
								fitGeojson: countries,
								applyTransform: ['scale', 'translate']
							}}
							transform={{
								initialScrollMode: 'none',
								tweened: { duration: 800, easing: cubicOut }
							}}
							let:projection
							let:transform
							let:tooltip
							let:width
							let:height
						>
							{@const strokeWidth = 1 / transform.scale}
							<Svg>
								<g>
									{#each enrichedCountriesFeatures as feature}
										<GeoPath
											geojson={feature}
											{tooltip}
											fill={colorScale(feature.properties.data?.count ?? 0)}
											class="stroke-none"
											onclick={() => {
												if (selectedState === feature.id) {
													selectedState = null;
													transform.reset();
												} else {
													selectedState = feature.id;
													const featureTransform = geoFitObjectTransform(
														projection,
														[width, height],
														feature
													);
													transform.setTranslate(featureTransform.translate);
													transform.setScale(featureTransform.scale);
												}
											}}
										/>
									{/each}
								</g>
								<g class="countries">
									{#each countries.features as feature}
										<GeoPath
											geojson={feature}
											class={cn('pointer-events-none fill-none stroke-black/30')}
											{tooltip}
										/>
									{/each}
								</g>

								<!-- {#each selectedCountiesFeatures as feature (feature.id)}
									<g in:fade={{ duration: 300, delay: 600 }} out:fade={{ duration: 300 }}>
										<GeoPath
											geojson={feature}
											fill={colorScale(feature.properties.data?.count ?? 0)}
											{tooltip}
											class="stroke-none"
											strokeWidth={1 / transform.scale}
											onclick={() => {
												selectedState = null;
												transform.reset();
											}}
										/>
									</g>
								{/each} -->
							</Svg>
							<Legend
								scale={colorScale}
								title="Responses"
								tickFormat={(d) => format(d, 'metric', { maximumSignificantDigits: 2 })}
								class="absolute bottom-0 m-1 rounded bg-surface-100/80 px-2 py-1 backdrop-blur-sm"
							/>
							<Tooltip.Root let:data>
								{@const d =
									populationByFips.get(data.properties.name) ??
									populationByFipsSt.get(data.properties.name)}
								{@const [longitude, latitude] = projection.invert?.([tooltip.x, tooltip.y]) ?? []}
								<Tooltip.Header>{data.properties.name}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item label="longitude" value={longitude} format="decimal" />
									<Tooltip.Item label="latitude" value={latitude} format="decimal" />
									<Tooltip.Item
										label="Total Responses"
										value={d?.count ?? 0}
										format="integer"
										valueAlign="right"
									/>
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
				<Card.Footer></Card.Footer>
			</Card.Root>
		</div>
		<div class="col-span-2 md:col-span-1">
			<h1 class="text-sm text-muted-foreground">Responses by Sector</h1>
			<div class="relative h-[400px] w-full rounded border p-4">
				<PieChart
					data={data.sec}
					key="id"
					value="count"
					innerRadius={-20}
					cornerRadius={5}
					padAngle={0.02}
					placement="right"
					legend={{
						classes: { label: 'text-xs block', swatches: 'block' },
						placement: 'top-left',
						orientation: 'vertical'
					}}
					cRange={quantize(interpolateOranges, 20)}
				/>
			</div>
		</div>
		<div class="col-span-2 md:col-span-1">
			<h1 class="text-sm text-muted-foreground">Responses by Literacy rate</h1>
			<div class="relative h-[400px] w-full rounded border p-4">
				<BarChart
					data={data.edu}
					x="id"
					y="count"
					props={{
						bars: { class: 'fill-orange-400' },
						yAxis: { format: (value) => format(Math.abs(value), 'metric') }
					}}
				/>
			</div>
		</div>
		<div class="col-span-2 space-y-5">
			{#each data.analytics as statistic, ix}
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-2xl">{ix === 0 ? 'Detailed Results' : ''}</Card.Title>
						<Card.Description class=" font-semibold">
							<span>{ix + 1}.</span> {statistic.question}</Card.Description
						>
					</Card.Header>
					<Card.Content class="relative overflow-x-auto">
						{#if statistic.question_type === 'Ranking'}
							<div
								class={[
									variable[ix] && printstate ? 'max-w-[800px]' : '',
									'mb-3 h-96 rounded border p-4'
								]}
							>
								<BarChart
									data={processedData}
									orientation="horizontal"
									y="rank"
									{series}
									seriesLayout="stack"
									props={{
										xAxis: { format: 'metric' },
										yAxis: { format: 'none' }
									}}
									legend
								/>
							</div>
						{/if}
						<!-- Add horizontal scroll only if needed -->
						{#if statistic.question_type === 'Single' || statistic.question_type === 'Ranking'}
							<Collapsible.Root class="space-y-2" bind:open={variable[ix]}>
								<div>
									<Collapsible.Trigger>
										{#snippet child({ props })}
											<Button variant="secondary" size="sm" {...props}>
												<UnfoldVertical />
												Expand
											</Button>
										{/snippet}
									</Collapsible.Trigger>
								</div>
								<Collapsible.Content forceMount>
									{#snippet child({ props, open })}
										{#if open}
											<div
												class=""
												{...props}
												transition:fade={{ duration: 400, easing: cubicInOut, delay: 50 }}
											>
												<Table.Root class="w-full min-w-[300px]">
													<!-- Set minimum width -->
													<Table.Header>
														<Table.Row>
															<Table.Head class="w-[40px]"><!-- Reduced width --></Table.Head>
															<Table.Head
																class="w-full {statistic.question_type === 'Ranking'
																	? 'md:w-[20%]'
																	: 'md:w-[40%]'}"
																>{statistic.question_type === 'Ranking'
																	? 'Option'
																	: 'Answer'}</Table.Head
															>
															{#if statistic.question_type === 'Ranking'}
																<Table.Head class="w-full md:w-[20%]">Rank</Table.Head>
															{/if}
															<Table.Head class="w-[60px] md:w-[25%]"></Table.Head>
															<Table.Head class="w-[80px] text-right">%</Table.Head>
															<Table.Head class="w-[60px] text-right">#</Table.Head>
														</Table.Row>
													</Table.Header>
													<Table.Body>
														{#each statistic.answer_statistics as res, ix}
															<Table.Row class="space-y-1">
																<!-- Reduced spacing -->
																<Table.Cell class="text-sm font-normal">A{ix + 1}</Table.Cell>
																<Table.Cell class="line-clamp-3 text-sm font-normal"
																	>{res.answer}</Table.Cell
																>
																{#if statistic.question_type === 'Ranking'}
																	<Table.Cell class="text-sm font-normal">{res.rank}</Table.Cell>
																{/if}
																<Table.Cell class="font-normal">
																	<Progress value={res.percentage} class="h-2 w-full" />
																</Table.Cell>
																<Table.Cell class="text-right text-sm font-normal">
																	{Math.round(res.percentage)}%
																</Table.Cell>
																<Table.Cell class="text-right text-sm font-normal">
																	{res.count}
																</Table.Cell>
															</Table.Row>
															{#if res.rank === '5'}
																<Table.Row class="bg-primary/5">
																	<Table.Cell></Table.Cell>
																	<Table.Cell></Table.Cell>
																	<Table.Cell></Table.Cell>
																	<Table.Cell></Table.Cell>
																	<Table.Cell class="text-right text-sm font-normal"
																		>100%</Table.Cell
																	>
																	<Table.Cell class="text-right text-sm font-normal">
																		{data.total_responses}
																	</Table.Cell>
																</Table.Row>
															{/if}
														{/each}
													</Table.Body>
												</Table.Root>
											</div>
										{/if}
									{/snippet}
								</Collapsible.Content>
							</Collapsible.Root>
						{:else}
							<Table.Root class="w-full min-w-[300px]">
								<!-- Set minimum width -->
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[40px]"><!-- Reduced width --></Table.Head>
										<Table.Head
											class="w-full {statistic.question_type === 'Ranking'
												? 'md:w-[20%]'
												: 'md:w-[40%]'}"
											>{statistic.question_type === 'Ranking' ? 'Option' : 'Answer'}</Table.Head
										>
										{#if statistic.question_type === 'Ranking'}
											<Table.Head class="w-full md:w-[20%]">Rank</Table.Head>
										{/if}
										<Table.Head class="w-[60px] md:w-[25%]"></Table.Head>
										<Table.Head class="w-[80px] text-right">%</Table.Head>
										<Table.Head class="w-[60px] text-right">#</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each statistic.answer_statistics as res, ix}
										<Table.Row class="space-y-1">
											<!-- Reduced spacing -->
											<Table.Cell class="text-sm font-normal">A{ix + 1}</Table.Cell>
											<Table.Cell class="line-clamp-3 text-sm font-normal">{res.answer}</Table.Cell>
											{#if statistic.question_type === 'Ranking'}
												<Table.Cell class="text-sm font-normal">{res.rank}</Table.Cell>
											{/if}
											<Table.Cell class="font-normal">
												<Progress value={res.percentage} class="h-2 w-full" />
											</Table.Cell>
											<Table.Cell class="text-right text-sm font-normal">
												{Math.round(res.percentage)}%
											</Table.Cell>
											<Table.Cell class="text-right text-sm font-normal">
												{res.count}
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						{/if}
					</Card.Content>
					<Card.Footer></Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>
