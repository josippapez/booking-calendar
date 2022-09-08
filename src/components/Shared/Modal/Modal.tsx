import PropTypes from "prop-types";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./Modal.module.scss";

interface Props {
  closeModal(): void;
  position?: "center" | "left" | "right" | "bottom" | "top";
  children: JSX.Element;
  contentClassname?: string;
  show: boolean;
  width?: "screen" | string;
  animation?:
    | "fade"
    | "slide-left"
    | "slide-right"
    | "slide-top"
    | "slide-bottom";
  ratio?:
    | "1 / 1"
    | "4 / 3"
    | "16 / 9"
    | "16 / 10"
    | "21 / 9"
    | "9 / 16"
    | "3 / 4"
    | string;
}

let openned = 0;

const Modal = (props: Props): JSX.Element => {
  const {
    closeModal,
    position,
    children,
    show,
    width,
    animation,
    ratio,
    contentClassname,
  } = props;

  useEffect(() => {
    if (openned === 0) {
      document.body.style.overflow = show ? "hidden" : "auto";
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

  return createPortal(
    <div
      ref={el => {
        if (el) {
          if (show) {
            setTimeout(() => {
              el.style.overflowY = "auto";
            }, 250);
          } else {
            el.style.overflowY = "hidden";
          }
        }
      }}
      id="modal-overlay"
      style={{
        display: !show ? "none" : "flex",
      }}
      aria-hidden="true"
      role="button"
      className={`
        ${style.overlay}
        ${style[`${position}`]}
        ${style["fadeOverlay"]}
      `}
      onMouseDown={() => closeModal()}
      onTouchStart={e => e.stopPropagation()}
    >
      <div
        id="modal-children"
        aria-hidden="true"
        className={`
          ${style.children}
          ${style[`${animation}`]}
          ${contentClassname}
          subpixel-antialiased
          flex flex-col
        `}
        onMouseDown={e => e.stopPropagation()}
        style={{
          width: width === "screen" ? window.innerWidth + "px" : width,
          maxHeight: `calc(${window.innerHeight}px / var(--scale-y))`,
          aspectRatio: ratio,
        }}
      >
        {children}
      </div>
    </div>,
    document.getElementById("__next") as Element
  );
};

Modal.defaultProps = {
  position: "center",
  width: "",
  ratio: "",
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
