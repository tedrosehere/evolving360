// Utility
export { cn } from "./utils";

// Hooks
export { useIsMobile } from "./hooks/use-mobile";

// Components
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/ui/alert-dialog";
export { AnimatedTabContent, AnimatedTabs } from "./components/ui/animated-tabs";
export { type Tab, useTabs } from "./components/ui/animatedTabs/useTabs";
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export {
  ScrollArea as BaseScrollArea,
  ScrollBar as BaseScrollBar,
} from "./components/ui/base-scroll-area";
export { Button, buttonVariants } from "./components/ui/button";
export { Chip, chipVariants, type ChipProps } from "./components/ui/chip";
export {
  KeyValueList,
  KeyValue,
  type KeyValueProps,
} from "./components/ui/key-value";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";
export {
  EmptyStateMinor,
  EmptyStateMinorIcon,
  EmptyStateMinorTitle,
  EmptyStateMinorDescription,
  EmptyStateMinorActions,
  EmptyStateMajor,
  EmptyStateMajorIcon,
  EmptyStateMajorEyebrow,
  EmptyStateMajorTitle,
  EmptyStateMajorDescription,
  EmptyStateMajorActions,
  EmptyStateMajorHint,
} from "./components/ui/empty-state";
export {
  SignInScreen,
  SignInScreenBrand,
  SignInScreenHeader,
  SignInScreenAction,
  SignInScreenDivider,
  SignInScreenFooterText,
  SignInScreenTerms,
} from "./components/ui/sign-in-screen";
export {
  Stat,
  StatLabel,
  StatValue,
  StatDelta,
  StatSub,
  statDeltaVariants,
} from "./components/ui/stat";
export {
  List,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
} from "./components/ui/list";
export { Calendar, type CalendarProps } from "./components/ui/calendar";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
} from "./components/ui/card";
export {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from "./components/ui/chart";
export { Checkbox } from "./components/ui/checkbox";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/ui/collapsible";
export {
  Combobox,
  type ComboboxOption,
} from "./components/ui/combobox";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/ui/command";
export { DatePicker } from "./components/ui/date-picker";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./components/ui/drawer";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./components/ui/form";
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { default as NumberField } from "./components/ui/number-field";
export { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover";
export { Progress } from "./components/ui/progress";
export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export { Separator } from "./components/ui/separator";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";
export { Skeleton } from "./components/ui/skeleton";
export { Switch } from "./components/ui/switch";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export { Textarea } from "./components/ui/textarea";
export {
  AutoGrowTextarea,
  type AutoGrowTextareaProps,
} from "./components/ui/auto-grow-textarea";

// Agentic — agent UI primitives that wrap shadcn / evolution-ui base
// components (Avatar, Collapsible, Progress, Button, etc.) with the
// chat / tool-use / reasoning recipes used by the Evolution agent UI.
export { Message, type MessageProps, type MessageRole } from "./components/ui/message";
export {
  ToolCall,
  type ToolCallProps,
  type ToolCallStatus,
} from "./components/ui/tool-call";
export { Reasoning, type ReasoningProps } from "./components/ui/reasoning";
export {
  ProgressCard,
  type ProgressCardProps,
} from "./components/ui/progress-card";
export {
  PreviewCard,
  type PreviewCardProps,
} from "./components/ui/preview-card";
export { Cite, type CiteProps } from "./components/ui/cite";
export { CodeBlock, type CodeBlockProps } from "./components/ui/code-block";
export {
  SlashMenu,
  type SlashMenuProps,
  type SlashItem,
} from "./components/ui/slash-menu";
export { Prompt, type PromptProps } from "./components/ui/prompt";
export {
  PromptCard,
  PromptCardLabel,
  PromptCardBody,
  PromptCardActions,
  PromptCardHelper,
} from "./components/ui/prompt-card";
export {
  TodoList,
  type TodoListProps,
  type TodoItem,
} from "./components/ui/todo-list";
export {
  Compose,
  type ComposeProps,
  type ComposeAttachment,
  type ComposeTool,
} from "./components/ui/compose";
export {
  ChatSession,
  type ChatSessionProps,
  type ChatSessionState,
} from "./components/ui/chat-session";
export { MessageStream } from "./components/ui/message-stream";
export { MessageThread } from "./components/ui/message-thread";
export { UserBubble, type UserBubbleProps } from "./components/ui/user-bubble";
export { UserTurn, type UserTurnProps } from "./components/ui/user-turn";
export {
  MD,
  TypewriterMD,
  TypewriterGate,
  type TypewriterMDProps,
  type TypewriterGateProps,
} from "./components/ui/typewriter";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/ui/tooltip";
export {
  type ToastProps,
  ToastProvider,
  useToast,
  toast,
  Toaster,
} from "./components/ui/use-toast";

export { TruncatedText, type TruncatedTextProps } from "./components/ui/truncated-text";
export {
  ResponsiveSheet,
  type ResponsiveSheetProps,
} from "./components/ui/responsive-sheet";
