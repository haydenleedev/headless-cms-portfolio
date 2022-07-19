// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.

import FirstFold from "./firstFold/firstFold";
import LogosList from "./logosList/logosList";
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
import BlogPostList from "./blogPostList/blogPostList";
import Infographic from "./infographic/infographic";
import CaseStudyDownloadPrompt from "./caseStudyDownloadPrompt/caseStudyDownloadPrompt";
import LatestCustomerStories from "./latestCustomerStories/latestCustomerStories";
import TestimonialList from "./testimonialList/testimonialList";
import TextWithForm from "./textWithForm/textWithForm";
import EmbedVideo from "./embedVideo/embedVideo";
import ContentList from "./contentList/contentList";
import AwardsBanner from "./awardsBanner/awardsBanner";
import TransparentizeNavbar from "./transparentizeNavbar/transparentizeNavbar";
import BondFirstFold from "./bondFirstFold/bondFirstFold";
import HideNavbar from "./hideNavbar/hideNavbar";
import SpeakerList from "./speakerList/speakerList";
import OverrideSEO from "./overrideSEO/overrideSEO";
import TitleGroup from "./titleGroup/titleGroup";
import Modal from "./modal/modal";
import TextWithCard from "./textWithCard/textWithCard";
import TableWithHeading from "./tableWithHeading/tableWithHeading";
import ApplySmoothScrolling from "./applySmoothScrolling/applySmoothScrolling";
import HiddenH1 from "./hiddenH1/hiddenH1";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import ScriptLoader from "./scriptLoader/scriptLoader";
import Accordion from "./accordion/accordion";
import BlankCards from "./blankCards/blankCards";
import SecondaryNav from "./secondaryNav/secondaryNav";
import TwoTextColumns from "./twoTextColumns/twoTextColumns";

// Template renderers
import BlogPostContent from "./blogPostContent/blogPostContent";
import ResourceContent from "./resourceContent/resourceContent";
import PressReleaseContent from "./pressReleaseContent/pressReleaseContent";
import ArchivesPageContent from "./archivesPageContent/archivesPageContent";
import BlogPageContent from "./blogPageContent/blogPageContent";
import EventsPageContent from "./eventsPageContent/eventsPageContent";
import AwardsPageContent from "./awardsPageContent/awardsPageContent";
import LeadershipPageContent from "./leadershipPageContent/leadershipPageContent";
import SearchPageContent from "./searchPageContent/searchPageContent";
import AcknowledgePageContent from "./acknowledgePageContent/acknowledgePageContent";
import GlossaryPageContent from "./glossaryPageContent/glossaryPageContent";
import ShopErrorPageContent from "./shopErrorPageContent/shopErrorPageContent";
import JobOpeningList from "./jobOpeningList/jobOpeningList";
import VideoPopup from "./videoPopup/videoPopup";
import BrandFirstFold from "../../brand/components/brandFirstFold/brandFirstFold";
import BrandTextWithMedia from "../../brand/components/brandTextWithMedia/brandTextWithMedia";
import BrandTwoTextColumns from "../../brand/components/brandTwoTextColumns/brandTwoTextColumns";
import BrandBlankCards from "../../brand/components/brandBlankCards/brandBlankCards";
import BrandVideoPopup from "../../brand/components/brandVideoPopup/brandVideoPopup";
import BrandTextGridWithMedia from "../../brand/components/brandTextGridWithMedia/brandTextGridWithMedia";

const allModules = [
  { name: "FirstFold", module: FirstFold },
  { name: "Placeholder", module: Placeholder },
  { name: "LogosList", module: LogosList },
  { name: "RichTextArea", module: RichTextArea },
  { name: "BlogPostContent", module: BlogPostContent },
  { name: "ResourceContent", module: ResourceContent },
  { name: "PressReleaseContent", module: PressReleaseContent },
  { name: "OverrideSEO", module: OverrideSEO },
  { name: "TextWithMedia", module: TextWithMedia },
  { name: "TwoTextColumns", module: TwoTextColumns },
  { name: "TextGridWithMedia", module: TextGridWithMedia },
  { name: "ClientTestimonial", module: ClientTestimonial },
  { name: "ResourceList", module: ResourceList },
  { name: "TextGridWithMedia", module: Placeholder },
  { name: "Spacer", module: Spacer },
  { name: "HeroImage", module: HeroImage },
  { name: "CallToAction", module: CallToAction },
  { name: "NewsList", module: NewsList },
  { name: "PressReleaseList", module: PressReleaseList },
  { name: "BlogPostList", module: BlogPostList },
  { name: "BlogHomePageContent", module: Placeholder },
  { name: "ArchivesPageContent", module: ArchivesPageContent },
  { name: "Infographic", module: Infographic },
  { name: "CaseStudyDownloadPrompt", module: CaseStudyDownloadPrompt },
  { name: "LatestCustomerStories", module: LatestCustomerStories },
  { name: "TestimonialList", module: TestimonialList },
  { name: "TextWithForm", module: TextWithForm },
  { name: "BlogPageContent", module: BlogPageContent },
  { name: "EmbedVideo", module: EmbedVideo },
  { name: "ContentList", module: ContentList },
  { name: "EventsPageContent", module: EventsPageContent },
  { name: "AwardsBanner", module: AwardsBanner },
  { name: "TransparentizeNavbar", module: TransparentizeNavbar },
  { name: "HideNavbar", module: HideNavbar },
  { name: "BondFirstFold", module: BondFirstFold },
  { name: "AwardsPageContent", module: AwardsPageContent },
  { name: "LeadershipPageContent", module: LeadershipPageContent },
  { name: "SpeakerList", module: SpeakerList },
  { name: "SearchPageContent", module: SearchPageContent },
  { name: "TitleGroup", module: TitleGroup },
  { name: "Modal", module: Placeholder },
  { name: "TextWithCard", module: TextWithCard },
  { name: "TableWithHeading", module: TableWithHeading },
  { name: "ApplySmoothScrolling", module: Placeholder },
  { name: "HiddenH1", module: HiddenH1 },
  { name: "Breadcrumbs", module: Breadcrumbs },
  { name: "AcknowledgePageContent", module: AcknowledgePageContent },
  { name: "ScriptLoader", module: Placeholder },
  { name: "GlossaryPageContent", module: GlossaryPageContent },
  { name: "Accordion", module: Accordion },
  { name: "BlankCards", module: BlankCards },
  { name: "SecondaryNav", module: SecondaryNav },
  { name: "ShopErrorPageContent", module: ShopErrorPageContent },
  { name: "JobOpeningList", module: JobOpeningList },
  { name: "VideoPopup", module: VideoPopup },
  { name: "DealRegistration", module: Placeholder },
  { name: "BrandFirstFold", module: BrandFirstFold },
  { name: "BrandTextGridWithMedia", module: BrandTextGridWithMedia },
  { name: "BrandTextWithMedia", module: BrandTextWithMedia },
  { name: "BrandTwoTextColumns", module: BrandTwoTextColumns },
  { name: "BrandBlankCards", module: BrandBlankCards },
  { name: "BrandVideoPopup", module: BrandVideoPopup },
];

export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
