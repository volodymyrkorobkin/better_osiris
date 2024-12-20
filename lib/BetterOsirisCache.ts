import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventItem } from "./types";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

import { useNavigation } from "@react-navigation/native";

const BACKGROUND_FETCH_TASK = "BETTER_OSIRIS_BACKGROUND_FETCH";

function formatDateAndTime(dateStr: string, timeStr: string, offset = 0) {
  let date = new Date(dateStr);
  let [hours, minutes] = timeStr.split(":");
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10) - offset, 0, 0);
  return date.toISOString();
}

export default class BetterOsirisCache {
  public static async getEvents(): Promise<EventItem[]> {
    const eventsStr = await AsyncStorage.getItem("events");
    if (eventsStr) {
      return JSON.parse(eventsStr);
    }
    return [];
  }

  public static async setEvents(events: EventItem[]) {
    await AsyncStorage.setItem("events", JSON.stringify(events));
  }

  public static async setProfile(profile: any) {
    await AsyncStorage.setItem("profile", JSON.stringify(profile));
  }

  public static async refreshEvents() {
    console.log("Refreshing events...");
    const token = await this.getToken();
    if (!token) {
      console.log("No token found");
      return;
    }
    const events = await this.fetchEvents(token);

    const flatEvents = this.flattenEvents(events);
    const storedEvents = await this.getEvents();

    if (JSON.stringify(flatEvents) === JSON.stringify(storedEvents)) {
      return false; // No new events
    } else {
      // New events
      await this.setEvents(flatEvents);
      return true;
    }
  }

