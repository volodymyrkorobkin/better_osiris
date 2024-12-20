import React, { createContext, useContext, useState, useEffect } from "react";
import BetterOsirisChache from "../lib/BetterOsirisCache";
import { EventItem, AppContextType, AppProviderProps } from "../lib/types";
import BetterOsirisCache from "../lib/BetterOsirisCache";
import { useNavigation } from "@react-navigation/native";

const AppContext = createContext<AppContextType | null>(null);
export const AppProvider = ({ children }: AppProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [profile, setProfile] = useState<any | null>(null);

  const [forceRefresh, setForceRefresh] = useState<boolean>(true);

  const navigation = useNavigation<any>();

  function refresh() {
    if (forceRefresh === true) {
      //Refresh events and set them in
      console.log("Refreshing ALL");

      BetterOsirisChache.refreshEvents().then(() => {
        BetterOsirisChache.getEvents().then((events) => {
          setEvents(events);
        });
      });

      BetterOsirisCache.refreshProfileData().then(() => {
        BetterOsirisCache.getProfileData().then((profile) => {
          setProfile(profile);
        });
      });
    } else {
      console.log("Refreshing only visible");
      BetterOsirisChache.getEvents().then((events) => {
        setEvents(events);
      });
      BetterOsirisCache.getProfileData().then((profile) => {
        setProfile(profile);
      });
    }
  }

  //Initial load
  useEffect(() => {
    //Load events and token from cache
    BetterOsirisChache.getEvents().then((events) => {
      setEvents(events);
    });

    //Refresh profile and set it in
    BetterOsirisCache.getProfileData().then((profile) => {
      setProfile(profile);
    });

    BetterOsirisChache.getToken().then((token) => {
      setToken(token);
    });

    refresh();

    BetterOsirisCache.requestNotificationPermissions();
    BetterOsirisCache.setupBackgroundFetch();
  }, [token]);

  const setTokenValue = (token: string | null) => {
    setToken(token);
    BetterOsirisChache.setToken(token);
  };

  const getProfile = async () => {
    const profile = await BetterOsirisCache.getProfileData();
    BetterOsirisCache.refreshProfileData();
    return profile;
  };

  return (
    <AppContext.Provider
      value={{ setToken: setTokenValue, token: token, events, getProfile, profile, refresh, setForceRefresh, forceRefresh }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
