import Modal from "react-modal";

const DynamicModal = ({ isOpen, onRequestClose, customStyle, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyle}
      contentLabel="Dynamic Modal"
      ariaHideApp={false}
    >
      <div>{content}</div>
      {/* <button onClick={onRequestClose}>Close</button> */}
    </Modal>
  );
};

export default DynamicModal;
