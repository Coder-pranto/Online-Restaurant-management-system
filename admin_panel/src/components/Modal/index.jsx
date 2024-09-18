/* eslint-disable react/prop-types */
import Modal, { Styles } from "react-modal";

Modal.setAppElement("#root"); // Specify the root element for accessibility

const DynamicModal = ({ isOpen, onRequestClose, customStyle, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyle}
      contentLabel="Dynamic Modal"
    >
      <div>{content}</div>
      {/* <button onClick={onRequestClose}>Close</button> */}
    </Modal>
  );
};

export default DynamicModal;
