import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  inputKey?: any;
  serviceTotal: string;
  setServiceName: (serviceName: string) => void;
  setServiceAmount: (serviceAmount: string) => void;
  setServicePrice: (servicePrice: string) => void;
  removeService: () => void;
};

const ServiceInput = (props: Props) => {
  const {
    inputKey,
    setServiceName,
    setServiceAmount,
    setServicePrice,
    removeService,
    serviceTotal,
  } = props;
  const { t, i18n } = useTranslation("ServiceInput");

  const handleRemoveService = useCallback(() => {
    removeService();
  }, [removeService]);

  return (
    <div
      key={`service-${inputKey}`}
      className="flex flex-row gap-2 w-full mb-2"
    >
      <input
        className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-2/6"
        type={"text"}
        placeholder={t("name").toString()}
        onChange={e => setServiceName(e.target.value)}
      />
      <input
        className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6"
        type={"number"}
        lang={i18n.language}
        placeholder={t("amount").toString()}
        onChange={e => setServiceAmount(e.target.value)}
      />
      <input
        className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6"
        type={"number"}
        lang={i18n.language}
        placeholder={t("price").toString()}
        onChange={e => setServicePrice(e.target.value)}
      />
      <div className="appearance-none bg-gray-200 flex items-center justify-center border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6">
        {Number(serviceTotal).toLocaleString(i18n.language, {
          minimumFractionDigits: 2,
        })}
      </div>
      <button
        className={`w-10 h-10`}
        style={{
          backgroundImage: "url(/Styles/Assets/Images/xCircle.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
        onClick={handleRemoveService}
      />
    </div>
  );
};

export default ServiceInput;
