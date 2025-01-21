import DataTableActions from './data-table-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableAdditional from './data-table-additional.svelte';
import DataTableSorting from './data-table-sorting.svelte';
import { createRawSnippet } from 'svelte';

export type Survey = {
	id: string;
	name: string;
	payout: number;
	status: string;
	processedat: Date;
};

export const columns: ColumnDef<Survey>[] = [
	{
		accessorKey: 'Actions',
		cell: ({ row }) => {
			return renderComponent(DataTableAdditional, { id: row.original.id });
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'payout',
		header: () => {
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div>Amount</div>`
			}));
			return renderSnippet(amountHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'KES'
			});

			const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
				const amount = getAmount();
				return {
					render: () => `<div class="font-normal">${amount}</div>`
				};
			});

			return renderSnippet(amountCellSnippet, formatter.format(parseFloat(row.getValue('payout'))));
		}
	},
	{
		accessorKey: 'status',
		header: 'Status'
	},
	{
		accessorKey: 'processedat',
		header: ({ column }) =>
			renderComponent(DataTableSorting, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: ' ',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				id: row.original.id,
				status: row.original.status
			});
		}
	}
];
