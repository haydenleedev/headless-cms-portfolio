import { useContext } from "react";
import GlobalContext from "../../../context";
import modal from "./modal.module.scss";

const Backdrop = ({ onCancel }) => {
  const { updateFormData } = useContext(GlobalContext);
  return (
    <div
      className={modal.backdrop}
      onClick={() => {
        document.body.className = null;
        onCancel();
        updateFormData({ noAddOn: false });
      }}
    />
  );
};

export default Backdrop;
