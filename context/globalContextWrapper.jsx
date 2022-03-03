import { useState } from "react";
import GlobalContext from ".";
import Modal from "../components/modal/modal";

// this component wraps the site's global context. Used e.g. for guarantee that the global modal is always on the top of the site layout
const GlobalContextWrapper = ({ children, data }) => {
  const [globalModalTrigger, setGlobalModalTrigger] = useState(false);
  const [globalModalContent, setGlobalModalContent] = useState(null);

  const handleSetGlobalModal = (content) => {
    setGlobalModalTrigger(!globalModalTrigger);
    setGlobalModalContent(content);
  };

  const context = {
    globalModalTrigger,
    handleSetGlobalModal,
    globalSettings: data
  };
  return (
    <GlobalContext.Provider value={context}>
      {children}
      <Modal
        trigger={globalModalTrigger}
        closeCallback={() => {
          setGlobalModalContent(null);
        }}
      >
        {globalModalContent}
      </Modal>
    </GlobalContext.Provider>
  );
};
export default GlobalContextWrapper;
