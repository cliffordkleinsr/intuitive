import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';

export type Survey = {
	id: string;
	title: string;
	taken: string;
	at: string;
};

export const columns: ColumnDef<Survey>[] = [
	{
		accessorKey: 'id',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
		// header: 'ID'
	},
	{
		accessorKey: 'title',
		header: 'Title'
	},
	{
		accessorKey: 'taken',
		header: 'Started On'
	},
	{
		accessorKey: 'at',
		header: 'Completed At'
	}
];
