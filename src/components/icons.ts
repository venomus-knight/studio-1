
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Circle,
  Copy,
  Edit,
  ExternalLink,
  File,
  HelpCircle,
  Home,
  Loader2,
  Mail,
  MessageSquare,
  Moon,
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
import type React from 'react';

// National Emblem of India SVG Component
// Source: Simplified version for illustrative purposes
// Cleaned up path data strings by removing '\<tab>' sequences.
const EmblemOfIndia = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 49.742 67.358"
    fill="currentColor"
    {...props}
  >
    <path d="M31.824,44.356H17.918c-2.088,0-3.781-1.693-3.781-3.781V25.369c0-2.088,1.693-3.781,3.781-3.781h13.905c2.088,0,3.781,1.693,3.781,3.781v15.206C35.605,42.663,33.912,44.356,31.824,44.356z M17.918,23.588c-0.984,0-1.781,0.797-1.781,1.781v15.206c0,0.984,0.797,1.781,1.781,1.781h13.905c0.984,0,1.781-0.797,1.781-1.781V25.369c0-0.984-0.797-1.781-1.781-1.781H17.918z"/>
    <path d="M24.871,33.061c-2.769,0-5.016-2.247-5.016-5.016c0-2.769,2.247-5.016,5.016-5.016s5.016,2.247,5.016,5.016C29.887,30.814,27.639,33.061,24.871,33.061z M24.871,25.029c-1.662,0-3.016,1.354-3.016,3.016s1.354,3.016,3.016,3.016s3.016-1.354,3.016-3.016S26.533,25.029,24.871,25.029z"/>
    <path d="M24.871,48.879c-6.019,0-10.909-4.891-10.909-10.909h2.001c0,4.909,3.999,8.909,8.908,8.909s8.909-3.999,8.909-8.909h2C35.78,43.988,30.889,48.879,24.871,48.879z"/>
    <path d="M24.871,67.358c-0.239,0-0.477-0.088-0.666-0.262l-9.432-8.729c-0.42-0.388-0.465-1.022-0.076-1.442c0.388-0.42,1.022-0.465,1.442-0.076l8.732,8.082l8.732-8.082c0.42-0.389,1.054-0.344,1.442,0.076c0.389,0.42,0.344,1.054-0.076,1.442l-9.432,8.729C25.348,67.27,25.11,67.358,24.871,67.358z"/>
    <path d="M12.502,53.305H7.047c-0.552,0-1-0.448-1-1s0.448-1,1-1h5.455c0.552,0,1,0.448,1,1S13.054,53.305,12.502,53.305z"/>
    <path d="M42.695,53.305h-5.455c-0.552,0-1-0.448-1-1s0.448-1,1-1h5.455c0.552,0,1,0.448,1,1S43.247,53.305,42.695,53.305z"/>
    <path d="M24.871,18.268c-5.28,0-9.573-4.293-9.573-9.573S19.591-0.878,24.871-0.878s9.573,4.293,9.573,9.573S30.151,18.268,24.871,18.268z M24.871,1.122c-4.174,0-7.573,3.399-7.573,7.573s3.399,7.573,7.573,7.573s7.573-3.399,7.573-7.573S29.045,1.122,24.871,1.122z"/>
    <path d="M4.434,47.454H0.281c-0.552,0-1-0.448-1-1s0.448-1,1-1h4.152c0.552,0,1,0.448,1,1S4.986,47.454,4.434,47.454z"/>
    <path d="M49.461,47.454h-4.152c-0.552,0-1-0.448-1-1s0.448-1,1-1h4.152c0.552,0,1,0.448,1,1S50.014,47.454,49.461,47.454z"/>
    <path d="M14.716,35.392c-0.219,0-0.439-0.07-0.619-0.21c-0.401-0.311-0.496-0.889-0.185-1.29l5.032-6.513c0.31-0.401,0.888-0.496,1.29-0.185c0.401,0.311,0.496,0.889,0.185,1.29l-5.032,6.513C15.231,35.316,14.974,35.392,14.716,35.392z"/>
    <path d="M35.025,35.392c-0.258,0-0.515-0.076-0.729-0.236l-5.032-6.513c-0.311-0.401-0.216-0.979,0.185-1.29c0.401-0.311,0.979-0.216,1.29,0.185l5.032,6.513c0.311,0.401,0.216,0.979-0.185,1.29C35.464,35.321,35.244,35.392,35.025,35.392z"/>
  </svg>
);


const Icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown,
  circle: Circle,
  workflow: Workflow,
  close: X,
  copy: Copy,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  light: Sun,
  loader: Loader2,
  mail: Mail,
  messageSquare: MessageSquare,
  // moon: Moon, // Moon icon was removed as XMark was preferred for close
  plus: Plus,
  plusCircle: PlusCircle,
  search: Search,
  server: Server,
  settings: Settings,
  share: Share2,
  shield: Shield,
  spinner: Loader2,
  trash: Trash,
  user: User,
  // Additional icons used in the project
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
    
