import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Images from "../../../../public/Styles/Assets/Images/Images";
import style from "./Dropdown.module.scss";

type Props = {
  placeholder: string;
  selected: string;
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [component]);

  return (
    <div
      className={`${style.dropdownInput} justify-center relative flex-grow font-bold`}
      ref={component}
    >
      <div
        className="cursor-pointer bg-white hover:bg-stone-200
        rounded-md flex overflow-hidden
        justify-between relative drop-shadow-md"
        onClick={() => {
          setOpenedDropdown(!openedDropdown);
        }}
      >
        <input
          type="button"
          placeholder={placeholder}
          className="placeholder:text-sm cursor-pointer w-[calc(100%_-_30px)] text-ellipsis overflow-hidden"
          value={selected ? data.find(item => item.id === selected)?.name : ""}
        />
        <Image
          src={Images.DownArrow}
          alt="arrow"
          width={30}
          className={`absolute
            right-0 top-0
            bg-transparent`}
        />
      </div>
      {openedDropdown && (
        <div className={`${style.dropdown} rounded-md p-1 shadow-md`}>
          {data &&
            data.map(item => (
              <div
                key={item.id}
                className={`${style.dropdownItem}
                text-gray-700 hover:bg-slate-200 rounded-md p-2
                ${selected === item.id && "text-blue-600"}`}
                onClick={() => {
                  setData(item.id.toString());
                  setOpenedDropdown(false);
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
