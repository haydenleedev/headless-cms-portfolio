import Image from "next/image";
import ImageLoader from "../../../public/loading.gif";
import layout from "../../styles/layout.module.scss";
import style from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={`${layout["align-center"]} ${layout["text-center"]}`}>
      <p className={style["loader-header"]}>Please wait...</p>
      <p className={style["loader-body"]}>
        Please be patient as we process your information - it may take a few
        seconds.
      </p>

      <Image src={ImageLoader} alt="" width={100} height={100} />
    </div>
  );
};

export default Loader;
