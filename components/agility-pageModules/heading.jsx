/**
This is a helper component used to conditionally render a heading tag inside any module from agility with headings. 
*/

const Heading = ({ type, text, classes, color }) => {
  if (!text) return null;
  const headingTags = {
    h1: <h1 className={`${color} ${classes}`}>{text}</h1>,
    h2: <h2 className={`${color} ${classes}`}>{text}</h2>,
    h3: <h3 className={`${color} ${classes}`}>{text}</h3>,
    h4: <h4 className={`${color} ${classes}`}>{text}</h4>,
    h5: <h5 className={`${color} ${classes}`}>{text}</h5>,
    h6: <h6 className={`${color} ${classes}`}>{text}</h6>,
    p: <p className={`${color} ${classes}`}>{text}</p>,
  };
  return headingTags[type];
};

export default Heading;