  private static async fetchEvents(token: string) {
    try {
      const response = await fetch("https://mborijnland.osiris-student.nl/student/osiris/student/rooster/per_week?limit=5", {
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching events: ${response.status} - ${response.statusText}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      return [];
    }
  }

  public static async handleBackgroundFetchTask() {
    try {
      const newEvents = await this.refreshEvents();
      const profileChange = await this.refreshProfileData();
      console.log("profileChange", profileChange);
      if (newEvents) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Rooster is gewijzigd!",
            body: "Klik om de wijzigingen te bekijken",
          },
          trigger: null, // Send immediately
        });
      } else {
        // Debug only
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Geen wijzigingen in het rooster",
            body: new Date().toISOString(),
          },
          trigger: null, // Send immediately
        });
      }

      if (profileChange) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Profiel is gewijzigd!",
            body: "Meschien zijn er nieuwe cijfers of afwezigheid",
          },
          trigger: null, // Send immediately
        });
      }
    } catch (error) {
      console.error("Error in handleBackgroundFetchTask:", error);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Error tijdens ophalen van het rooster",
          body: new Date().toISOString(),
        },
        trigger: null, // Send immediately
      });
    }
  }

  public static async defineBackgroundFetchTask() {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      try {
        console.log("Running background fetch task...");

        await BetterOsirisCache.handleBackgroundFetchTask();
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error("Error in background fetch task:", error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  }

  public static async configureBackgroundFetch() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (!isRegistered) {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60, // 15 minutes
          stopOnTerminate: false, // Do not stop when app is terminated
          startOnBoot: true, // Start after device reboot
        });
        console.log("Background fetch task registered.");
      } catch (err) {
        console.error("Failed to register task:", err);
      }
    }
  }

  public static async setupBackgroundFetch() {
    const isAlreadySetup = await AsyncStorage.getItem("BACKGROUND_FETCH_SETUP");

    if (isAlreadySetup === "true") {
      console.log("Background fetch already set up.");
      return;
    }

    this.defineBackgroundFetchTask();
    await this.configureBackgroundFetch();

    await AsyncStorage.setItem("BACKGROUND_FETCH_SETUP", "true");
    console.log("Background fetch setup completed.");
  }

  public static async requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }
    }
    console.log("Notification permissions granted");
  }

  private static flattenEvents(data: any) {
    return data.items.flatMap((week: any) =>
      week.dagen.flatMap((day: any) =>
        day.rooster.map((event: any) => ({
          id: event.id_rooster + event.notitie,
          title: event.onderwerp,
          locatie: event.locatie,
          docenten: event.docenten,
          start: {
            dateTime: formatDateAndTime(day.datum, event.tijd_vanaf),
          },
          end: {
            dateTime: formatDateAndTime(day.datum, event.tijd_tm),
          },
          color: event.onderwerp.includes("ALA") ? "#A3C7D6" : "#B1AFFF",
        }))
      )
    );
  }

  public static async getToken(): Promise<string | null> {
    return AsyncStorage.getItem("token");
  }

  //**
  // Set token in async storage
  // if token is null, remove token from async storage
  // */
  public static async setToken(token: string | null) {
    if (token) {
      await AsyncStorage.setItem("token", token);
    } else {
      await AsyncStorage.removeItem("token");
    }
  }

  public static async fetchProfile(token: string) {
    try {
      const response = await fetch("https://mborijnland.osiris-student.nl/student/osiris/gebruiker", {
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching profile: ${response.status} - ${response.statusText}`);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return [];
    }
  }

  public static async fetchAfwezigheid(token: string) {
    try {
      const response = await fetch("https://mborijnland.osiris-student.nl/student/osiris/student/afwezigheid/per_dag/?limit=25", {
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching fetchAfwezigheid: ${response.status} - ${response.statusText}`);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error in fetchAfwezigheid:", error);
      return [];
    }
  }

  public static async fetchAfwezigheidOverzicht(token: string) {
    try {
      const response = await fetch("https://mborijnland.osiris-student.nl/student/osiris/student/afwezigheid/overzicht", {
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching fetchAfwezigheidOverzicht: ${response.status} - ${response.statusText}`);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error in fetchAfwezigheidOverzicht:", error);
      return [];
    }
  }

  public static async fetchCijfers(token: string) {
    try {
      const response = await fetch("https://mborijnland.osiris-student.nl/student/osiris/student/resultaten", {
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching fetchCijfers: ${response.status} - ${response.statusText}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error in fetchCijfers:", error);
      return [];
    }
  }

  public static async refreshProfileData() {
    const token = await this.getToken();
    if (!token) {
      return;
    }

    const storedProfile = await AsyncStorage.getItem("profile");

    const profile = await this.fetchProfile(token);
    const afwezigheid = await this.fetchAfwezigheid(token);
    const cijfers = await this.fetchCijfers(token);
    const afwezigheidOverzicht = await this.fetchAfwezigheidOverzicht(token);

    console.log("Profile data refreshed");

    if (storedProfile) {
      const storedProfileData = JSON.parse(storedProfile);
      if (
        JSON.stringify(storedProfileData.profile) === JSON.stringify(profile) &&
        JSON.stringify(storedProfileData.afwezigheid) === JSON.stringify(afwezigheid) &&
        JSON.stringify(storedProfileData.cijfers) === JSON.stringify(cijfers) &&
        JSON.stringify(storedProfileData.afwezigheidOverzicht) === JSON.stringify(afwezigheidOverzicht)
      ) {
        return false; // No new data
      }
    }

    AsyncStorage.setItem(
      "profile",
      JSON.stringify({
        profile,
        afwezigheid,
        cijfers,
        afwezigheidOverzicht,
      })
    );

    return true; // New data
  }

  public static async getProfileData() {
    const profileData = await AsyncStorage.getItem("profile");
    if (profileData) {
      return JSON.parse(profileData);
    }
    return null;
  }

  public static async setColor(title: string, color: string) {
    const storedColors = await AsyncStorage.getItem("colors");
    let colors = storedColors ? JSON.parse(storedColors) : {};
    colors[title] = color;
    await AsyncStorage.setItem("colors", JSON.stringify(colors));
  }

  public static async getColors() {
    const storedColors = await AsyncStorage.getItem("colors");
    return storedColors ? JSON.parse(storedColors) : {};
  }

  public static async getColor(title: string) {
    const colors = await this.getColors();
    return colors[title] || "#B1AFFF";
  }

  public static async clearStorage() {
    await AsyncStorage.clear();
  }
}
