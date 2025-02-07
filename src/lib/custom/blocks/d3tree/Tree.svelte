<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import flare from '../../../json/flare.json';
	import { hierarchy, type HierarchyNode } from 'd3-hierarchy';
	import { curveBumpX, curveBumpY, curveStep, curveStepBefore, curveStepAfter } from 'd3-shape';
	import { Chart, Group, Link, Rect, Svg, Text, Tree } from 'layerchart';
	import type { ComponentProps } from 'svelte';
	import { cn } from '$lib/utils';

	let expandedNodeNames = $state(['flare']);

	let complexDataHierarchy = $derived.by(() => {
		return hierarchy(flare, (d: any) => (expandedNodeNames.includes(d.name) ? d.children : null));
	});

	let orientation: ComponentProps<Tree>['orientation'] = 'vertical';
	let curve = $state(curveBumpY);
	let layout = $state('chart');
	let selected = $state();

	function getNodeKey(node: HierarchyNode<{ name: string }>) {
		return node.data.name + node.depth;
	}

	const nodeWidth = 120;
	const nodeHeight = 20;
	const nodeSiblingGap = 20;
	const nodeParentGap = 100;

	let nodeSize = $derived.by(() => {
		if (orientation === 'vertical') {
			return [nodeWidth + nodeSiblingGap, nodeHeight + nodeParentGap] as [number, number];
		} else {
			return [nodeHeight + nodeSiblingGap, nodeWidth + nodeParentGap] as [number, number];
		}
	});
</script>

<div class="relative h-[600px] overflow-hidden rounded border p-4">
	<Chart
		data={complexDataHierarchy}
		padding={{ top: 24, left: nodeWidth / 2, right: nodeWidth / 2 }}
		transform={{ mode: 'canvas', tweened: { duration: 800, easing: cubicOut } }}
		let:transform
	>
		<Svg>
			<Tree let:nodes let:links {orientation} nodeSize={layout === 'node' ? nodeSize : undefined}>
				<g class="opacity-20">
					{#each links as link (getNodeKey(link.source) + '_' + getNodeKey(link.target))}
						<Link data={link} {orientation} {curve} tweened class="stroke-surface-content" />
					{/each}
				</g>

				{#each nodes as node (getNodeKey(node))}
					<Group
						x={(orientation === 'vertical' ? node.x : node.y) - nodeWidth / 2}
						y={(orientation === 'vertical' ? node.y : node.x) - nodeHeight / 2}
						tweened
						on:click={() => {
							if (expandedNodeNames.includes(node.data.name)) {
								expandedNodeNames = expandedNodeNames.filter((name) => name !== node.data.name);
							} else {
								expandedNodeNames = [...expandedNodeNames, node.data.name];
							}
							selected = node;

							// transform.zoomTo({
							//   x: orientation === 'horizontal' ? selected.y : selected.x,
							//   y: orientation === 'horizontal' ? selected.x : selected.y,
							// });
						}}
						class={[node.data.children && 'cursor-pointer']}
					>
						<Rect
							width={nodeWidth}
							height={nodeHeight}
							class={cn('fill-surface-100',
							node.data.children
								? 'stroke-primary hover:stroke-2'
								: 'stroke-secondary [stroke-dasharray:1]')
							}
							rx={10}
						/>
						<Text
							value={node.data.name}
							x={nodeWidth / 2}
							y={nodeHeight / 2}
							dy={-2}
							textAnchor="middle"
							verticalAnchor="middle"
							class={cn(
								'pointer-events-none text-xs',
								node.data.children ? 'fill-primary' : 'fill-secondary')
							}
						/>
					</Group>
				{/each}
			</Tree>
		</Svg>
	</Chart>
</div>
