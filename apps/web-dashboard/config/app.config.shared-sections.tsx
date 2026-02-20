import {
  AlertCircle,
  Bell,
  CheckCircle,
  Euro,
  Eye,
  HelpCircle,
  Key,
  LifeBuoy,
  Plug,
  ShieldOff,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';
import { MenuConfig } from '@/config/types';

export const MEGA_ACCOUNT_SECTION: MenuConfig[number] = {
  title: 'My Account',
  children: [
    {
      title: 'General Pages',
      children: [
        { title: 'Integrations', icon: Plug, path: '#' },
        { title: 'Notifications', icon: Bell, path: '#' },
        { title: 'API Keys', icon: Key, path: '#' },
        { title: 'Appearance', icon: Eye, path: '#' },
        { title: 'Invite a Friend', icon: UserCheck, path: '#' },
        { title: 'Activity', icon: LifeBuoy, path: '#' },
        { title: 'Brand', icon: CheckCircle, disabled: true },
        { title: 'Get Paid', icon: Euro, disabled: true },
      ],
    },
    {
      title: 'Other pages',
      children: [
        {
          title: 'Account Home',
          children: [
            { title: 'Get Started', path: '#' },
            { title: 'User Profile', path: '#' },
            { title: 'Company Profile', path: '#' },
            { title: 'With Sidebar', path: '#' },
            { title: 'Enterprise', path: '#' },
            { title: 'Plain', path: '#' },
            { title: 'Modal', path: '#' },
          ],
        },
        {
          title: 'Billing',
          children: [
            { title: 'Basic Billing', path: '#' },
            { title: 'Enterprise', path: '#' },
            { title: 'Plans', path: '#' },
            { title: 'Billing History', path: '#' },
            { title: 'Tax Info', disabled: true },
            { title: 'Invoices', disabled: true },
            { title: 'Gateaways', disabled: true },
          ],
        },
        {
          title: 'Security',
          children: [
            { title: 'Get Started', path: '#' },
            { title: 'Security Overview', path: '#' },
            { title: 'IP Addresses', path: '#' },
            { title: 'Privacy Settings', path: '#' },
            { title: 'Device Management', path: '#' },
            { title: 'Backup & Recovery', path: '#' },
            { title: 'Current Sessions', path: '#' },
            { title: 'Security Log', path: '#' },
          ],
        },
        {
          title: 'Members & Roles',
          children: [
            { title: 'Teams Starter', path: '#' },
            { title: 'Teams', path: '#' },
            { title: 'Team Info', path: '#' },
            { title: 'Members Starter', path: '#' },
            { title: 'Team Members', path: '#' },
            { title: 'Import Members', path: '#' },
            { title: 'Roles', path: '#' },
            { title: 'Permissions - Toggler', path: '#' },
            { title: 'Permissions - Check', path: '#' },
          ],
        },
        {
          title: 'Other Pages',
          children: [
            { title: 'Integrations', path: '#' },
            { title: 'Notifications', path: '#' },
            { title: 'API Keys', path: '#' },
            { title: 'Appearance', path: '#' },
            { title: 'Invite a Friend', path: '#' },
            { title: 'Activity', path: '#' },
          ],
        },
      ],
    },
  ],
};

export const MEGA_AUTHENTICATION_SECTION: MenuConfig[number] = {
  title: 'Authentication',
  children: [
    {
      title: 'General pages',
      children: [
        {
          title: 'Classic Layout',
          children: [
            { title: 'Sign In', path: '#' },
            { title: 'Sign Up', path: '#' },
            { title: '2FA', path: '#' },
            { title: 'Check Email', path: '#' },
            {
              title: 'Reset Password',
              children: [
                { title: 'Enter Email', path: '#' },
                { title: 'Check Email', path: '#' },
                { title: 'Password is Changed', path: '#' },
              ],
            },
          ],
        },
        {
          title: 'Branded Layout',
          children: [
            { title: 'Sign In', path: '#' },
            { title: 'Sign Up', path: '#' },
            { title: '2FA', path: '#' },
            { title: 'Check Email', path: '#' },
            {
              title: 'Reset Password',
              children: [
                { title: 'Enter Email', path: '#' },
                { title: 'Check Email', path: '#' },
                { title: 'Password is Changed', path: '#' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Other Pages',
      children: [
        { title: 'Welcome Message', icon: ThumbsUp, path: '#' },
        { title: 'Account Deactivated', icon: ShieldOff, path: '#' },
        { title: 'Error 404', icon: HelpCircle, path: '#' },
        { title: 'Error 500', icon: AlertCircle, path: '#' },
      ],
    },
  ],
};
