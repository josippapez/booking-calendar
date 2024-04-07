'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Maximize, Minimize } from 'lucide-react';
import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
  isCollapsible?: boolean;
  headerTitle?: React.ReactNode;
  headerSubtitle?: string;
  headerComponent?: React.ReactNode;
};

export const CollapsibleHeader = ({
  children,
  isCollapsible = true,
  headerTitle,
  headerSubtitle,
  headerComponent,
}: Props) => {
  const [open, setOpen] = useState(false);

  function renderHeaderData() {
    return (
      <div className='flex items-center justify-start gap-2'>
        {headerTitle && (
          <span className='typo-p-small-bold'>{headerTitle}</span>
        )}
        {headerSubtitle && (
          <span className='typo-p-small'>{headerSubtitle}</span>
        )}
        {headerComponent}
      </div>
    );
  }

  if (!isCollapsible) {
    return (
      <div>
        {(headerTitle || headerSubtitle || headerComponent) && (
          <div className='flex w-full items-center justify-between gap-4 rounded-lg border border-background-skeleton bg-input-background-disabled p-4'>
            {renderHeaderData()}
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className='flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-background-skeleton bg-input-background-disabled p-4'>
          {renderHeaderData()}
          <button>{open ? <Minimize /> : <Maximize />}</button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'overflow-hidden',
          'data-[state="open"]:animate-customExpandRow data-[state="closed"]:animate-customCollapseRow'
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
