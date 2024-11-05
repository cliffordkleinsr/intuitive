<script lang="ts" generics="TData, TValue">
	// tanstack
	import {
		type ColumnDef,
		type PaginationState,
		type ColumnFiltersState,
		getPaginationRowModel,
		getCoreRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	// shadcn
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input';

	// lucide
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import type { Snippet } from 'svelte';

	type DateTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		children?: Snippet;
	};

	let { data, columns, children }: DateTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 7 });
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		// core
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		// pagination
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getPaginationRowModel: getPaginationRowModel(),
		// filtering
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			// pagination
			get pagination() {
				return pagination;
			},
			get columnFilters() {
				return columnFilters;
			}
		}
	});
</script>

<div class="m-4">
	<div class="flex items-center py-4">
		<Input
			placeholder="Filter items..."
			value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('title')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('title')?.setFilterValue(e.currentTarget.value);
			}}
			class="max-w-sm"
		/>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 px-5 py-4">
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			<ChevronLeft />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			<ChevronRight />
		</Button>
	</div>
</div>
{@render children?.()}
