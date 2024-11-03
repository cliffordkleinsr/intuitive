import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';

export type Survey = {
	id: string;
	title: string;
	created: Date;
	status: string;
};

export const columns = (payment: boolean): ColumnDef<Survey>[] => {
	return [
		{
			accessorKey: 'id',
			header: 'ID'
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
			accessorKey: 'status',
			header: 'Status'
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderComponent(DataTableActions, {
					id: row.original.id,
					payment_stat: payment,
					status: row.original.status
				});
			}
		}
	];
};
