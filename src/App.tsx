import { useEffect, useState } from "react";
import {
  CalculatorMain,
  type CalcInputProps,
} from "./assets/components/hooks/CalculatorMain/CalculatorMain";

const BottomTextBlock = ({ text }: { text: string }) => {
  return (
    <div className="max-w-[381.5px] text-[#B9B9B9] text-[18px] ">
      <img src="/star.svg" className="mb-4" />
      {text}
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<CalcInputProps[]>([]);
  const [formats, setFormats] = useState<CalcInputProps[]>([]);

  const [calculatorData, setCalculatorData ] = useState({})

  useEffect(() => {
    console.log("Начинаю загрузку данных");

    const CITIES_URL =
      "https://gist.githubusercontent.com/Shasuo/580a5a568c65c93dd73a8764901a0056/raw/2da3f84b3366357cd3283b4671ab7280670e5835/cities";
    const FORMATS_URL =
      "https://gist.githubusercontent.com/Shasuo/580a5a568c65c93dd73a8764901a0056/raw/a6518fc6f8369d25995b6bcd851d2dbfaeedbef0/format";

    const loadData = async () => {
      try {
        setLoading(true);

        const [citiesRes, formatsRes] = await Promise.all([
          fetch(CITIES_URL),
          fetch(FORMATS_URL),
        ]);

        if (!citiesRes.ok)
          throw new Error(
            `Cities: ${citiesRes.status} ${citiesRes.statusText}`
          );
        if (!formatsRes.ok)
          throw new Error(
            `Formats: ${formatsRes.status} ${formatsRes.statusText}`
          );

        const citiesData: CalcInputProps[] = await citiesRes.json();
        const formatsData: CalcInputProps[] = await formatsRes.json();

        setCities(citiesData);
        setFormats(formatsData);

        console.log("✅ Города загружены:", citiesData);
        console.log("✅ Форматы загружены:", formatsData);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Неизвестная ошибка";
        console.error("❌ Ошибка загрузки данных:", errorMsg);
      } finally {
        setLoading(false);
        console.log("📥 Загрузка завершена.");
      }
    };

    loadData();
  }, []);
  return (
    <>
      <div className="max-w-[794px] mx-auto pt-[50px]">
        {loading ? (
          <div className="loader mx-auto mt-20" />
        ) : (
          <div>
            <h2 className="text-[48px]">Есептеу оңай</h2>
            <p className="text-[18px] mt-5">
              Бұл жарнамалық калькулятор.
              <br />
              Ол 2GIS-те жарнама орналастырудың болжалды бағасын есептеуге
              көмектеседі.
            </p>
            <CalculatorMain />
            <section className="mt-10 flex items-start gap-8">
              <BottomTextBlock text="Бұл ««Старт Медиа» пакеті». позициясы үшін 2GIS-те жарнама орналастырудың ҚҚС жоқ болжалды бағасы. Қорытынды сома жарнамалық позициялар жиынтығына, орналастыру мерзіміне, филиалдар санына және сіздің бизнесіңіз кіретін баға тобына байланысты. Ақырғы баға мен позицияларды қосу шарттарын білу үшін 2GIS менеджеріне хабарласыңыз." />
              <BottomTextBlock text="Баға 6 айға жарнамаға есептелген — бұл таңдалған қала үшін ең минималды мерзім" />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
