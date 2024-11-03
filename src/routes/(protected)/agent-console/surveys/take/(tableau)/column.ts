import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';

export type Survey = {
	id: string;
	title: string;
	from: Date;
	to: Date;
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
		accessorKey: 'from',
		header: 'From'
	},
	{
		accessorKey: 'to',
		header: 'To'
	}
];
