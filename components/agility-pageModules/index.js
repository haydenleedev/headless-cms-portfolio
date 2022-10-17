// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.
import dynamic from "next/dynamic";

import FirstFold from "./firstFold/firstFold";
import LogosList from "./logosList/logosList";
const Placeholder = dynamic(() => import("./placeholder"), { ssr: false });
import RichTextArea from "./richTextArea/richTextArea";
import TextGridWithMedia from "./textGridWithMedia/textGridWithMedia";
import TextWithMedia from "./textWithMedia/textWithMedia";
const ClientTestimonial = dynamic(() =>
  import("./clientTestimonial/clientTestimonial")
);
const Spacer = dynamic(() => import("./spacer/spacer"), { ssr: false });
import ResourceList from "./resourceList/resourceList";
import HeroImage from "./heroImage/heroImage";
import CallToAction from "./callToAction/callToAction";
const NewsList = dynamic(() => import("./newsList/newsList"), { ssr: false });
const PressReleaseList = dynamic(
  () => import("./pressReleaseList/pressReleaseList"),
  { ssr: false }
);
const BlogPostList = dynamic(() => import("./blogPostList/blogPostList"), {
  ssr: false,
});
const Infographic = dynamic(() => import("./infographic/infographic"), {
  ssr: false,
});
const CaseStudyDownloadPrompt = dynamic(
  () => import("./caseStudyDownloadPrompt/caseStudyDownloadPrompt"),
  { ssr: false }
);
import LatestCustomerStories from "./latestCustomerStories/latestCustomerStories";
const TestimonialList = dynamic(
  () => import("./testimonialList/testimonialList"),
  { ssr: false }
);
import TextWithForm from "./textWithForm/textWithForm";
import EmbedVideo from "./embedVideo/embedVideo";
const ContentList = dynamic(() => import("./contentList/contentList"), {
  ssr: false,
});
import AwardsBanner from "./awardsBanner/awardsBanner";
import TransparentizeNavbar from "./transparentizeNavbar/transparentizeNavbar";
const BondFirstFold = dynamic(() => import("./bondFirstFold/bondFirstFold"), {
  ssr: false,
});
import HideNavbar from "./hideNavbar/hideNavbar";
const SpeakerList = dynamic(() => import("./speakerList/speakerList"), {
  ssr: false,
});
import OverrideSEO from "./overrideSEO/overrideSEO";
const TitleGroup = dynamic(() => import("./titleGroup/titleGroup"), {
  ssr: false,
});
import TextWithCard from "./textWithCard/textWithCard";
const TableWithHeading = dynamic(
  () => import("./tableWithHeading/tableWithHeading"),
  { ssr: false }
);
const HiddenH1 = dynamic(() => import("./hiddenH1/hiddenH1"), { ssr: false });
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Accordion from "./accordion/accordion";
import BlankCards from "./blankCards/blankCards";
const SecondaryNav = dynamic(() => import("./secondaryNav/secondaryNav"), {
  ssr: false,
});
import TwoTextColumns from "./twoTextColumns/twoTextColumns";
import LoadGoogleOptimize from "./loadGoogleOptimize/loadGoogleOptimize";

// Template renderers
import BlogPostContent from "./blogPostContent/blogPostContent";
import ResourceContent from "./resourceContent/resourceContent";
import ResourceDownload from "./resourceDownload/resourceDownload";
import PressReleaseContent from "./pressReleaseContent/pressReleaseContent";
const ArchivesPageContent = dynamic(
  () => import("./archivesPageContent/archivesPageContent"),
  { ssr: false }
);
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
import DealRegistration from "./dealRegistration/dealRegistration";
import ChannelRequest from "./channelRequest/channelRequest";
import BrandFirstFold from "../../brand/components/brandFirstFold/brandFirstFold";
import BrandTextWithMedia from "../../brand/components/brandTextWithMedia/brandTextWithMedia";
import BrandTwoTextColumns from "../../brand/components/brandTwoTextColumns/brandTwoTextColumns";
import BrandBlankCards from "../../brand/components/brandBlankCards/brandBlankCards";
import BrandVideoPopup from "../../brand/components/brandVideoPopup/brandVideoPopup";
import BrandTextGridWithMedia from "../../brand/components/brandTextGridWithMedia/brandTextGridWithMedia";
import TextWithInfographic from "./textWithInfographic/textWithInfographic";
import BlogSubscriptionBanner from "./BlogSubscriptionBanner/blogSubscriptionBanner";
import CaseStudyData from "./caseStudyData/caseStudyData";
import CustomerStoryCards from "./customerStoryCards/customerStoryCards";

const allModules = [
  { name: "FirstFold", module: FirstFold },
  { name: "Placeholder", module: Placeholder },
  { name: "LogosList", module: LogosList },
  { name: "RichTextArea", module: RichTextArea },
  { name: "BlogPostContent", module: BlogPostContent },
  { name: "ResourceContent", module: ResourceContent },
  { name: "ResourceDownload", module: ResourceDownload },
  { name: "PressReleaseContent", module: PressReleaseContent },
  { name: "OverrideSEO", module: OverrideSEO },
  { name: "TextWithMedia", module: TextWithMedia },
  { name: "TextWithInfographic", module: TextWithInfographic },
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
  { name: "DealRegistration", module: DealRegistration },
  { name: "ChannelRequest", module: ChannelRequest },
  { name: "BlogSubscriptionBanner", module: BlogSubscriptionBanner },
  { name: "CaseStudyData", module: CaseStudyData },
  { name: "CustomerStoryCards", module: CustomerStoryCards },
  { name: "BrandFirstFold", module: BrandFirstFold },
  { name: "BrandTextGridWithMedia", module: BrandTextGridWithMedia },
  { name: "BrandTextWithMedia", module: BrandTextWithMedia },
  { name: "BrandTwoTextColumns", module: BrandTwoTextColumns },
  { name: "BrandBlankCards", module: BrandBlankCards },
  { name: "BrandVideoPopup", module: BrandVideoPopup },
  { name: "LoadGoogleOptimizeScript", module: LoadGoogleOptimize },
];

export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
