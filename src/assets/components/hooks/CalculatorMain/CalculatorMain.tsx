import { useEffect, useMemo, useRef, useState } from "react";
import useClickOutside from "../useOnClickOutside";
import type { mainDataType } from "../../../../App";

interface CalcOuputPointProps {
  headline: string;
  value: string;
  withStar?: boolean;
}

interface calcBaseType {
  name: string;
  priceValue: number;
}

export interface CalcInputProps extends calcBaseType {
  img?: string;
  isChecked?: boolean;
}

export interface calcFormatsType extends CalcInputProps {
  relatedItems: number[];
}

export interface calcPositionsType extends CalcInputProps {
  id: number;
}

const CalcOuputPoint = ({ headline, value, withStar }: CalcOuputPointProps) => {
  return (
    <div className="relative">
      <h3 className="text-[18px]">{headline}</h3>
      <p className="font-medium text-[59px] leading-[64px]">{value}</p>
      {withStar && (
        <img
          src="/star.svg"
          className="w-8 absolute bottom-[50px] right-[-32px]"
        />
      )}
    </div>
  );
};

const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="w-[24px] -mr-1 min-w-6"
    style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
  >
    <path d="M7 10l5 5 5-5z"></path>
  </svg>
);

const INPUT_MAIN_WRAPPER_STYLES =
  "relative max-w-[714px] select-none text-[18px]";
const INPUT_MAIN_STYLES =
  "min-h-[56px] box-border px-4 py-4 bg-white rounded flex items-center justify-between cursor-pointer shadow";
const DROPDOWN_MAIN_STYLES =
  "absolute w-full left-0 top-full mt-1 bg-white rounded py-2 box-border max-h-[450px] overflow-auto shadow font-medium z-10";
const DROPDOWN_POINT_STYLES =
  "flex items-center gap-2 w-full hover:bg-[#F4F4F4] pl-4 cursor-pointer py-[2px]";

const EmptyCheckbox = () => (
  <svg
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="CheckBoxOutlineBlankIcon"
    className="w-6"
  >
    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
  </svg>
);

const ActiveCheckbox = () => (
  <svg
    className="w-6 fill-[#19aa1e]"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="CheckBoxIcon"
  >
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
  </svg>
);

