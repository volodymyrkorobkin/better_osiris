import React from "react";
import { SafeAreaView, Text } from "react-native";
import styles from "./styles";

export default function MijnGegevens({ data }: { data: any }) {
  return data === null ? (
    <Text>Loading...</Text>
  ) : (
    <SafeAreaView>
      <Text style={[styles.text, styles.h2]}>Mijn Gegevens</Text>
      <SafeAreaView style={[styles.row, styles.justifyBetween, styles.alignCenter, styles.baseMargin]}>
        <SafeAreaView>
          <Text style={[styles.text, styles.gray, styles.miniText]}>Naam</Text>
          <Text style={styles.text}>{data.profile.roepnaam + " " + data.profile.achternaam}</Text>
          <Text style={[styles.text, styles.gray, styles.miniText]}>Studentnummer</Text>
          <Text style={styles.text}>{data.profile.studentnummer}</Text>
        </SafeAreaView>
        <SafeAreaView>
          <SafeAreaView style={[styles.circle, { backgroundColor: "lightblue", width: 125, height: 125, borderRadius: 75 }]}>
            <Text style={[styles.text, { textAlign: "center", lineHeight: 125, fontSize: 64 }]}>{data.profile.roepnaam[0]}</Text>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}
