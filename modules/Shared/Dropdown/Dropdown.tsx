import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Images from '../../../public/Styles/Assets/Images/Images';
import style from './Dropdown.module.scss';

type Props = {
  placeholder: string;
  selected: string;
  data?: {
    id: string;
    name: string;
    value:
      | string
      | number
      | {
          [key: string]: number | string;
        };
  }[];
  setData: (data: {
    id: string;
    name: string;
    value:
      | string
      | number
      | {
          [key: string]: number | string;
        };
  }) => void;
};

export function Dropdown(props: Props) {
  const { placeholder, data, setData, selected } = props;
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
            selected && data
              ? data.find(item => item.id === selected)?.name
              : ''
          }
        />
        <Image
          src={Images.DownArrow}
          alt='arrow'
          width={30}
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
                ${selected === item.id && 'text-blue-600'}`}
                onClick={() => {
                  setData(item);
                  setOpenedDropdown(false);
                }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className='rounded-md p-2 text-gray-700'>No data</div>
          )}
        </div>
      )}
    </div>
  );
}
