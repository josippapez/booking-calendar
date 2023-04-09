import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const AlertContext = createContext<{
  alertDisplayed: boolean;
  showAlert(
    alertInfotext: string,
    showOnlyConfirmOption?: boolean,
    confirmOption?: () => () => void | Promise<void>
  ): void;
  alertInfotext: string;
  showOnlyConfirmOption?: boolean;
  confirmOption(): void;
  closeModal(): void;
}>({
  alertDisplayed: false,
  showAlert: (
    alertInfotext: string,
    showOnlyConfirmOption?: boolean,
    confirmOption?: () => () => void | Promise<void>
  ) => {},
  alertInfotext: '',
  showOnlyConfirmOption: false,
  confirmOption: () => {},
  closeModal: () => {},
});

export const useAlert = () => {
  return useContext(AlertContext);
};

export function AlertModalProvider({ children }: any) {
  const [show, setShow] = useState(false);
  const [alertInfotext, setAlertInfotext] = useState('');
  const [showOnlyConfirmOption, setShowOnlyConfirmOption] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState(() => () => {});

  const closeModal = useCallback(() => {
    setAlertInfotext('');
    setShowOnlyConfirmOption(false);
    setConfirmFunction(() => {});
    setShow(false);
  }, []);

  const handleConfirmOption = async () => {
    await confirmFunction();
    closeModal();
  };

  const showAlert = useCallback(
    (
      alertInfotext: string,
      showOnlyConfirmOption: boolean,
      confirmOption: () => () => void | Promise<void>
    ) => {
      setConfirmFunction(confirmOption || (() => {}));
      setAlertInfotext(alertInfotext);
      setShowOnlyConfirmOption(showOnlyConfirmOption);
      setShow(true);
    },
    []
  );

  const value = useMemo(() => {
    return {
      alertDisplayed: show,
      showAlert,
      alertInfotext,
      showOnlyConfirmOption,
      confirmOption: handleConfirmOption,
      closeModal,
    };
  }, [
    show,
    showAlert,
    alertInfotext,
    showOnlyConfirmOption,
    handleConfirmOption,
    closeModal,
  ]);

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}
