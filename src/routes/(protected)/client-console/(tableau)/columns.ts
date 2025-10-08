import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableAdditional from './data-table-additional.svelte';

export type Survey = {
	id: string;
	title: string;
	expires: Date;
	status: string;
};

export const columns = (survey: string): ColumnDef<Survey>[] => {
	return [
		{
			accessorKey: 'id',
			cell: ({ row }) => {
				return renderComponent(DataTableAdditional, { id: row.original.id, survey: survey });
			}
		},
		{
			accessorKey: 'title',
			header: 'Title'
		},
		{
			accessorKey: 'expires',
			header: 'Expiry'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderComponent(DataTableActions, {
					id: row.original.id,
					status: row.original.status
				});
			}
		}
	];
};
