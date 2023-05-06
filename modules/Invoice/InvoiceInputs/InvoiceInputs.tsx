import { DateInput, ImageInput, ServiceInput } from '@modules/Shared/Inputs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionInvoiceData } from '../Invoice';
import style from './InvoiceInputs.module.scss';

type Props = {
  invoiceData: TransactionInvoiceData;
  setInvoiceData: (data: TransactionInvoiceData) => void;
};

export const InvoiceInputs = (props: Props) => {
  const { invoiceData, setInvoiceData } = props;

  const { t } = useTranslation('InvoiceInputs');

  const [displayInputSection, setDisplayInputSection] =
    useState('apartmentData');

  return (
    <div className={`flex w-full flex-col gap-3 2xl:w-1/2`}>
      {Object.keys(invoiceData).map(key => {
        return (
          <div
            key={key}
            className={`${style.sections} ${
              displayInputSection === key && style.sections__show
            }`}
          >
            <h1
              className='rounded-md bg-zinc-200 px-3 py-2 text-2xl font-bold text-gray-800 hover:cursor-pointer hover:bg-zinc-100'
              onClick={() => {
                setDisplayInputSection(key);
              }}
            >
              {t(`${key}`)}
            </h1>
            <div
              className={`flex flex-col gap-3 ${style.section}`}
              ref={el => {
                if (el) {
                  if (displayInputSection === key) {
                    setTimeout(() => {
                      el.style.overflowY = 'auto';
                    }, 250);
                  } else {
                    el.style.overflowY = 'hidden';
                  }
                }
              }}
            >
              {Object.entries(
                invoiceData[key as keyof TransactionInvoiceData]
              ).map(([innerKey, value]) => {
                if (innerKey !== 'image') {
                  if (innerKey !== 'services') {
                    if (innerKey.includes('date')) {
                      return (
                        <div key={innerKey} className='flex flex-col'>
                          <span className='font-bold'>{t(`${innerKey}`)}</span>
                          <DateInput
                            value={value as string}
                            resetData={() => {
                              setInvoiceData({
                                ...invoiceData,
                                [key]: {
                                  ...invoiceData[
                                    key as keyof typeof invoiceData
                                  ],
                                  [innerKey]: '',
                                },
                              });
                            }}
                            setData={date => {
                              setInvoiceData({
                                ...invoiceData,
                                [key]: {
                                  ...invoiceData[
                                    key as keyof typeof invoiceData
                                  ],
                                  [innerKey]: date,
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    } else if (innerKey === 'note') {
                      return (
                        <div key={innerKey} className='flex flex-col'>
                          <span className='font-bold'>{t(`${innerKey}`)}</span>
                          <textarea
                            className='min-h-[100px] w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                            value={value}
                            rows={10}
                            title={t(`${innerKey}`).toString()}
                            placeholder={t(`${innerKey}`).toString()}
                            onChange={e => {
                              setInvoiceData({
                                ...invoiceData,
                                [key]: {
                                  ...invoiceData[
                                    key as keyof typeof invoiceData
                                  ],
                                  [innerKey]: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    } else
                      return (
                        <div key={innerKey} className='flex flex-col'>
                          <span className='font-bold'>{t(innerKey)}</span>
                          {innerKey === 'VAT' ? (
                            <input
                              className='h-6 focus:border-blue-500'
                              type={'checkbox'}
                              checked={value ? Boolean(value) : false}
                              onChange={e => {
                                setInvoiceData({
                                  ...invoiceData,
                                  invoiceData: {
                                    ...invoiceData['invoiceData'],
                                    VAT: e.target.checked,
                                  },
                                });
                              }}
                            />
                          ) : (
                            <input
                              className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                              type={'text'}
                              value={value ? value.toString() : ''}
                              onChange={e => {
                                setInvoiceData({
                                  ...invoiceData,
                                  [key]: {
                                    ...invoiceData[
                                      key as keyof typeof invoiceData
                                    ],
                                    [innerKey]: e.target.value,
                                  },
                                });
                              }}
                            />
                          )}
                        </div>
                      );
                  } else {
                    return (
                      <div key={innerKey}>
                        <span className='font-bold'>{t(innerKey)}</span>
                        <div className='flex flex-col'>
                          {Object.entries(
                            invoiceData['invoiceData']['services']
                          ).map(([serviceKey, serviceValue]) => {
                            let newArray = [
                              ...invoiceData['invoiceData']['services'],
                            ];

                            const handleServiceName = (value: string) => {
                              newArray[Number(serviceKey)].name = value;
                              newArray[Number(serviceKey)].total = (
                                Number(serviceValue.price) *
                                Number(serviceValue.amount)
                              ).toFixed(2);
                              setInvoiceData({
                                ...invoiceData,
                                [key]: {
                                  ...invoiceData[
                                    key as keyof typeof invoiceData
                                  ],
                                  services: newArray,
                                },
                              });
                            };

                            const handleServiceChange = (
                              value: string,
                              inputKey: 'price' | 'amount'
                            ) => {
                              newArray[Number(serviceKey)][inputKey] =
                                Number(value).toFixed(2);
                              newArray[Number(serviceKey)].total = (
                                Number(serviceValue.price) *
                                Number(serviceValue.amount)
                              ).toFixed(2);
                              setInvoiceData({
                                ...invoiceData,
                                [key]: {
                                  ...invoiceData[
                                    key as keyof typeof invoiceData
                                  ],
                                  services: newArray,
                                },
                              });
                            };

                            return (
                              <ServiceInput
                                key={serviceKey}
                                inputKey={serviceKey}
                                setServiceAmount={value =>
                                  handleServiceChange(value, 'amount')
                                }
                                setServicePrice={value =>
                                  handleServiceChange(value, 'price')
                                }
                                setServiceName={value =>
                                  handleServiceName(value)
                                }
                                removeService={() => {
                                  newArray.splice(Number(serviceKey), 1);
                                  setInvoiceData({
                                    ...invoiceData,
                                    [key]: {
                                      ...invoiceData[
                                        key as keyof typeof invoiceData
                                      ],
                                      services: newArray,
                                    },
                                  });
                                }}
                                serviceTotal={serviceValue.total}
                              />
                            );
                          })}
                        </div>
                        <button
                          className='appearance-none rounded-md border bg-white p-3 leading-tight text-gray-700 hover:bg-gray-100'
                          onClick={() => {
                            setInvoiceData({
                              ...invoiceData,
                              [key]: {
                                ...invoiceData[key as keyof typeof invoiceData],
                                services: [
                                  ...invoiceData['invoiceData']['services'],
                                  {
                                    name: '',
                                    amount: '',
                                    price: '',
                                    total: '',
                                  },
                                ],
                              },
                            });
                          }}
                        >
                          {t('add_new_service')}
                        </button>
                      </div>
                    );
                  }
                } else {
                  return (
                    <ImageInput
                      key={innerKey}
                      inputName={t(innerKey).toString()}
                      image={invoiceData.apartmentData.image as string}
                      setImage={image => {
                        setInvoiceData({
                          ...invoiceData,
                          apartmentData: {
                            ...invoiceData.apartmentData,
                            image: image,
                          },
                        });
                      }}
                      clearImage={() => {
                        setInvoiceData({
                          ...invoiceData,
                          apartmentData: {
                            ...invoiceData.apartmentData,
                            image: '',
                          },
                        });
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
