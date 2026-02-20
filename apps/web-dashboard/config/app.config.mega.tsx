/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertCircle,
  Award,
  Badge,
  Bell,
  Bitcoin,
  Book,
  Briefcase,
  Building,
  CalendarCheck,
  Captions,
  CheckCircle,
  Code,
  Coffee,
  File as DocumentIcon,
  Euro,
  Eye,
  FileQuestion,
  FileText,
  Flag,
  Ghost,
  Gift,
  Grid,
  Heart,
  HelpCircle,
  Kanban,
  Key,
  Layout,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Monitor,
  Network,
  Users as PeopleIcon,
  Plug,
  Share2,
  ShieldOff,
  SquareMousePointer,
  Star,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  Users,
  Briefcase as WorkIcon,
  Zap,
} from 'lucide-react';
import {
  MEGA_ACCOUNT_SECTION,
  MEGA_AUTHENTICATION_SECTION,
} from '@/config/app.config.shared-sections';
import { MenuConfig } from '@/config/types';
export const MENU_MEGA: MenuConfig = [
  { title: 'Home', path: '/app' },
  {
    title: 'Profiles',
    children: [
      {
        title: 'Profiles',
        children: [
          {
            children: [
              {
                title: 'Default',
                icon: Badge,
                path: '#',
              },
              {
                title: 'Creator',
                icon: Coffee,
                path: '#',
              },
              {
                title: 'Company',
                icon: Building,
                path: '#',
              },
              {
                title: 'NFT',
                icon: Bitcoin,
                path: '#',
              },
              {
                title: 'Blogger',
                icon: MessageSquare,
                path: '#',
              },
              {
                title: 'CRM',
                icon: Monitor,
                path: '#',
              },
              {
                title: 'Gamer',
                icon: Ghost,
                path: '#',
              },
            ],
          },
          {
            children: [
              {
                title: 'Feeds',
                icon: Book,
                path: '#',
              },
              {
                title: 'Plain',
                icon: FileText,
                path: '#',
              },
              {
                title: 'Modal',
                icon: SquareMousePointer,
                path: '#',
              },
              {
                title: 'Freelancer',
                icon: Briefcase,
                path: '#',
                disabled: true,
              },
              { title: 'Developer', icon: Code, path: '#', disabled: true },
              { title: 'Team', icon: Users, path: '#', disabled: true },
              {
                title: 'Events',
                icon: CalendarCheck,
                path: '#',
                disabled: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Other Pages',
        children: [
          {
            children: [
              {
                title: 'Projects - 3 Cols',
                icon: Layout,
                path: '#',
              },
              {
                title: 'Projects - 2 Cols',
                icon: Grid,
                path: '#',
              },
              { title: 'Works', icon: WorkIcon, path: '#' },
              {
                title: 'Teams',
                icon: PeopleIcon,
                path: '#',
              },
              {
                title: 'Network',
                icon: Network,
                path: '#',
              },
              {
                title: 'Activity',
                icon: TrendingUp,
                path: '#',
              },
              {
                title: 'Campaigns - Card',
                icon: LayoutGrid,
                path: '#',
              },
            ],
          },
          {
            children: [
              {
                title: 'Campaigns - List',
                icon: Kanban,
                path: '#',
              },
              { title: 'Empty', icon: FileText, path: '#' },
              {
                title: 'Documents',
                icon: DocumentIcon,
                path: '#',
                disabled: true,
              },
              { title: 'Badges', icon: Award, path: '#', disabled: true },
              { title: 'Awards', icon: Gift, path: '#', disabled: true },
            ],
          },
        ],
      },
    ],
  },
  MEGA_ACCOUNT_SECTION,
  {
    title: 'Network',
    children: [
      {
        title: 'General Pages',
        children: [
          { title: 'Get Started', icon: Flag, path: '#' },
          { title: 'Colleagues', icon: Users, path: '#', disabled: true },
          { title: 'Donators', icon: Heart, path: '#', disabled: true },
          { title: 'Leads', icon: Zap, path: '#', disabled: true },
        ],
      },
      {
        title: 'Other pages',
        children: [
          {
            title: 'User Cards',
            children: [
              { title: 'Mini Cards', path: '#' },
              { title: 'Team Members', path: '#' },
              { title: 'Authors', path: '#' },
              { title: 'NFT Users', path: '#' },
              { title: 'Social Users', path: '#' },
              { title: 'Gamers', path: '#', disabled: true },
            ],
          },
          {
            title: 'User Base',
            badge: 'Datatables',
            children: [
              { title: 'Team Crew', path: '#' },
              { title: 'App Roster', path: '#' },
              {
                title: 'Market Authors',
                path: '#',
              },
              { title: 'SaaS Users', path: '#' },
              {
                title: 'Store Clients',
                path: '#',
              },
              { title: 'Visitors', path: '#' },
            ],
          },
        ],
      },
    ],
  },
  MEGA_AUTHENTICATION_SECTION,
  {
    title: 'Store ',
    children: [
      {
        title: 'Store - Client',
        children: [
          {
            children: [
              { title: 'Home', path: '/app' },
              {
                title: 'Search Results - Grid',
                path: '#',
              },
              {
                title: 'Search Results - List',
                path: '#',
              },
              {
                title: 'Product Details',
                path: '#',
              },
              { title: 'Wishlist', path: '#' },
              { title: 'My Orders', path: '#' },
            ],
          },
          {
            children: [
              {
                title: 'Checkout - Order Summary',
                path: '#',
              },
              {
                title: 'Checkout - Shipping Info',
                path: '#',
              },
              {
                title: 'Checkout - Payment Method',
                path: '#',
              },
              {
                title: 'Checkout - Order Placed',
                path: '#',
              },
              { title: 'Order Receipt', path: '#' },
            ],
          },
        ],
      },
    ],
  },
];
