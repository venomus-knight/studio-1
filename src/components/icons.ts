
import type { SVGProps } from 'react';
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
  // PenTool, // Removed from lucide-react
} from 'lucide-react';

// A very simplified placeholder for EmblemOfIndia to avoid parsing issues
const EmblemOfIndia = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    {...props}
  >
    <rect width="100" height="100" />
  </svg>
);

// Custom Pen SVG Component
const CustomPenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24" // Adjust viewBox if your SVG has a different one
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Replace this with your actual SVG path data */}
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
  scale: Scale, // For "Applicable Laws" card title
  fileTextIcon: FileText, // For "Similar Precedents" card title - renamed to avoid conflict
  listChecks: ListChecks, // For "Procedural Checklist" card title
  bookOpenText: BookOpenText, // For "Simplify Document" card title
  library: Library, // For "My Custom Case Library" card title
  landmark: Landmark,
  building: Building,
  penTool: CustomPenIcon, // Updated to use the custom SVG component
  emblemOfIndia: EmblemOfIndia,
};

export { Icons };
