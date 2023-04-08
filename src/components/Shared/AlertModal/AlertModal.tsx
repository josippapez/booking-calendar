import { Modal } from '@/components/Shared/Modal/Modal';
import { useTranslation } from 'react-i18next';
import style from './AlertModal.module.scss';
import { useAlert } from '@/AlertModalProvider';

type Props = {};

const AlertModal = (props: Props) => {
  const {
    alertDisplayed,
    alertInfotext,
    confirmOption,
    showOnlyConfirmOption,
    closeModal,
  } = useAlert();

  const { t } = useTranslation('AlertModal');

  return (
    <Modal
      show={alertDisplayed}
      width={'20rem'}
      closeModal={closeModal}
      animation='fade'
      zindex={10}
    >
      <div className={`${style['alert-modal']} rounded-md bg-white p-3`}>
        <div className={style['alert-modal__icon-alert']}></div>
        <div className={style['alert-modal__header-text']}>
          <div className={style['header-main-text']}>{t('alert')}</div>
          <div className={style['header-small-text']}>{alertInfotext}</div>
        </div>
        <div className={style['button-container']}>
          {!showOnlyConfirmOption && (
            <button
              className={style['alert-decline-button']}
              onClick={closeModal}
            >
              {t('no')}
            </button>
          )}
          <button
            className={style['alert-confirm-button']}
            onClick={confirmOption}
          >
            {showOnlyConfirmOption ? t('okay') : t('yes')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
