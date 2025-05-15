
import type { SVGProps } from 'react';
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Circle as LucideCircle, // Aliased to avoid any potential naming conflicts
  Copy,
  Edit,
  ExternalLink,
  File,
  HelpCircle,
  Home,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  Sun,
  Trash,
  User,
  Workflow,
  BookOpenCheck,
  Lightbulb,
  Scale,
  FileText,
  X,
  ListChecks,
  BookOpenText,
  Library,
  PenTool,
  Landmark,
  Building,
  BookOpen,
} from 'lucide-react';

const EmblemOfIndia = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown,
  circle: LucideCircle, // Use the aliased import
  workflow: Workflow,
  close: X,
  copy: Copy,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  loader: Loader2,
  mail: Mail,
  messageSquare: MessageSquare,
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
  fileText: FileText,
  listChecks: ListChecks,
  bookOpenText: BookOpenText,
  library: Library,
  penTool: PenTool,
  landmark: Landmark,
  building: Building,
  bookOpen: BookOpen,
  emblemOfIndia: EmblemOfIndia,
};

export {Icons};
