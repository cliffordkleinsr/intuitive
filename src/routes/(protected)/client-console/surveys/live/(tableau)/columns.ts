import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from './data-table-actions.svelte';
import DataTableAdditional from './data-table-additional.svelte';
import type { ColumnDef } from '@tanstack/table-core';

export type Survey = {
	id: string;
	title: string;
	created: Date;
};

export const columns: ColumnDef<Survey>[] = [
	{
		accessorKey: 'id',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	},
	{
		accessorKey: 'title',
		header: 'Title'
	},
	{
		accessorKey: 'created',
		header: 'Created'
	},
	{
		accessorKey: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableAdditional, { id: row.original.id });
		}
	}
];
