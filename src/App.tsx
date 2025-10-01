import { useEffect, useState } from "react";
import {
  CalculatorMain,
  type calcFormatsType,
  type CalcInputProps,
  type calcPositionsType,
} from "./assets/components/hooks/CalculatorMain/CalculatorMain";

const CITIES_URL = "/cities.json";
const FORMATS_URL = "/formats.json";
const POSITIONS_URL = "/positions.json";

const BottomTextBlock = ({ text }: { text: string }) => {
  return (
    <div className="max-w-[381.5px] text-[#B9B9B9] text-[18px] ">
      <img src="/star.svg" className="mb-4" />
      {text}
    </div>
  );
};

export interface mainDataType {
  cities: CalcInputProps[];
  formats: calcFormatsType[];
  positions: calcPositionsType[];
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<null | mainDataType>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [citiesRes, formatsRes, positionsRes] = await Promise.all([
          fetch(CITIES_URL),
          fetch(FORMATS_URL),
          fetch(POSITIONS_URL),
        ]);

        if (!citiesRes.ok)
          throw new Error(
            `Cities: ${citiesRes.status} ${citiesRes.statusText}`
          );
        if (!formatsRes.ok)
          throw new Error(
            `Formats: ${formatsRes.status} ${formatsRes.statusText}`
          );
        if (!positionsRes.ok)
          throw new Error(
            `Formats: ${positionsRes.status} ${positionsRes.statusText}`
          );

        const citiesData: CalcInputProps[] = await citiesRes.json();
        const formatsData: calcFormatsType[] = await formatsRes.json();
        const positionsData: calcPositionsType[] = await positionsRes.json();

        setData({
          cities: citiesData,
          formats: formatsData,
          positions: positionsData,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Неизвестная ошибка";
        console.error("Ошибка загрузки данных:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <>
      <div className="max-w-[794px] mx-auto pt-[50px]">
        {loading ? (
          <div className="loader mx-auto mt-20" />
        ) : data ? (
          <div>
            <h2 className="text-[48px]">Есептеу оңай</h2>
            <p className="text-[18px] mt-5">
              Бұл жарнамалық калькулятор.
              <br />
              Ол 2GIS-те жарнама орналастырудың болжалды бағасын есептеуге
              көмектеседі.
            </p>
            <CalculatorMain data={data} />
            <section className="mt-10 flex items-start gap-8">
              <BottomTextBlock text="Бұл ««Старт Медиа» пакеті». позициясы үшін 2GIS-те жарнама орналастырудың ҚҚС жоқ болжалды бағасы. Қорытынды сома жарнамалық позициялар жиынтығына, орналастыру мерзіміне, филиалдар санына және сіздің бизнесіңіз кіретін баға тобына байланысты. Ақырғы баға мен позицияларды қосу шарттарын білу үшін 2GIS менеджеріне хабарласыңыз." />
              <BottomTextBlock text="Баға 6 айға жарнамаға есептелген — бұл таңдалған қала үшін ең минималды мерзім" />
            </section>
          </div>
        ) : (
          <div>Ошибка получения данных</div>
        )}
      </div>
    </>
  );
}
