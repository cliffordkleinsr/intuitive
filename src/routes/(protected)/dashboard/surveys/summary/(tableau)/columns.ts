import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';

export type Survey = {
	id: string;
	title: string;
	status: string;
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
		accessorKey: 'status',
		header: 'Status'
	},
	{
		accessorKey: 'created',
		header: 'Created'
	}
];
