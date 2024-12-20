import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "@/components/styles";

export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
      </SafeAreaView>
    </SafeAreaView>
  );
}
