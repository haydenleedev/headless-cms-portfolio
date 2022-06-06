const g2Crowd = `
    (function (c, p, d, u, id, i) {
        id = ""; // Optional Custom ID for user in your system
        u =
        "https://tracking.g2crowd.com/attribution_tracking/conversions/" +
        c +
        ".js?p=" +
        encodeURI(p) +
        "&e=" +
        id;
        i = document.createElement("script");
        i.type = "application/javascript";
        i.async = true;
        i.src = u;
        d.getElementsByTagName("head")[0].appendChild(i);
    })("1136", document.location.href, document);
`;

export default g2Crowd;
