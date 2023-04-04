// All of the Agility Page Module Components that are in use in this site need to be imported into this index file.
// Place Page Modules in allModules array below, passing in a name and the component.
import dynamic from "next/dynamic";

// lazy-loaded modules
const Placeholder = dynamic(() => import("./placeholder"));
const ClientTestimonial = dynamic(() =>
  import("./clientTestimonial/clientTestimonial")
);
const Spacer = dynamic(() => import("./spacer/spacer"));
const NewsList = dynamic(() => import("./newsList/newsList"));
const PressReleaseList = dynamic(() =>
  import("./pressReleaseList/pressReleaseList")
);
const BlogPostList = dynamic(() => import("./blogPostList/blogPostList"));
/* const Infographic = dynamic(() => import("./infographic/infographic")); */
const CaseStudyDownloadPrompt = dynamic(() =>
  import("./caseStudyDownloadPrompt/caseStudyDownloadPrompt")
);
const TestimonialList = dynamic(() =>
  import("./testimonialList/testimonialList")
);
const ContentList = dynamic(() => import("./contentList/contentList"));
const BondFirstFold = dynamic(() => import("./bondFirstFold/bondFirstFold"));
const SpeakerList = dynamic(() => import("./speakerList/speakerList"));
const TitleGroup = dynamic(() => import("./titleGroup/titleGroup"));
const TableWithHeading = dynamic(() =>
  import("./tableWithHeading/tableWithHeading")
);
const HiddenH1 = dynamic(() => import("./hiddenH1/hiddenH1"));
const SecondaryNav = dynamic(() => import("./secondaryNav/secondaryNav"));

const AcknowledgePageContent = dynamic(() =>
  import("./acknowledgePageContent/acknowledgePageContent")
);

const FlexColumnTableWithHeading = dynamic(() =>
  import("./flexColumnTableWithHeading/flexColumnTableWithHeading")
);

const BrandFirstFold = dynamic(() =>
  import("../../brand/components/brandFirstFold/brandFirstFold")
);
const BrandTextWithMedia = dynamic(() =>
  import("../../brand/components/brandTextWithMedia/brandTextWithMedia")
);
const BrandTwoTextColumns = dynamic(() =>
  import("../../brand/components/brandTwoTextColumns/brandTwoTextColumns")
);
const BrandBlankCards = dynamic(() =>
  import("../../brand/components/brandBlankCards/brandBlankCards")
);
const BrandVideoPopup = dynamic(() =>
  import("../../brand/components/brandVideoPopup/brandVideoPopup")
);
const BrandTextGridWithMedia = dynamic(() =>
  import("../../brand/components/brandTextGridWithMedia/brandTextGridWithMedia")
);

// eagerly loaded modules
import FirstFold from "./firstFold/firstFold";
import ArchivesPageContent from "./archivesPageContent/archivesPageContent";
import Infographic from "./infographic/infographic";
import CustomerStoryCards from "./customerStoryCards/customerStoryCards";
import LoadGoogleOptimize from "./loadGoogleOptimize/loadGoogleOptimize";
import LogosList from "./logosList/logosList";
import RichTextArea from "./richTextArea/richTextArea";
import TextGridWithMedia from "./textGridWithMedia/textGridWithMedia";
import TextWithMedia from "./textWithMedia/textWithMedia";
import JobOpeningList from "./jobOpeningList/jobOpeningList";
import ResourceList from "./resourceList/resourceList";
import HeroImage from "./heroImage/heroImage";
import CallToAction from "./callToAction/callToAction";
import LatestCustomerStories from "./latestCustomerStories/latestCustomerStories";
import TextWithForm from "./textWithForm/textWithForm";
import EmbedVideo from "./embedVideo/embedVideo";
import AwardsBanner from "./awardsBanner/awardsBanner";
import TransparentizeNavbar from "./transparentizeNavbar/transparentizeNavbar";
import HideNavbar from "./hideNavbar/hideNavbar";
import OverrideSEO from "./overrideSEO/overrideSEO";
import TextWithCard from "./textWithCard/textWithCard";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Accordion from "./accordion/accordion";
import BlankCards from "./blankCards/blankCards";
import TwoTextColumns from "./twoTextColumns/twoTextColumns";
import BlogPostContent from "./blogPostContent/blogPostContent";
import ResourceContent from "./resourceContent/resourceContent";
import ResourceDownload from "./resourceDownload/resourceDownload";
import PressReleaseContent from "./pressReleaseContent/pressReleaseContent";
import BlogPageContent from "./blogPageContent/blogPageContent";
import EventsPageContent from "./eventsPageContent/eventsPageContent";
import AwardsPageContent from "./awardsPageContent/awardsPageContent";
import LeadershipPageContent from "./leadershipPageContent/leadershipPageContent";
import SearchPageContent from "./searchPageContent/searchPageContent";
import GlossaryPageContent from "./glossaryPageContent/glossaryPageContent";
import ShopErrorPageContent from "./shopErrorPageContent/shopErrorPageContent";
import VideoPopup from "./videoPopup/videoPopup";
import DealRegistration from "./dealRegistration/dealRegistration";
import ChannelRequest from "./channelRequest/channelRequest";
import TextWithInfographic from "./textWithInfographic/textWithInfographic";
import BlogSubscriptionBanner from "./BlogSubscriptionBanner/blogSubscriptionBanner";
import CaseStudyData from "./caseStudyData/caseStudyData";

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
  { name: "FlexColumnTableWithHeading", module: FlexColumnTableWithHeading },
];

export const getModule = (moduleName) => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
