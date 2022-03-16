import AgilityLink from "../../agilityLink";
import style from "./secondaryNav.module.scss";
import Heading from "../heading";
import { useRef, useEffect, useContext } from "react";
import GlobalContext from "../../../context";

const SecondaryNav = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const sectionRef = useRef();
  const { navbarRef } = useContext(GlobalContext);

  useEffect(() => {
    const observer = new IntersectionObserver( 
      ([e]) => {
        if (e.intersectionRatio < 1 && e.target.getBoundingClientRect().top < 0) { 
          navbarRef.current.style.display = "none";
        }
        else {
          navbarRef.current.style.display = "block";
        }
       },
      {threshold: [1]}
    );
    observer.observe(sectionRef.current)
  }, []);

  return (
    <>
      {fields.links && (
        <section
          className={`section ${style.section}`}
          ref={sectionRef}
        >
          <nav className={`container ${style.nav}`}>
            {heading && <Heading {...heading} />}
            <div className={`${style.links}`}>
              {fields.links.map((link, index) => {
                return (
                  <AgilityLink
                    agilityLink={{ href: link.fields.link.href }}
                    key={`link${index}`}
                  >
                    <p>{link.fields.link.text}</p>
                  </AgilityLink>
                );
              })}
            </div>
          </nav>
        </section>
      )}
    </>
  );
};

export default SecondaryNav;
