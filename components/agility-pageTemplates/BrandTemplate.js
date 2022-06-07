import React from "react";
import { ContentZone } from "@agility/nextjs";
import { getModule } from "../agility-pageModules";

const BrandTemplate = (props) => {
  return (
    <ContentZone name="MainContentZone" {...props} getModule={getModule} />
  );
};

export default BrandTemplate;
