
import type { SVGProps } from 'react';
import Image from 'next/image'; // Import next/image
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronsUpDown,
  Circle as LucideCircle, // Aliased to avoid potential conflicts
  Copy,
  Edit,
  ExternalLink,
  File,
  FileText,
  HelpCircle,
  Home,
  Library,
  Lightbulb,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Scale,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  Sun,
  Trash,
  User,
  Workflow,
  X as XIcon,
  BookOpenText,
  Landmark,
  Building,
} from 'lucide-react';

// Props for the Next/Image based icon component
interface NextImageIconProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  // You can add other next/image compatible props here if needed
}

// Component to render the external SVG using next/image
const EmblemOfIndiaIcon = (props: NextImageIconProps) => {
  const { width = 24, height = 24, className, alt = "Emblem of India" } = props;
  return (
    <Image
      src="public/images/Emblem-of-India-01.svg" // Path from the public directory
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

// Custom Pen SVG Component (remains an inline SVG)
const CustomPenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    <path d="m15 5 4 4" />
  </svg>
);


const Icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown,
  circle: LucideCircle,
  workflow: Workflow,
  close: XIcon,
  copy: Copy,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  loader: Loader2,
  mail: Mail,
  messageSquare: MessageSquare,
  moon: Moon,
  plus: Plus,
  plusCircle: PlusCircle,
  search: Search,
  server: Server,
  settings: Settings,
  share: Share2,
  shield: Shield,
  sun: Sun,
  trash: Trash,
  user: User,
  clientAdvice: Lightbulb,
  precedentRetrieval: Scale,
  documentSummarizer: FileText,
  bookOpenCheck: BookOpenCheck,
  scale: Scale, 
  fileTextIcon: FileText, 
  listChecks: ListChecks, 
  bookOpenText: BookOpenText, 
  library: Library, 
  landmark: Landmark,
  building: Building,
  penTool: CustomPenIcon, 
  emblemOfIndia: EmblemOfIndiaIcon, // Updated to use the new component
};

export { Icons };
