import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import style from './Modal.module.scss';

interface Props {
  closeModal(): void;
  position?: 'center' | 'left' | 'right' | 'bottom';
  children: JSX.Element[] | JSX.Element;
  show: boolean;
  width?: 'screen' | string;
  animation?:
    | 'fade'
    | 'slide-left'
    | 'slide-right'
    | 'slide-top'
    | 'slide-bottom';
}

let openned = 0;

const Modal = (props: Props): JSX.Element => {
  const { closeModal, position, children, show, width, animation } = props;

  useEffect(() => {
    if (openned === 0) {
      document.body.style.overflow = show ? 'hidden' : 'auto';
    }
    if (show) {
      openned++;
    }
    return () => {
      if (show) {
        openned--;
      }
    };
  }, [show]);

  return ReactDOM.createPortal(
    <div
      ref={el => {
        if (el) {
          if (show) {
            setTimeout(() => {
              el.style.overflowY = 'auto';
            }, 250);
          } else {
            el.style.overflowY = 'hidden';
          }
        }
      }}
      id='modal-overlay'
      style={{
        display: !show ? 'none' : 'flex',
        height: window.innerHeight + 'px',
        width: window.innerWidth + 'px',
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
          lg:scale-125
        `}
        onMouseDown={e => e.stopPropagation()}
        style={{
          width: width === 'screen' ? window.innerWidth + 'px' : width,
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitFontSmoothing: 'subpixel-antialiased',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>,
    document.getElementById('root') as Element
  );
};

Modal.defaultProps = {
  position: 'center',
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
