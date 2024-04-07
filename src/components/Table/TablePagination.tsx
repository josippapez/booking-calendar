'use client';

import { Paginate } from '@/components/Table/Paginate';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useDebouncedFunction } from '@modules/Shared/Hooks/useDebouncedFunction';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface Props {
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (limit: number) => void;
  currentPageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const TablePagination = ({
  setPageIndex,
  setPageSize,
  currentPageSize,
  currentPage,
  totalPages,
  totalItems,
}: Props) => {
  const [debounceInputValue] = useDebouncedFunction((value: number) => {
    if (!value || value <= 0) return;
    handlePageIndexChange(value);
  }, 500);

  const [handlePageIndexChange] = useDebouncedFunction((pageIndex: number) => {
    setPageIndex(pageIndex);
  }, 300);

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const pageSize = Number(e.target.value);

    setPageIndex(1);
    setPageSize(pageSize);
  }

  useEffect(() => {
    if (!currentPage || !totalPages) return;
    if (currentPage > totalPages) {
      setPageIndex(totalPages);
    } else if (currentPage < 1) {
      setPageIndex(1);
    }
  }, [currentPage, setPageIndex, totalPages]);

  return (
    <div className='m-[15px] flex items-center justify-end gap-8'>
      <div>
        <Paginate
          key={currentPageSize + currentPage}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          breakLabel={'...'}
          forcePage={currentPage - 1}
          pageCount={totalPages}
          disableInitialCallback
          previousLabel={<ArrowLeft className='mr-3' />}
          nextLabel={<ArrowLeft className='ml-3 rotate-180 transform' />}
          containerClassName='flex select-none items-center justify-center [&>*:nth-child(2)]:rounded-l-full [&>*:nth-last-child(2)]:rounded-r-full'
          pageClassName={cn(
            'bg-white border min-w-[45px] h-full',
            'first:rounded-l-full last:rounded-r-full',
            'hover:cursor-pointer hover:border-black'
          )}
          pageLinkClassName='h-full w-full flex items-center justify-center py-2 px-3'
          activeClassName='bg-black text-white'
          breakClassName='bg-white border py-2 px-3 hover:border-black'
          onPageChange={e => {
            handlePageIndexChange(e.selected + 1);
          }}
        />
      </div>
      <div>
        <select
          className={cn(
            'h-8 w-full rounded-md border border-dropdown-border transition-colors duration-300',
            'placeholder:text-dark-placeholder focus:border-dropdown-border-active focus:outline-none'
          )}
          value={currentPageSize}
          onChange={handlePageSizeChange}
        >
          {PAGE_SIZE_OPTIONS.map(pageSizeOption => (
            <option key={pageSizeOption} value={pageSizeOption}>
              {pageSizeOption}/page
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-center gap-[10px]'>
        <Label className={'typo-p-small flex items-center normal-case'}>
          Go to:
        </Label>
        <Input
          className='h-7 p-1'
          type='number'
          min='1'
          max={totalPages}
          onChange={e => debounceInputValue(e.target.valueAsNumber)}
        />
      </div>
    </div>
  );
};
