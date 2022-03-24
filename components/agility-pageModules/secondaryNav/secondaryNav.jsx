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
  const linkContainerRef = useRef();

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

  const scrollHorizontally = (left) => {
    const element = linkContainerRef.current;
    const maxScrollValue = element.scrollWidth - element.clientWidth;
    const currentScrollPercentage = (
      element.scrollLeft / maxScrollValue
    ).toFixed(2);
    const scrollPoints = [0, 0.25, 0.5, 0.75, 1];
    let targetScrollPercentage;
    if (currentScrollPercentage == 1 && !left) {
      targetScrollPercentage = 0;
    } else if (currentScrollPercentage == 0 && left) {
      targetScrollPercentage = 1;
    } else {
      if (left) {
        for (let i = scrollPoints.length - 1; i > 0; i--) {
          if (currentScrollPercentage > scrollPoints[i]) {
            targetScrollPercentage = scrollPoints[i];
            break;
          }
        }
      } else {
        for (let i = 0; i < scrollPoints.length; i++)
          if (currentScrollPercentage < scrollPoints[i]) {
            targetScrollPercentage = scrollPoints[i];
            break;
          }
      }
    }
    element.scrollLeft = maxScrollValue * targetScrollPercentage;
  };

  return (
    <>
      {fields.links && (
        <section className={`section ${style.section}`} ref={sectionRef}>
          <nav className={`container ${style.nav}`}>
            {heading && <Heading {...heading} />}
            <div className={style.linksWrapper}>
              <button
                className={`${style.scrollButton} reset-button`}
                onClick={() => scrollHorizontally(true)}
              />
              <div className={`${style.links}`} ref={linkContainerRef}>
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
              <button
                className={`${style.scrollButton} reset-button`}
                onClick={() => scrollHorizontally(false)}
              />
            </div>
          </nav>
        </section>
      )}
    </>
  );
};

export default SecondaryNav;