const MultiChoiceCalcInput = ({
  data,
  placeholder,
  setPrice,
}: {
  data: CalcInputProps[];
  placeholder: string;
  setPrice: (price: number[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [checkedData, setCheckedData] = useState<CalcInputProps[]>(data);

  const hasChecked = checkedData.some((item) => item.isChecked === true);

  const closeBodyHandle = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const setCheckedDataHandle = (el: CalcInputProps) => {
    const newData = checkedData.map((item) =>
      item.name === el.name
        ? {
            ...item,
            isChecked: !item.isChecked,
          }
        : item
    );

    const calcMassive = newData
      .filter((el) => el.isChecked)
      .map((el) => el.priceValue);

    setPrice(calcMassive);
    setCheckedData(newData);
  };

  useEffect(() => {
    setCheckedData(data);
    setPrice([]);
  }, [data]);

  useClickOutside(isOpen ? ref : null, closeBodyHandle);
  return (
    <div className={INPUT_MAIN_WRAPPER_STYLES} ref={ref}>
      <div
        className={INPUT_MAIN_STYLES}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: "fit-content",
          maxHeight: hasChecked ? undefined : "56px",
        }}
      >
        {hasChecked ? (
          <div className="flex flex-wrap gap-2">
            {checkedData
              .filter((item) => item.isChecked)
              .map((item, index) => (
                <div
                  key={index}
                  className="text-[13px] bg-[#e0e0e0] rounded-2xl px-3 py-1"
                >
                  {item.name}
                  <div />
                </div>
              ))}
          </div>
        ) : (
          <div className="ml-[42px] text-[#B9B9B9]">{placeholder}</div>
        )}

        <ArrowIcon isOpen={isOpen} />
      </div>
      {isOpen && (
        <div className={DROPDOWN_MAIN_STYLES}>
          {checkedData.map((el, index) => (
            <div
              className={DROPDOWN_POINT_STYLES}
              key={index}
              onClick={() => setCheckedDataHandle(el)}
              style={{ background: el.isChecked ? "#F4F4F4" : undefined }}
            >
              {el.isChecked ? <ActiveCheckbox /> : <EmptyCheckbox />}

              <div className="font-normal">{el.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalcInput = ({
  data,
  defaultImage,
  placeholder,
  isSearch,
  setPrice,
  setRelatedPositions,
}: {
  data: (CalcInputProps | calcFormatsType)[];
  defaultImage: string;
  placeholder: string;
  isSearch?: boolean;
  setPrice: (price: number) => void;
  setRelatedPositions?: (formats: number[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputImage, setInputImage] = useState(defaultImage);
  const [chosenData, setChosenData] = useState<CalcInputProps>({
    name: "",
    priceValue: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeBodyHandle = () => {
    if (isOpen) {
      setIsOpen(false);
    }
    if (inputValue !== chosenData.name) {
      setInputValue(chosenData.name);
      setInputImage(chosenData.img ? chosenData.img : defaultImage);
    }
  };

  const setInputValueHandle = (
    value: string,
    price: number,
    img?: string,
    relatedItems?: number[]
  ) => {
    setIsOpen(false);
    setInputValue(value);
    setInputImage(img ? img : defaultImage);
    setChosenData({
      img: img,
      name: value,
      priceValue: price,
    });
    setPrice(price);
    if (setRelatedPositions && relatedItems) {
      setRelatedPositions(relatedItems);
    }
  };

  const switchOpenHandle = () =>
    setIsOpen((prev) => {
      const newIsOpen = !prev;
      if (newIsOpen && inputRef.current) {
        inputRef.current.focus();
      }
      return newIsOpen;
    });

  const filteredData = isSearch
    ? data.filter((city) =>
        city.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : data;

  useClickOutside(isOpen ? ref : null, closeBodyHandle);

  return (
    <div className={INPUT_MAIN_WRAPPER_STYLES} ref={ref}>
      <div
        className={INPUT_MAIN_STYLES}
        onClick={switchOpenHandle}
        style={{ maxHeight: "56px" }}
      >
        <div className="flex items-center gap-3 w-full">
          <img src={inputImage} className="w-8 max-h-8" />
          <input
            style={{ cursor: isSearch ? undefined : "pointer" }}
            className="outline-none w-full placeholder:text-[#B9B9B9]"
            placeholder={placeholder}
            type="text"
            name="null"
            readOnly={!isSearch}
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              if (!isSearch) return;
              setInputValue(e.currentTarget.value);
              if (!isOpen) setIsOpen(true);
              if (inputImage !== defaultImage) setInputImage(defaultImage);
            }}
          />
        </div>
        <ArrowIcon isOpen={isOpen} />
      </div>
      {isOpen && (
        <div className={DROPDOWN_MAIN_STYLES}>
          {filteredData.length > 0 ? (
            filteredData.map((el, index) => (
              <div
                className={DROPDOWN_POINT_STYLES}
                key={index}
                onClick={() =>
                  setInputValueHandle(
                    el.name,
                    el.priceValue,
                    el.img,
                    "relatedItems" in el ? el.relatedItems : undefined
                  )
                }
              >
                {el.img && <img src={el.img} className="w-8 max-h-8" />}

                <div>{el.name}</div>
              </div>
            ))
          ) : (
            <div className="text-[#B9B9B9] pl-4">Қаланы таңдаңыз</div>
          )}
        </div>
      )}
    </div>
  );
};

export const CalculatorMain = ({ data }: { data: mainDataType }) => {
  const [cityPrice, setCityPrice] = useState<number | null>(null);
  const [formatPrice, setFormatPrice] = useState<number | null>(null);
  const [relatedPositions, setRelatedPositions] = useState<number[] | null>(
    null
  );
  const [positionPrice, setPositionPrice] = useState<number[]>([]);

  let isReady = false;

  console.log(data);

  const filteredPositions = useMemo(() => {
    if (!relatedPositions || relatedPositions.length === 0) {
      return [];
    }
    return data.positions.filter((pos) => relatedPositions.includes(pos.id));
  }, [relatedPositions, data.positions]);

  const positionsSum = positionPrice.reduce((sum, val) => sum + val, 0);

  let totalSum = 99904;
  if (cityPrice) {
    totalSum = cityPrice;
  }
  if (formatPrice) {
    totalSum = totalSum + formatPrice;
  }
  if (positionPrice.length > 0) {
    totalSum = totalSum + positionsSum;
  }
  const total = totalSum * 6;

  if (cityPrice && formatPrice && positionPrice.length > 0) {
    isReady = true;
  }

  return (
    <section className="mt-4 rounded-2xl bg-[#F4F4F4] box-border py-8 px-8 relative">
      <div className="space-y-3">
        <CalcInput
          data={data.cities}
          defaultImage="pin.svg"
          placeholder="Қаланы таңдаңыз"
          isSearch
          setPrice={setCityPrice}
        />
        {cityPrice && (
          <CalcInput
            data={data.formats}
            defaultImage="crown.svg"
            placeholder="Жарнама форматын таңдаңыз"
            setPrice={setFormatPrice}
            setRelatedPositions={setRelatedPositions}
          />
        )}

        {formatPrice && (
          <MultiChoiceCalcInput
            data={filteredPositions}
            placeholder="Жарнамалық позицияларды таңдаңыз"
            setPrice={setPositionPrice}
          />
        )}
      </div>
      <div
        className="flex items-start gap-20 mt-8"
        style={{ color: isReady ? "black" : "#B9B9B9" }}
      >
        <div className="flex flex-col gap-5">
          <CalcOuputPoint
            headline="Бір айлық бағасы"
            value={`${totalSum.toLocaleString()} Тг`}
          />
          <CalcOuputPoint
            headline="Қорытынды бағасы"
            value={`${total.toLocaleString()} Тг`}
            withStar
          />
        </div>
        <CalcOuputPoint headline="Орналастыру мерзімі" value={`6 Ай`} />
      </div>
      <div>
        {isReady && (
          <a
            id="popup-btn"
            href="#popup:callback"
            className="text-center text-black text-[18px] w-full max-w-[714px] bg-[#3bb643] rounded-lg font-medium py-5 block hover:bg-[#3f51b5] mt-12"
          >
            Тапсырыс беру
          </a>
        )}
      </div>
    </section>
  );
};
