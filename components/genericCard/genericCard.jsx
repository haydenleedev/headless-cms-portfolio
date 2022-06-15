import AgilityLink from "../agilityLink";
import RenderGenericCard from "./renderGenericCard";
import style from "./genericCard.module.scss";

// A multi-purpose generic card component which can be as a card for many other componenents
// such as blog lists, resources lists, news lists etc.
const GenericCard = (props) => {
  return (
    <>
      {props.link ? (
        <AgilityLink
          agilityLink={props.link}
          ariaLabel={props.ariaTitle && "Navigate to : " + props.ariaTitle}
          title={props.ariaTitle}
          className={`${props.brandLayout ?  `${style.cardWrapper} ` :  "genericCardWrapper genericCardWrapper__link"}`}
        >
          <RenderGenericCard properties={props} />
        </AgilityLink>
      ) : (
        <div className={`${props.brandLayout ? `${style.cardWrapper}` :  "genericCardWrapper"}`}>
          <RenderGenericCard properties={props} />
        </div>
      )}
    </>
  );
};

export default GenericCard;
