'use client';
import { CollapsibleHeader } from '@/components/CollapsibleHeader';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TablePagination } from './TablePagination';

type ReactTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  isCollapsible?: boolean;
  headerTitle?: React.ReactNode;
  headerSubtitle?: string;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  onRowClick?: (row: T) => void;
  outsideFooterComponent?: React.ReactNode;
  columnSticky?: { id: string; position: 'left' | 'right' }[];
  alternate?: boolean;
} & (RequiredPaginationProps<T> | NonPaginatedProps<T>);

// If pagination is enabled, all these props are required
type RequiredPaginationProps<T extends object> = {
  showPagination: true;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (limit: number) => void;
  currentPageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

// If pagination is disabled, pagination related props are not required
type NonPaginatedProps<T extends object> = {
  showPagination: false;
  setPageIndex?: (pageIndex: number) => void;
  setPageSize?: (limit: number) => void;
  currentPageSize?: number;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
};

export const Table = <T extends object>({
  data,
  columns,
  isCollapsible = true,
  headerTitle,
  headerSubtitle,
  headerComponent,
  footerComponent,
  showPagination,
  setPageIndex,
  setPageSize,
  currentPageSize,
  currentPage,
  totalPages,
  totalItems,
  columnSticky,
  outsideFooterComponent,
  alternate,
  onRowClick,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <CollapsibleHeader
      isCollapsible={isCollapsible}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      headerComponent={headerComponent}
    >
      {alternate ? (
        <div className='overflow-hidden rounded-2xl border border-separator-dark'>
          <div className='overflow-auto'>
            <table className='isolate w-max min-w-full bg-primary-white text-dark-secondary'>
              <thead className='bg-[#f9f9f9]'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className='group flex'>
                    {headerGroup.headers.map(header => {
                      const stickyColumn = columnSticky?.find(
                        column => column.id === header.id
                      );

                      return (
                        <th
                          key={header.id}
                          className={cn(
                            'overflow-hidden border border-background-light-gray',
                            'isolate px-2 py-4 text-left text-sm',
                            'group-hover:bg-background-light-gray group-focus:bg-background-light-gray',
                            'border-t-0 first:border-l-0 last:border-r-0',
                            stickyColumn &&
                              'sticky z-[1] bg-[#f9f9f9] drop-shadow-md',
                            stickyColumn && stickyColumn.position === 'left'
                              ? 'left-[-0.2px]'
                              : 'right-[-0.2px]'
                          )}
                          style={{
                            width:
                              header.getSize() !== 150
                                ? header.getSize()
                                : undefined,
                            flex: header.getSize() !== 150 ? undefined : 1,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className=''>
                {table.getRowModel().rows.map(row => (
                  <tr
                    onClick={
                      onRowClick ? e => onRowClick(row.original) : undefined
                    }
                    key={row.id}
                    className={cn('group flex', onRowClick && 'cursor-pointer')}
                  >
                    {row.getVisibleCells().map(cell => {
                      const stickyColumn = columnSticky?.find(
                        column => column.id === cell.column.id
                      );
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'isolate flex items-center overflow-hidden border border-background-light-gray',
                            'typo-p-small min-h-[52px] gap-2 whitespace-pre-wrap border-background-light-gray p-2 text-left font-light first:border-l-0 last:border-r-0',
                            'group-hover:bg-background-light-gray group-focus:bg-background-light-gray',
                            stickyColumn &&
                              'sticky z-[1] bg-white drop-shadow-md',
                            stickyColumn && stickyColumn.position === 'left'
                              ? 'left-[-0.2px]'
                              : 'right-[-0.2px]'
                          )}
                          style={{
                            width:
                              cell.column.getSize() !== 150
                                ? cell.column.getSize()
                                : undefined,
                            flex: cell.column.getSize() !== 150 ? undefined : 1,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {footerComponent && footerComponent}
          </div>
        </div>
      ) : (
        <div className='overflow-auto'>
          <table className='isolate w-max min-w-full border-collapse border border-background-light-gray bg-primary-white'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className='group'>
                  {headerGroup.headers.map(header => {
                    const stickyColumn = columnSticky?.find(
                      column => column.id === header.id
                    );
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'isolate border border-background-light-gray p-4 text-left text-sm',
                          'group-hover:bg-background-light-gray group-focus:bg-background-light-gray',
                          'first:bg-white first:drop-shadow-md',
                          stickyColumn && 'sticky z-[1]',
                          stickyColumn && stickyColumn.position === 'left'
                            ? 'left-[-0.2px]'
                            : 'right-[-0.2px]'
                        )}
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='group'>
                  {row.getVisibleCells().map(cell => {
                    const stickyColumn = columnSticky?.find(
                      column => column.id === cell.column.id
                    );
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'typo-p-small isolate min-h-[52px] gap-2 border border-background-light-gray p-4 text-left first:bg-white first:drop-shadow-md',
                          'group-hover:bg-background-light-gray group-focus:bg-background-light-gray',
                          stickyColumn && 'sticky z-[1]',
                          stickyColumn && stickyColumn.position === 'left'
                            ? 'left-[-0.2px]'
                            : 'right-[-0.2px]'
                        )}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {footerComponent && footerComponent}
        </div>
      )}
      {outsideFooterComponent && outsideFooterComponent}
      {showPagination && (
        <TablePagination
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          currentPageSize={currentPageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      )}
    </CollapsibleHeader>
  );
};
