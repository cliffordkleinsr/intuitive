import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableLive from './data-table-live.svelte';

export type Survey = {
	id: string;
	title: string;
	expires: Date;
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
		accessorKey: 'expires',
		header: 'Expires'
	},
	{
		accessorKey: ' ',
		cell: ({ row }) => {
			return renderComponent(DataTableLive, {});
		}
	}
];
