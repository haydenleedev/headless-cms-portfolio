import { renderHTML } from "@agility/nextjs";
import { useState } from "react/cjs/react.development";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./accordion.module.scss";

const Accordion = ({ customData }) => {
    const items = customData.items;
    items.sort(function (a, b) {
        return a.properties.itemOrder - b.properties.itemOrder;
    });
    const [expandedItem, setExpandedItem] = useState(null);
    return (
        <section className="section">
            <div className="container">
                <div className={style.accordion}>
                    {items.map((item, index) => {
                        return (
                            <div
                                className={`${style.accordionItem} ${expandedItem == index && style.expanded }`}
                                key={`accordionItem${index}`}
                                onFocus={() => setExpandedItem(index)}
                            >
                                <div
                                    className={style.itemToggle}
                                    tabIndex={0}
                                    aria-label={`Open accordion item ${item.fields.heading}`}
                                >
                                    <div className={style.chevron} />
                                    <h3 className="heading-5 text-darkblue">{item.fields.heading}</h3>
                                </div>
                                <div className={style.itemContentWrapper}>
                                    <div dangerouslySetInnerHTML={renderHTML(item.fields.html)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

Accordion.getCustomInitialProps = async function({ item }) {
    const { items } = item.fields;
    const sanitizeHtml = (await import("sanitize-html")).default;
    // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
    const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
    items.forEach((item) => {
        item.fields.html = item.fields.html ? cleanHtml(item.fields.html) : null;
    });
    return { items };
};

export default Accordion;
