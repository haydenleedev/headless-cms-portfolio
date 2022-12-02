import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import style from "./latestCustomerStories.module.scss";
import { cleanText, capitalizeFirstLetter } from "../../../utils/convert";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const GenericCard = dynamic(() => import("../../genericCard/genericCard"), {
  ssr: false,
});

const LatestCustomerStoriesContent = ({
  fields,
  customerStories,
  rootPath,
}) => {
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const [amountOfPostsToShow, setAmountOfPostsToShow] = useState(3);
  return (
    <div className="container">
      {heading && (
        <div className={`${style.heading} align-center mb-3`}>
          <Heading {...heading} />
        </div>
      )}
      <nav
        className={`columns repeat-3 ${style.content}`}
        aria-label="customer customerStories navigation"
      >
        {customerStories.map((story, i) => {
          return (
            i + 1 <= amountOfPostsToShow && (
              <Fragment key={story.contentID}>
                <GenericCard
                  link={{ href: `${rootPath}/${story.name}` }}
                  image={story.fields.image || story.fields.media}
                  title={story.fields.title || capitalizeFirstLetter(story.name)}
                  ariaTitle={`${story.fields.title || story.name} customer story`}
                  description={story.fields.description || cleanText(story.fields.text)}
                  configuration={{
                    imageHeight: "tall",
                    emphasizedTitle: true,
                  }}
                />
              </Fragment>
            )
          );
        })}
      </nav>
      {amountOfPostsToShow < customerStories.length && (
        <button
          className={`button orange ${style.loadMoreButton}`}
          onClick={(e) => {
            e.stopPropagation();
            setAmountOfPostsToShow(amountOfPostsToShow + 3);
          }}
        >
          View More Customer Stories
        </button>
      )}
    </div>
  );
};

export default LatestCustomerStoriesContent;
