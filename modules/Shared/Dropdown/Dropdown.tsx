import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Images from '@public/Styles/Assets/Images/Images';
import style from './Dropdown.module.scss';

interface Props<T> {
  placeholder: string;
  data?: T[];
  selectedValue?: number | string;
  onSelectionChange: (value: T | null) => void;
}

export const Dropdown = <
  T extends { id: string | number; value: string; }
>({
  data = [],
  selectedValue,
  onSelectionChange,
  placeholder,
}: Readonly<Props<T>>) => {
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const component = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        component.current &&
        !component.current.contains(event.target as Node)
      ) {
        setOpenedDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [component]);

  return (
    <div
      className={`${style.dropdownInput} relative flex-grow justify-center font-bold`}
      ref={component}
    >
      <div
        className='relative flex cursor-pointer
        justify-between overflow-hidden rounded-md
        bg-white drop-shadow-md hover:bg-stone-200'
        onClick={() => {
          setOpenedDropdown(!openedDropdown);
        }}
      >
        <input
          type='button'
          placeholder={placeholder}
          className='w-[calc(100%_-_30px)] cursor-pointer overflow-hidden text-ellipsis placeholder:text-sm'
          value={
            selectedValue
              ? data.find(v => v.id === selectedValue)?.value ?? ''
              : ''
          }
        />
        <Image
          src={Images.DownArrow}
          alt='arrow'
          width={40}
          height={40}
          className={`absolute
            right-0 top-0
            bg-transparent`}
        />
      </div>
      {openedDropdown && (
        <div className={`${style.dropdown} rounded-md p-1 shadow-md`}>
          {data ? (
            data.map(item => (
              <div
                key={item.id}
                className={`${style.dropdownItem}
                rounded-md p-2 text-gray-700 hover:bg-slate-200
                ${selectedValue === item.id && 'text-blue-600'}`}
                onClick={() => {
                  onSelectionChange(item);
                  setOpenedDropdown(false);
                }}
              >
                {item.value}
              </div>
            ))
          ) : (
            <div className='rounded-md p-2 text-gray-700'>No data</div>
          )}
        </div>
      )}
    </div>
  );
};
