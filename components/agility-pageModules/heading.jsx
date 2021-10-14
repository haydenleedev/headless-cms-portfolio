/**
This is a helper component used to conditionally render a heading tag inside any module from agility with headings. 
*/

const Heading = ({ headingTag, heading, headingClass }) => {
  if (!heading) return null;
  const headingTags = {
    h1: <h1 className={headingClass}>{heading}</h1>,
    h2: <h2 className={headingClass}>{heading}</h2>,
    h3: <h3 className={headingClass}>{heading}</h3>,
    h4: <h4 className={headingClass}>{heading}</h4>,
    h5: <h5 className={headingClass}>{heading}</h5>,
    h6: <h6 className={headingClass}>{heading}</h6>,
    p: <p className={headingClass}>{heading}</p>,
  };
  return headingTags[headingTag];
};

export default Heading;
