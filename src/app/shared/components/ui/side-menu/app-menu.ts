export const appMenu: AppMenuItem[] = [
  {
    path: '/main/committee/list',
    title: 'MAIN.TITLE.COMMITTEES',
    icon: 'person',
    role: ['admin', 'super-admin'],
  },
  {
    path: '/main/meeting/my-list',
    title: 'MAIN.TITLE.MY_MEETINGS_LIST',
    icon: 'groups',
    role: ['admin', 'super-admin'],
  },
  // {
  //   path: '/external/meeting-polls',
  //   title: 'MAIN.TITLE.MEETING_POLLS',
  //   icon: 'polls',
  //   role: ['admin', 'super-admin'],
  // },
];

type AppMenuItem = {
  path?: string;
  title: string;
  icon?: string; // Using material icons
  children?: AppMenuItem[];
  role: ('admin' | 'super-admin')[];
};
