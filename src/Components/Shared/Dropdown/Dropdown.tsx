import { useState } from 'react';
import style from './Dropdown.module.scss';

type Props = {
  placeholder: string;
  data: { id: number; name: string; value: string }[];
  setData: (data: { id: number; name: string; value: string }) => void;
};

function Dropdown(props: Props) {
  const { placeholder, data, setData } = props;
  const [opennedDropdown, setOpennedDropdown] = useState(false);
  return (
    <div className='flex flex-col justify-center relative'>
      <input
        type={'button'}
        placeholder='Color'
        className={`${style.dropdownInput} cursor-pointer border-2 border-gray-100 rounded-md p-1 placeholder:text-sm`}
        onClick={() => {
          setOpennedDropdown(!opennedDropdown);
        }}
      />
      {opennedDropdown && (
        <div
          className={`${style.dropdown} border-2 border-gray-100 rounded-md p-1`}
        >
          {data &&
            data.map(item => (
              <div
                key={item.id}
                className={`${style.dropdownItem}`}
                onClick={() => {
                  setData(item);
                  setOpennedDropdown(false);
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
