import { ReactNode } from "react";

export type EventItem = {
  id: string;
  title: string;
  locatie: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
};

export type AppContextType = {
  setToken: (token: string | null) => void;
  token: string | null;
  events: EventItem[];
  getProfile: () => Promise<any>;
  profile: any | null;
  refresh: () => void;
  setForceRefresh: (value: boolean) => void;
  forceRefresh: boolean;
};
export interface AppProviderProps {
  children: ReactNode;
}
