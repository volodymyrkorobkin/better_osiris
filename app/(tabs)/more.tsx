import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import styles from "@/components/styles";
import BetterOsirisCache from "@/lib/BetterOsirisCache";
import { useAppContext } from "@/context/appContext";

export default function MoreScreen() {
  const appContext = useAppContext();

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <Text style={[styles.text, styles.h1]}>Meer</Text>
      <SafeAreaView style={[styles.gap, styles.baseMargin, styles.flex]}>
        <Text style={[styles.text, styles.h2]}>Debug</Text>
        <TouchableOpacity
          onPress={async () => {
            await BetterOsirisCache.clearStorage();
            console.log("Cache cleared");
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Reset Cache</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            console.log(appContext.events);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Check events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            console.log(appContext.profile.cijfers);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Check profile</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.gap, styles.baseMargin, styles.flex]}>
        <Text style={[styles.text, styles.h2]}>Background Fetch</Text>
        <TouchableOpacity
          onPress={async () => {
            await BetterOsirisCache.handleBackgroundFetchTask();
            console.log("Background fetch triggered");
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Trigger Background Fetch</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.gap, styles.baseMargin, styles.flex]}>
        <Text style={[styles.text, styles.h2]}>Events</Text>
        <TouchableOpacity
          onPress={async () => {
            const randomEvent = appContext.events[Math.floor(Math.random() * appContext.events.length)];
            const filteredEvents = appContext.events.filter((event) => JSON.stringify(event) !== JSON.stringify(randomEvent));
            await BetterOsirisCache.setEvents(filteredEvents);
            console.log("Removed event", randomEvent.title);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Remove random event</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.gap, styles.baseMargin, styles.flex]}>
        <Text style={[styles.text, styles.h2]}>Cijfers</Text>
        <TouchableOpacity
          onPress={async () => {
            console.log(1);
            const profile = await BetterOsirisCache.getProfileData();
            console.log(2);
            console.log(2.5);
            const filteredCijfers = profile.cijfers.items.slice(1);
            console.log(3);
            console.log(filteredCijfers);
            await BetterOsirisCache.setProfile({ ...profile, cijfers: { ...profile.cijfers, items: filteredCijfers } });
            console.log("Removed cijfer");
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>Remove first cijfer</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.gap, styles.baseMargin, styles.flex]}>
        <Text style={[styles.text, styles.h2]}>Force Refresh</Text>
        <TouchableOpacity
          onPress={() => {
            appContext.setForceRefresh(!appContext.forceRefresh);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>{appContext.forceRefresh ? "Enabled" : "Disabled"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}
