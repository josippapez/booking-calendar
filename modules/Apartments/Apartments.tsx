'use client';

import {
  SingleApartmentDto,
  useApartmentsControllerFindAllSuspense,
} from '@/api';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table/Table';
import { Modify } from '@/lib/utils';
import { AddApartment } from '@modules/Apartments/AddApartment';
import { apartmentsColumns } from '@modules/Apartments/ApartmentsColumns';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export type ModifiedSingleApartmentDto = Modify<
  SingleApartmentDto,
  {
    image?: Blob | string;
  }
>;

export const Apartments: FC = () => {
  const t = useTranslations('Apartments');

  const { data: apartments } = useApartmentsControllerFindAllSuspense({
    query: {
      queryKey: ['apartments'],
    },
  });

  return (
    <div className='grid gap-5'>
      <div className='flex justify-between'>
        <div className='flex justify-between'>
          <div className='text-3xl font-bold'>{t('apartments')}</div>
        </div>

        <AddApartment />
      </div>
      <Table
        showPagination={false}
        data={apartments}
        columns={apartmentsColumns}
        isCollapsible={false}
        columnSticky={[{ id: 'actions', position: 'right' }]}
        alternate
      />
    </div>
  );
};
