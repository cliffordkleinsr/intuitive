import DataTableActions from './data-table-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableSorting from './data-table-sorting.svelte';

export type Survey = {
	id: string;
	name: string;
	amount: number;
	processedat: Date;
};

export const columns: ColumnDef<Survey>[] = [
	{
		accessorKey: ' ',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'amount',
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

			return renderSnippet(amountCellSnippet, formatter.format(parseFloat(row.getValue('amount'))));
		}
	},
	{
		accessorKey: 'processedat',
		header: ({ column }) =>
			renderComponent(DataTableSorting, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	}
];
