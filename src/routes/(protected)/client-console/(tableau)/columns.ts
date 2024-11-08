import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableAdditional from './data-table-additional.svelte';

export type Survey = {
	id: string;
	title: string;
	created: Date;
	status: string;
};

export const columns = (payment: boolean, survey: string): ColumnDef<Survey>[] => {
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
