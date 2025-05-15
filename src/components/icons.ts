import type { SVGProps } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronsUpDown,
  Circle as LucideCircle, // Aliased
  Copy,
  Edit,
  ExternalLink,
  File, // Standard File icon
  FileText as LucideFileText, // Aliased
  HelpCircle,
  Home,
  Library as LucideLibrary, // Aliased
  Lightbulb,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Scale as LucideScale, // Aliased
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  Sun,
  Trash,
  User,
  Workflow,
  X as XIcon, // lucide-react exports 'X', aliasing to XIcon
  BookOpenText as LucideBookOpenText, // Aliased
} from 'lucide-react';

// Extremely simplified EmblemOfIndia to bypass parsing errors.
// It uses a minimal valid SVG structure.
const EmblemOfIndia = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 49.742 67.358"
    fill="currentColor"
    {...props}
  >
    <path d="M10 10 H 39 V 57 H 10 Z" />
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
  precedentRetrieval: LucideScale,
  documentSummarizer: LucideFileText,
  bookOpenCheck: BookOpenCheck,
  scale: LucideScale, // For "Applicable Laws" card title
  fileText: LucideFileText, // For "Similar Precedents" card title
  listChecks: ListChecks, // For "Procedural Checklist" card title
  bookOpenText: LucideBookOpenText, // For "Simplify Document" card title
  library: LucideLibrary, // For "My Custom Case Library" card title
  emblemOfIndia: EmblemOfIndia,
};

export { Icons };
