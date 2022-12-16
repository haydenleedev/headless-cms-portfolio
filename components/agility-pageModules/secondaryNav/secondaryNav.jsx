import AgilityLink from "../../agilityLink";
import style from "./secondaryNav.module.scss";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));
import { useRef, useEffect, useContext } from "react";
import GlobalContext from "../../../context";
import HorizontallyScrollableList from "../../horizontallyScrollableList/horizontallyScrollableList";

const SecondaryNav = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const sectionRef = useRef();
  const { navbarRef } = useContext(GlobalContext);

  const links = fields.links.map((link, index) => {
    return (
      <AgilityLink
        agilityLink={{ href: link.fields.link.href }}
        key={`link${index}`}
      >
        <p>{link.fields.link.text}</p>
      </AgilityLink>
    );
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (
          e.intersectionRatio < 1 &&
          e.target.getBoundingClientRect().top < 0
        ) {
          navbarRef.current.style.display = "none";
        } else {
          navbarRef.current.style.display = "block";
        }
      },
      { threshold: [1] }
    );
    observer.observe(sectionRef.current);
    return () => {
      navbarRef.current.style.display = "block";
    };
  }, []);

  return (
    <>
      {fields.links && (
        <section className={`section ${style.section}`} ref={sectionRef}>
          <nav className={`container ${style.nav}`}>
            {heading && <Heading {...heading} />}
            <HorizontallyScrollableList items={links} maxVisibleItems={4} />
          </nav>
        </section>
      )}
    </>
  );
};

export default SecondaryNav;
