import React from "react";
import { ContentZone } from "@agility/nextjs";
import { getModule } from "../agility-pageModules";

const MainTemplate = (props) => {
  return (
    <ContentZone name="MainContentZone" {...props} getModule={getModule} />
  );
};

export default MainTemplate;
