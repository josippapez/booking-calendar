import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  inputKey?: any;
  serviceTotal: string;
  setServiceName: (serviceName: string) => void;
  setServiceAmount: (serviceAmount: string) => void;
  setServicePrice: (servicePrice: string) => void;
  removeService: () => void;
};

export const ServiceInput = (props: Props) => {
  const {
    inputKey,
    setServiceName,
    setServiceAmount,
    setServicePrice,
    removeService,
    serviceTotal,
  } = props;
  const { t, i18n } = useTranslation('ServiceInput');

  const handleRemoveService = useCallback(() => {
    removeService();
  }, [removeService]);

  return (
    <div
      key={`service-${inputKey}`}
      className='mb-2 flex w-full flex-row gap-2'
    >
      <input
        className='w-2/6 appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
        type={'text'}
        placeholder={t('name').toString()}
        onChange={e => setServiceName(e.target.value)}
      />
      <input
        className='w-1/6 appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
        type={'number'}
        lang={i18n.language}
        placeholder={t('amount').toString()}
        onChange={e => setServiceAmount(e.target.value)}
      />
      <input
        className='w-1/6 appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
        type={'number'}
        lang={i18n.language}
        placeholder={t('price').toString()}
        onChange={e => setServicePrice(e.target.value)}
      />
      <div className='flex w-1/6 appearance-none items-center justify-center rounded-md border bg-gray-200 leading-tight text-gray-700 focus:border-blue-500'>
        {Number(serviceTotal).toLocaleString(i18n.language, {
          minimumFractionDigits: 2,
        })}
      </div>
      <button
        className={`h-10 w-10`}
        style={{
          backgroundImage: 'url(/Styles/Assets/Images/xCircle.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        onClick={handleRemoveService}
      />
    </div>
  );
};
