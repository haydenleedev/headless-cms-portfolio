// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

import FirstFold from "./firstFold/firstFold";
import ClientLogosList from "./clientLogosList/clientLogosList";
import Placeholder from "./placeholder";
import RichTextArea from "./richTextArea/richTextArea";

// Template renderers
import BlogPostContent from "./blogPostContent/blogPostContent";
import ResourceContent from "./resourceContent/resourceContent";

const allModules = [
  { name: "FirstFold", module: FirstFold },
  { name: "Placeholder", module: Placeholder },
  { name: "ClientLogosList", module: ClientLogosList },
  { name: "RichTextArea", module: RichTextArea },
  { name: "BlogPostContent", module: BlogPostContent },
  { name: "ResourceContent", module: ResourceContent },
  { name: "OverrideSEO", module: Placeholder },
  { name: "TextWithMedia", module: Placeholder },
  { name: "TextGrid", module: Placeholder },
  { name: "ClientTestimonial", module: Placeholder },
  { name: "ResourceList", module: Placeholder },
  { name: "TextGridWithMedia", module: Placeholder },
  
];

export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
