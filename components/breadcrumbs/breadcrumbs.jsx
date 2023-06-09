import Link from "next/link";
import { useRouter } from "next/router";
import style from "./breadcrumbs.module.scss";

const Breadcrumbs = ({ breadcrumbs, className }) => {
  const { asPath } = useRouter();
  let breadcrumbItems = [];
  if (breadcrumbs) {
    breadcrumbItems = breadcrumbs;
  } else {
    const splitPath = asPath.split("/");
    for (let i = 0; i < splitPath.length; i++) {
      const item = {};
      if (splitPath[i] === "") {
        item.name = "Home";
        item.path = "/";
      } else {
        item.name = splitPath[i].replace(/-/g, " ");
        if (i == splitPath.length - 1) {
          item.name = item.name.split(/\?|#/)[0];
        }
        item.path = splitPath[i];
      }
      breadcrumbItems.push(item);
    }
  }

  const breadcrumbElements = breadcrumbItems.map((item, index) => {
    return (
      <div key={`item${index}`}>
        {item.path && index < breadcrumbItems.length - 1 ? (
          <Link href={item.path}>
            <p>{item.name}</p>
          </Link>
        ) : (
          <p className>{item.name}</p>
        )}
        {index < breadcrumbItems.length - 1 && (
          <p className={style.separator}>&gt;</p>
        )}
      </div>
    );
  });

  return (
    <>
      {breadcrumbElements.length > 1 ? (
        <section className={`${style.section} section ${className}`}>
          <div className="container">
            <nav className={style.breadcrumbs} aria-label="Breadcrumbs">
              {breadcrumbElements}
            </nav>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default Breadcrumbs;
