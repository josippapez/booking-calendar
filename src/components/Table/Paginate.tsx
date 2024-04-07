'use client';

import { cn } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';

interface PaginateProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  previousLabel: string | JSX.Element;
  nextLabel: string | JSX.Element;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  breakLabel: string | JSX.Element;
  forcePage: number;
  disableInitialCallback: boolean;
  containerClassName?: string;
  pageClassName?: string;
  pageLinkClassName?: string;
  activeClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  disabledClassName?: string;
  breakClassName?: string;
}

export const Paginate: FC<PaginateProps> = ({
  pageCount,
  onPageChange,
  previousLabel,
  nextLabel,
  pageRangeDisplayed,
  marginPagesDisplayed,
  breakLabel,
  forcePage,
  disableInitialCallback,
  containerClassName,
  pageClassName,
  pageLinkClassName,
  activeClassName,
  previousClassName,
  nextClassName,
  disabledClassName,
  breakClassName,
}) => {
  const [currentPage, setCurrentPage] = useState(forcePage);

  useEffect(() => {
    if (!disableInitialCallback) {
      onPageChange({ selected: forcePage });
    }
  }, [disableInitialCallback, onPageChange, forcePage]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange({ selected: pageNumber });
  };

  if (pageCount === 0 || pageCount === 1 || !pageCount) return null;

  const pageNumbers = [...Array(pageCount).keys()];

  return (
    <div className={containerClassName}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          previousClassName,
          currentPage === 0 && disabledClassName
        )}
      >
        {previousLabel}
      </button>
      {pageNumbers.map((number, index) => {
        if (
          index < marginPagesDisplayed ||
          index > pageCount - 1 - marginPagesDisplayed ||
          (index >= currentPage - pageRangeDisplayed &&
            index <= currentPage + pageRangeDisplayed)
        ) {
          return (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={cn(
                pageClassName,
                number === currentPage && activeClassName
              )}
            >
              <span className={pageLinkClassName}>{number + 1}</span>
            </button>
          );
        } else if (
          index === marginPagesDisplayed &&
          currentPage >= pageRangeDisplayed + marginPagesDisplayed
        ) {
          return (
            <button
              key={number}
              onClick={() =>
                handlePageClick(currentPage - pageRangeDisplayed - 1)
              }
              className={breakClassName}
            >
              {breakLabel}
            </button>
          );
        } else if (
          index === pageCount - 1 - marginPagesDisplayed &&
          currentPage < pageCount - 1 - pageRangeDisplayed
        ) {
          return (
            <button
              key={number}
              onClick={() =>
                handlePageClick(currentPage + pageRangeDisplayed + 1)
              }
              className={breakClassName}
            >
              {breakLabel}
            </button>
          );
        } else {
          return null;
        }
      })}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        className={cn(
          nextClassName,
          currentPage === pageCount - 1 && disabledClassName
        )}
      >
        {nextLabel}
      </button>
    </div>
  );
};
