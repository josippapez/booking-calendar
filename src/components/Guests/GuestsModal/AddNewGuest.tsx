import React from "react";
import Modal from "../../Shared/Modal/Modal";

type Props = {
  show: boolean;
  closeModal: (state: boolean) => void;
};

const AddNewGuest = (props: Props) => {
  const { show, closeModal } = props;
  return (
    <Modal show={show} closeModal={() => closeModal(false)} animation="fade">
      <div className="bg-white p-5 rounded-md shadow-md">
        <h1>Add new guest</h1>
      </div>
    </Modal>
  );
};

export default AddNewGuest;
