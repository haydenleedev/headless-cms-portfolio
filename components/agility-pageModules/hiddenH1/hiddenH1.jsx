import style from "./hiddenH1.module.scss";

const HiddenH1 = ({ module }) => {
    const { fields } = module;
    return (
        <h1 id={style.heading}>{fields.text}</h1>
    );
}

export default HiddenH1;
