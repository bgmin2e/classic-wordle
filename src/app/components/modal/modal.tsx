import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./modal.css";

const ModalContext = createContext<{
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode;
}>({
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
});

function Modal() {
  const { modalContent, closeModal } = useContext(ModalContext);

  return (
    <>
      {modalContent &&
        createPortal(
          <div className="modal-dimmed" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-body">{modalContent}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

const useModalContext = () => {
  const { openModal, closeModal } = useContext(ModalContext);
  return { openModal, closeModal };
};

function ModalProvider({ children }: PropsWithChildren<{}>) {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalContent }}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
}

export { ModalProvider, useModalContext };
