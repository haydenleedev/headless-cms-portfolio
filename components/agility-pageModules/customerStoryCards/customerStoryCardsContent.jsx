import dynamic from "next/dynamic";
import { Fragment } from "react";
const GenericCard = dynamic(() => import("../../genericCard/genericCard"), {
  ssr: false,
});
import style from "./customerStoryCards.module.scss";

const CustomerStoryCardsContent = ({ fields, customerStories, rootPath }) => {
  return (
    <div className={`container ${style.content}`}>
      <div className={`${style.heading} align-center mb-4`}>
        <h2 className="heading-4">{fields.title}</h2>
      </div>
      <nav
        className={`columns repeat-3 ${style.cards}`}
        aria-label="customer customerStories navigation"
      >
        {customerStories.map((story) => {
          return (
            <Fragment key={story.contentID}>
              <GenericCard
                link={{ href: `${rootPath}/${story.name}` }}
                image={story.fields.image}
                title={story.fields.title}
                ariaTitle={`${story.fields.title} customer story`}
                description={story.fields.description}
                configuration={{
                  imageHeight: "tall",
                  emphasizedTitle: true,
                }}
              />
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerStoryCardsContent;
