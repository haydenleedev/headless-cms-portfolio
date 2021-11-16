// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

import FirstFold from "./firstFold/firstFold";
import ClientLogosList from "./clientLogosList/clientLogosList";
import Placeholder from "./placeholder";
import RichTextArea from "./richTextArea/richTextArea";
import TextGridWithMedia from "./textGridWithMedia/textGridWithMedia";
import TextWithMedia from "./textWithMedia/textWithMedia";
import ClientTestimonial from "./clientTestimonial/clientTestimonial";
import Spacer from "./spacer/spacer";
import ResourceList from "./resourceList/resourceList";
import HeroImage from "./heroImage/heroImage";
import CallToAction from "./callToAction/callToAction";
import NewsList from "./newsList/newsList";
import PressReleaseList from "./pressReleaseList/pressReleaseList";
import Infographic from "./infographic/infographic";
import CaseStudyDownloadPrompt from "./caseStudyDownloadPrompt/caseStudyDownloadPrompt";
import LatestCustomerStories from "./latestCustomerStories/latestCustomerStories";
import TestimonialList from "./testimonialList/testimonialList";
import TextWithForm from "./textWithForm/textWithForm";

// Template renderers
import BlogPostContent from "./blogPostContent/blogPostContent";
import ResourceContent from "./resourceContent/resourceContent";
import PressReleaseContent from "./pressReleaseContent/pressReleaseContent";
import ArchivesPageContent from "./archivesPageContent/archivesPageContent";

const allModules = [
  { name: "FirstFold", module: FirstFold },
  { name: "Placeholder", module: Placeholder },
  { name: "ClientLogosList", module: ClientLogosList },
  { name: "RichTextArea", module: RichTextArea },
  { name: "BlogPostContent", module: BlogPostContent },
  { name: "ResourceContent", module: ResourceContent },
  { name: "PressReleaseContent", module: PressReleaseContent },
  { name: "OverrideSEO", module: Placeholder },
  { name: "TextWithMedia", module: TextWithMedia },
  { name: "TextGridWithMedia", module: TextGridWithMedia },
  { name: "ClientTestimonial", module: ClientTestimonial },
  { name: "ResourceList", module: ResourceList },
  { name: "TextGridWithMedia", module: Placeholder },
  { name: "Spacer", module: Spacer },
  { name: "HeroImage", module: HeroImage },
  { name: "CallToAction", module: CallToAction },
  { name: "NewsList", module: NewsList },
  { name: "PressReleaseList", module: PressReleaseList },
  { name: "BlogHomePageContent", module: Placeholder },
  { name: "ArchivesPageContent", module: ArchivesPageContent },
  { name: "Infographic", module: Infographic },
  { name: "CaseStudyDownloadPrompt", module: CaseStudyDownloadPrompt },
  { name: "LatestCustomerStories", module: LatestCustomerStories },
  { name: "TestimonialList", module: TestimonialList },
  { name: "TextWithForm", module: TextWithForm },
];

export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
