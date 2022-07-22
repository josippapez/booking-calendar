import { useEffect, useRef, useState } from 'react';
import Images from '../../../Styles/Assets/Images/Images';
import style from './Dropdown.module.scss';

type Props = {
  placeholder: string;
  selected: string | undefined;
  data: {
    id: string;
    name: string;
    value:
      | string
      | number
      | {
          [key: string]: number | string;
        };
  }[];
  setData: (data: string) => void;
};

function Dropdown(props: Props) {
  const { placeholder, data, setData, selected } = props;
  const [opennedDropdown, setOpennedDropdown] = useState(false);
  const component = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        component.current &&
        !component.current.contains(event.target as Node)
      ) {
        setOpennedDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [component]);

  return (
    <div
      className='flex flex-col justify-center relative flex-grow'
      ref={component}
    >
      <div
        className={`${style.dropdownInput}
        cursor-pointer bg-neutral-50 hover:bg-neutral-300
        rounded-md p-1 flex overflow-hidden
        justify-between relative drop-shadow-md`}
        onClick={() => {
          setOpennedDropdown(!opennedDropdown);
        }}
      >
        <input
          type={'button'}
          placeholder={placeholder}
          className={`placeholder:text-sm w-full cursor-pointer`}
          value={data.find(item => item.id === selected)?.name}
        />
        <img
          src={Images.DownArrow}
          style={{
            height: '100%',
            width: 'auto',
          }}
          alt='arrow'
          className={`${style.arrow} absolute
          right-0 top-0
          bg-transparent backdrop-blur-md`}
        />
      </div>
      {opennedDropdown && (
        <div className={`${style.dropdown} rounded-md p-1 shadow-md`}>
          {data &&
            data.map(item => (
              <div
                key={item.id}
                className={`${style.dropdownItem}
                text-gray-700 hover:bg-slate-200 rounded-md
                ${selected === item.id && 'text-blue-600'}`}
                onClick={() => {
                  setData(item.id.toString());
                  setOpennedDropdown(false);
                }}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
