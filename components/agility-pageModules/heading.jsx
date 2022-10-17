/**
This is a helper component used to conditionally render a heading tag inside any module from agility with headings. 
*/

const Heading = ({ type, text, size, weight, color, classes }) => {
  if (!text) return null;
  const headingTags = {
    h1: (
      <h1
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h1>
    ),
    h2: (
      <h2
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h2>
    ),
    h3: (
      <h3
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h3>
    ),
    h4: (
      <h4
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h4>
    ),
    h5: (
      <h5
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h5>
    ),
    h6: (
      <h6
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </h6>
    ),
    p: (
      <p
        className={`${size ? size + " " : ""}${weight ? weight + " " : ""} ${
          color ? color + " " : ""
        } ${classes}`}
      >
        {text}
      </p>
    ),
  };
  return headingTags[type];
};

export default Heading;
