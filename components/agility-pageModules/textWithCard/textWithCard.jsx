import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./textWithCard.module.scss";

const TextWithCard = ({ module, customData }) => {
    const sanitizedHtml = customData.sanitizedHtml;
    const sanitizedCardHtml = customData.sanitizedCardHtml;
    const { fields } = module;
    const cardFields = fields.card.fields;
    return (
        <section className="section">
            <div className="container">
                <div id={style.content}>
                    {fields.card &&
                        <div id={style.card}>
                            <div id={style.cardTop}>
                                {cardFields.topBarText &&
                                    <div id={style.bar}>
                                        <p>{cardFields.topBarText}</p>
                                    </div>
                                }
                                {cardFields.heading &&
                                    <h3 id={style.cardHeading}>
                                        {cardFields.heading}
                                    </h3>
                                }
                                {cardFields.price &&
                                    <h2 id={style.price}>
                                        {`$${cardFields.price}`}
                                    </h2>
                                }
                                {cardFields.conditionsText &&
                                    <h4 id={style.conditions}>
                                        {cardFields.conditionsText}
                                    </h4>
                                }
                            </div>
                            <div
                                id={style.cardContent}
                                dangerouslySetInnerHTML={renderHTML(sanitizedCardHtml)}
                            >
                            </div>
                        </div>
                    }
                    {(fields.heading || fields.text) &&
                        <div id={style.text}>
                            {fields.heading &&
                                <h2>{fields.heading}</h2>
                            }
                            {fields.text &&
                                <div
                                    dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                                >
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </section>
    );
}

TextWithCard.getCustomInitialProps = async function ({ item }) {
    const sanitizeHtml = (await import("sanitize-html")).default;
    // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

    const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

    const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;
    const sanitizedCardHtml = item.fields.card.fields.content ? cleanHtml(item.fields.card.fields.content) : null;

    return {
        sanitizedHtml: sanitizedHtml,
        sanitizedCardHtml: sanitizedCardHtml
    };
};

export default TextWithCard;
