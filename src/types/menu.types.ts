export interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  subMenus?: { label: string; href: string }[];
}