<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { fade } from 'svelte/transition';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { geoNaturalEarth1 } from 'd3-geo';
	import { feature } from 'topojson-client';
	import * as Table from '$lib/components/ui/table';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import {
		Chart,
		GeoPath,
		Svg,
		Tooltip,
		geoFitObjectTransform,
		Legend,
		BarChart,
		PieChart
	} from 'layerchart';
	import { index } from 'd3-array';
	import { scaleQuantile } from 'd3-scale';
	import { interpolateOranges, schemeOranges } from 'd3-scale-chromatic';
	import { format } from '@layerstack/utils';
	import { quantize } from 'd3-interpolate';
	import FileText from 'lucide-svelte/icons/file-text';
	import UnfoldVertical from 'lucide-svelte/icons/unfold-vertical';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import { cn } from '$lib/utils';
	import type { Feature, FeatureCollection } from 'geojson';
	import { exportRaw } from '$lib/custom/functions/helpers';
	import { toast } from 'svelte-sonner';
	import { innerWidth } from 'svelte/reactivity/window';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import WordCloud from '$lib/custom/blocks/wordcloud/WordCloud.svelte';
	let { data }: { data: PageData } = $props();

	let variable = $state() as boolean[];
	variable = data.analytics.map(
		(x) => x.question_type !== 'Ranking' && x.question_type !== 'Single'
	);
	const countries = feature(data.geojson, data.geojson.objects.countries);
	let selectedState: string | null = $state(null);

	const populationByCount = index(
		data.popn_cnty.map((v) => ({
			id: v.id?.trim(),
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
	// 					name: feature.properties?.COUNTY_NAM,
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

	//scaleQuantile takes the entire dataset.

	// Splits it into N quantiles (where N = size of your color range).

	// If you only have 2 data points, most quantiles collapse → several bins are unused.

	// So for [2, 3] + 7 colors, both values fall into the lowest bin.
	let colorScale = $derived.by(() => {
		// Determine the dataset based on zoom level
		const dataset = selectedState
			? data.popn_cnty.map((d: any) => d.count) // Use county data if zoomed in
			: data.popn.map((d: any) => d.count); // Use country data otherwise

		return scaleQuantile<string, string>().domain(dataset).range(schemeOranges[7]);
	});
	// let colorScale = $derived.by(() => {
	// const dataset = selectedState
	// 	? data.popn_cnty.map((d: any) => d.count)
	// 	: data.popn.map((d: any) => d.count);

	// const min = Math.min(...dataset);
	// const max = Math.max(...dataset);

	// // pad by a tiny fraction of the range
	// const pad = (max - min) * 0.01 || 1; // fallback for identical values

	// return scaleQuantile<string>()
	// 	.domain([min - pad, ...dataset, max + pad])
	// 	.range(schemeOranges[7]);
	// });

	// $inspect(data.popn_cnty)

	type RankingRow = {
		rank: string;
		[answer: string]: number | string; // `rank` is string, others are numbers
	};

	interface Series {
		key: string;
		color: string;
	}
	let printstate = $state(false) as boolean;
	let processedData: RankingRow[] = $state([]);
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
	let keys: string[] = $state([]);
	let series: Series[] = $state([]);
	const keyColors = [
		'hsl(var(--orange))',
		'hsl(var(--violet))',
		'hsl(var(--cyan))',
		'hsl(var(--blue))',
		'hsl(var(--stone))'
	];
	if (proxyprocessedData().length > 0) {
		const keySet = new Set<string>();
		// keys = Object.keys(proxyprocessedData()[0]).filter((k) => k !== 'rank');
		// let proxyKeys = () => keys
		// series = proxyprocessedData().map((_, index) => ({
		// 	key: keys[index],
		// 	color: keyColors[index]
		// }));
		for (const row of proxyprocessedData()) {
			Object.keys(row).forEach((k) => {
				if (k !== 'rank') keySet.add(k);
			});
		}
		keys = Array.from(keySet);
		let proxyKeys = () => keys;
		series = proxyKeys().map((k, index) => ({
			key: k,
			color: keyColors[index % keyColors.length]
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

	// const states = () => (selectedState === 'Kenya' ? data.countries.kenya : selectedState === 'Germany'? data.countries.deutscheland: undefined  );
	// let selectedCountiesFeatures = $derived(
	// 	states()?.features.map((feature) => ({
	// 		...feature,
	// 		properties: {
	// 			...feature.properties,
	// 			name: feature.properties?.COUNTY_NAM,
	// 			data: populationByFipsSt.get(feature?.properties?.COUNTY_NAM)
	// 		}
	// 	}))
	// ) as Feature[];

	let selectedCountiesFeatures = $derived.by(() => {
		if (selectedState === 'Kenya') {
			return data.countries.kenya?.features.map((feature) => ({
				...feature,
				properties: {
					...feature.properties,
					name: feature.properties?.COUNTY_NAM,
					data: populationByCount.get(feature?.properties?.COUNTY_NAM)
				}
			}));
		}
		if (selectedState === 'Germany') {
			return data.countries.deutscheland?.features.map((feature) => ({
				...feature,
				properties: {
					...feature.properties,
					data: populationByCount.get(feature.properties?.name)
				}
			}));
		}
		return [];
	}) as Feature[];
	// $effect(() => {
	// 		// $inspect(selectedState)
	// 		if (selectedState === 'Kenya') {
	// 			const state = data.kenya;
	// 			selectedCountiesFeatures = state.features.map((feature) => ({
	// 				...feature,
	// 				properties: {
	// 					...feature.properties,
	// 					name: feature.properties?.COUNTY_NAM,
	// 					data: populationByFipsSt.get(feature?.properties?.COUNTY_NAM)
	// 				}
	// 			}));
	// 		} else {
	// 			selectedCountiesFeatures = [];
	// 		}
	// });
	// $inspect(cachedState)
	// $inspect(selectedCountiesFeatures)
	// data.sec = [...data.sec, {id:"Health", count: 3}, {id:"Politics", count: 5}, {id: "Agriculture", count:3}, {id: "Education", count:3}, {id: "Automotive", count: 5}]
	// data.edu = [...data.edu, {id: "Under-Graduate", count: 2}, {id: "Primary", count: 6}, {id: "High-School", count: 3}, {id: "Tertiary", count : 5}]
</script>

<div class="px-3 py-5">
	<div id="kutton" class={['flex gap-2 py-1', data.features.plan === 'Free' ? 'hidden' : '']}>
		<Button
			variant="secondary"
			onclick={() => {
				variable = variable.map((x) => (x = !x));
				printstate = !printstate;
				setTimeout(() => {
					data.analytics.length > 0 ? window.print() : toast.info('There is no data to print');
				}, 50);
			}}
			size="sm"
		>
			Export PDF <FileText />
		</Button>
	</div>
	<div class="grid grid-cols-[repeat(2,1fr)] gap-x-[10px] gap-y-[10px]">
		<div class={['col-span-2', data.features.plan === 'Free' ? 'hidden' : '']}>
			<Card.Root>
				<Card.Header>
					<Card.Title>Geographical Distribution</Card.Title>
					<Card.Description>Responses Globally</Card.Description>
				</Card.Header>
				<Card.Content>
					<div
						class={[
							printstate ? 'ml-auto' : 'overflow-hidden ',
							printstate && selectedState ? ' overflow-clip' : '',
							`relative mx-auto h-[550px] md:w-[1000px]`
						]}
					>
						<Chart
							geo={{
								projection: geoNaturalEarth1,
								fitGeojson: countries
								// applyTransform: ['translate', 'scale']
							}}
							transform={{
								mode: 'canvas',
								initialScrollMode: 'none',
								tweened: { duration: 800, easing: cubicOut }
							}}
							let:projection
							let:transform
							let:tooltip
						>
							{@const strokeWidth = 1 / transform.scale}
							<Svg>
								<g>
									{#each enrichedCountriesFeatures as feature}
										<GeoPath
											geojson={feature}
											{tooltip}
											fill={selectedState
												? colorScale(0)
												: colorScale(feature.properties.data?.count ?? 0)}
											class="stroke-none hover:stroke-white"
											{strokeWidth}
											onclick={(e, geoPath) => {
												if (selectedState === feature.properties.name) {
													selectedState = null;
													transform.reset();
												} else {
													selectedState = feature.properties.name;
													const [[left, top], [right, bottom]] = geoPath.bounds(feature);
													const width = right - left;
													const height = bottom - top;
													const x = (left + right) / 2;
													const y = (top + bottom) / 2;
													const padding = 20;
													transform.zoomTo(
														{ x, y },
														{ width: width + padding, height: height + padding }
													);
													// const featureTransform = geoFitObjectTransform(
													// 	projection,
													// 	[width, height],
													// 	feature
													// );
													// transform.setTranslate(featureTransform.translate);
													// transform.setScale(featureTransform.scale);
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

								{#each selectedCountiesFeatures as feature (feature.id)}
									<g in:fade={{ duration: 300, delay: 600 }} out:fade={{ duration: 300 }}>
										<GeoPath
											geojson={feature}
											fill={colorScale(feature?.properties?.data?.count ?? 0)}
											{tooltip}
											strokeWidth={1 / transform.scale}
											class="stroke-none"
											onclick={() => {
												selectedState = null;
												transform.reset();
											}}
										/>
									</g>
								{/each}
								{#each selectedCountiesFeatures as feature}
									<g in:fade={{ duration: 300, delay: 600 }} out:fade={{ duration: 300 }}>
										<GeoPath
											geojson={feature}
											{tooltip}
											strokeWidth={1 / transform.scale}
											class="pointer-events-none fill-none stroke-black/30"
											onclick={() => {
												selectedState = null;
												transform.reset();
											}}
										/>
									</g>
								{/each}
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
									populationByCount.get(data.properties.name)}
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
		<div class={['col-span-2 md:col-span-1', data.features.plan === 'Free' ? 'hidden' : '']}>
			<h1 class="text-sm text-muted-foreground">Responses by Sector</h1>
			<div class="relative h-[350px] w-full rounded border p-4">
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
		<div class={['col-span-2 md:col-span-1', data.features.plan === 'Free' ? 'hidden' : '']}>
			<h1 class="text-sm text-muted-foreground">Responses by Literacy rate</h1>
			<div class="relative h-[350px] w-full rounded border p-4">
				<BarChart
					data={data.edu}
					x="id"
					y="count"
					props={{
						bars: { class: 'fill-orange-400' },
						xAxis: { format: 'none' },
						yAxis: { format: (value: number) => format(Math.abs(value), 'metric') }
					}}
					renderContext="svg"
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
									'mb-3 h-96 rounded border p-4',
									data.features.plan === 'Free' ? 'hidden' : ''
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
						{#if statistic.question_type === 'Single' && statistic.answer_statistics.length > 15}
							{@const textContent = statistic.answer_statistics
								.map((stat) => stat.answer)
								.join('.\n')}
							<div
								class={[
									'place-items-center',
									data.features.plan === 'Premium' || data.features.plan === 'Enterprise'
										? ''
										: 'hidden'
								]}
							>
								<WordCloud text={textContent} />
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

<style>
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
