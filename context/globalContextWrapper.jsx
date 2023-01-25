import { useRef, useState } from "react";
import GlobalContext from ".";
import Modal from "../components/modal/modal";

// this component wraps the site's global context. Used e.g. for guarantee that the global modal is always on the top of the site layout
const GlobalContextWrapper = ({ children }) => {
  const [globalModalTrigger, setGlobalModalTrigger] = useState(false);
  const [globalModalContent, setGlobalModalContent] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [canLoadOptimize, setCanLoadOptimize] = useState(false); // load optimize only after onetrust

  // UJET shop formData object
  const [formData, setFormData] = useState({});

  const handleSetGlobalModal = (content) => {
    setGlobalModalTrigger(!globalModalTrigger);
    setGlobalModalContent(content);
  };

  const handleSetGlobalSettings = (settings) => {
    setGlobalSettings(settings);
  };

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const resetData = () => {
    setFormData({});
  };

  const handleSetCanLoadOptimize = () => {
    setCanLoadOptimize(true);
  };

  const context = {
    globalModalTrigger,
    formData,
    handleSetGlobalModal,
    handleSetGlobalSettings,
    globalSettings,
    navbarRef: useRef(),
    updateFormData,
    resetData,
    campaignScriptIDRef: useRef(null),
    handleSetCanLoadOptimize,
    canLoadOptimize,
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
