import PropTypes from 'prop-types';
import style from './Modal.module.scss';

interface Props {
  closeModal(): void;
  position?: 'center' | 'left' | 'right' | 'bottom';
  children: JSX.Element;
  show: boolean;
  height?: 'screen' | string;
  width?: 'screen' | string;
  animation?:
    | 'fade'
    | 'slide-left'
    | 'slide-right'
    | 'slide-top'
    | 'slide-bottom';
}

const Modal = (props: Props): JSX.Element => {
  const { closeModal, position, children, show, height, width, animation } =
    props;
  return (
    <div
      style={{
        display: !show ? 'none' : 'flex',
      }}
      aria-hidden='true'
      role='button'
      className={`
        ${style.overlay}
        ${style[`${position}`]}
        ${style['fade']}
      `}
      onMouseDown={() => closeModal()}
    >
      <div
        aria-hidden='true'
        className={`
          ${style.children}
          ${style[`${animation}`]}
        `}
        onMouseDown={e => e.stopPropagation()}
        style={{
          height: height === 'screen' ? '100vh' : height,
          width: width === 'screen' ? '100vw' : width,
        }}
      >
        {children}
      </div>
    </div>
  );
};

Modal.defaultProps = {
  position: 'center',
  height: '',
  width: '',
  closeModal: () => {
    return;
  },
};

Modal.propTypes = {
  closeModal: PropTypes.func,
  position: PropTypes.string,
  children: PropTypes.shape({}).isRequired,
};

export default Modal;
