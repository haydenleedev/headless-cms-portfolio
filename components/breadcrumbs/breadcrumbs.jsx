import Link from "next/link";
import { useRouter } from "next/router";
import style from "./breadcrumbs.module.scss";

const Breadcrumbs = ({ breadcrumbs }) => {
    const { asPath } = useRouter();
    let breadcrumbItems = [];
    if (breadcrumbs) {
        breadcrumbItems = breadcrumbs;
    }
    else {
        const splitPath = asPath.split("/");
        for (let i = 0; i < splitPath.length; i++) {
            const item = {};
            if (splitPath[i] === "") {
                item.name = "Home";
                item.path = "/"
            }
            else {
                item.name = splitPath[i].replaceAll(/-/g, " ");
                item.path = splitPath[i];
            }
            breadcrumbItems.push(item);
        }
    }

    const breadcrumbElements = breadcrumbItems.map((item, index) => {
        return (
            <div key={`item${index}`}>
                {item.path && index < breadcrumbItems.length - 1 ?
                    <Link href={item.path}>
                        <a>
                            <p>{item.name}</p>
                        </a>
                    </Link>
                    :
                    <p className>{item.name}</p>
                }
                {(index < breadcrumbItems.length - 1) &&
                    <p className={style.separator}>&gt;</p>
                }
            
            </div>
        );
    });

    return (
        <>
            {breadcrumbElements.length > 1 ?
                <section className={`${style.section} section`}>
                    <div className="container">
                        <nav
                            className={style.breadcrumbs}
                            aria-label="Breadcrumbs"
                        >
                            {breadcrumbElements}
                        </nav>
                    </div>
                </section>
                : null
            }
        </>
    )
}

export default Breadcrumbs;
