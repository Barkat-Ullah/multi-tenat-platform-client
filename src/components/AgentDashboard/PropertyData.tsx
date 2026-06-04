import { MenuProps } from "antd";
import {

  CheckCircleOutlined,
  StarOutlined,
  FileTextOutlined,
  InboxOutlined,
  ShoppingOutlined,
  
} from "@ant-design/icons";
export interface AgentPropertyData {
  id: string;
  name: string;
  status: string;
  statusLabel: string;
  visitors: string;
  favorites: string;
  shares: string;
  alert: string;
  city: string;
  region: string;
  area: number;
  price: number;
  capRate: number;
  annualIncome: number;
  visibility: number;
  match: number;
  position: string;
  lastModified: string;
  contacts: number;
  isFavorite: boolean;
  image: string;
}

export const AgenmockPropertyData: AgentPropertyData[] = [
  {
    id: "HRH1258388",
    name: "Find Your Perfect Home Today",
    status: "active",
    statusLabel: "Promoted",
    visitors: "2M-Total",
    favorites: "2M-Total",
    shares: "2M-Total",
    city: "Bastia Umbra",
    region: "Province of Perugia, Italy",
    area: 5485,
    price: 5100000,
    capRate: 3,
    alert: "2M-Total",
    annualIncome: 550000,
    visibility: 60,
    match: 13,
    position: "1",
    lastModified: "12/11/2025",
    contacts: 10,
    isFavorite: true,
    image: "/images/table1.png",
  },
  {
    id: "HRH1258389",
    name: "Find Your Perfect Home Today",
    status: "active",
    statusLabel: "Promoted",
    visitors: "2M-Total",
    favorites: "2M-Total",
    shares: "2M-Total",
    city: "Bastia Umbra",
    region: "Province of Perugia, Italy",
    area: 5485,
    alert: "2M-Total",
    price: 5100000,
    capRate: 3,
    annualIncome: 550000,
    visibility: 60,
    match: 13,
    position: "2",
    lastModified: "12/11/2025",
    contacts: 10,
    isFavorite: true,
    image: "/images/table1.png",
  },
  {
    id: "HRH1258390",
    name: "Find Your Perfect Home Today",
    status: "active",
    statusLabel: "Promoted",
    visitors: "2M-Total",
    favorites: "2M-Total",
    shares: "2M-Total",
    alert: "2M-Total",
    city: "Bastia Umbra",
    region: "Province of Perugia, Italy",
    area: 5485,
    price: 5100000,
    capRate: 3,
    annualIncome: 550000,
    visibility: 60,
    match: 13,
    position: "3",
    lastModified: "12/11/2025",
    contacts: 10,
    isFavorite: true,
    image: "/images/table1.png",
  },
  {
    id: "HRH1258391",
    name: "Find Your Perfect Home Today",
    status: "active",
    statusLabel: "Promoted",
    visitors: "2M-Total",
    favorites: "2M-Total",
    shares: "2M-Total",
    alert: "2M-Total",
    city: "Bastia Umbra",
    region: "Province of Perugia, Italy",
    area: 5485,
    price: 5100000,
    capRate: 3,
    annualIncome: 550000,
    visibility: 60,
    match: 13,
    position: "4",
    lastModified: "12/11/2025",
    contacts: 10,
    isFavorite: true,
    image: "/images/table1.png",
  },
];


 export const filterMenu: MenuProps["items"] = [
    {
      key: "active",
      label: "Active",
      icon: <CheckCircleOutlined />,
    },
    {
      key: "favorites",
      label: "Favorites",
      icon: <StarOutlined />,
    },
    {
      key: "drafts",
      label: "Drafts",
      icon: <FileTextOutlined />,
    },
    {
      key: "archived",
      label: "Archived",
      icon: <InboxOutlined />,
    },
    {
      key: "sold",
      label: "Sold and Rented",
      icon: <ShoppingOutlined />,
    },
  ];


  
  