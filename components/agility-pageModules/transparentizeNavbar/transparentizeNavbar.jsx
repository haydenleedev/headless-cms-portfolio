// this is an utility module which toggles the navbar's transparency on when placed on top of a page on agility.

import { useEffect, useRef } from "react";

const TransparentizeNavbar = () => {
  const moduleRef = useRef(null);

  useEffect(() => {
    // get the next sibling module to make it have extra padding and top position to compensate for the transparentized navbar
    // but ONLY if this module is placed on top of the page module list
    if (moduleRef.current && !moduleRef.current.previousSibling) {
      const nextSiblingModule = moduleRef.current.nextSibling;
      nextSiblingModule.classList.add("transparentized-navbar-transform");
    }
  }, [moduleRef.current]);
  return <section data-transparent-navbar="true" ref={moduleRef}></section>;
};

export default TransparentizeNavbar;
