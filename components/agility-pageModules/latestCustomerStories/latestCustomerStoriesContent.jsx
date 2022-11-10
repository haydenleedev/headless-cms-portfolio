import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import style from "./latestCustomerStories.module.scss";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const GenericCard = dynamic(() => import("../../genericCard/genericCard"), {
  ssr: false,
});

const LatestCustomerStoriesContent = ({ fields, customerStories }) => {
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
                  link={story.fields.link}
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
