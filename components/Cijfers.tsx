import React from "react";
import { SafeAreaView, Text } from "react-native";
import styles from "./styles";

function formatDutchDate(dateString: string): string {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter.format(date);
}

export default function MijnCijfers({ data }: { data: any }) {
  return data === null ? (
    <Text>Loading...</Text>
  ) : (
    <SafeAreaView>
      <Text style={[styles.text, styles.h2]}>Cijfers</Text>
      <SafeAreaView>
        {data.cijfers.items.map((cijfer: any) => (
          <SafeAreaView key={cijfer.id_resultaat} style={[styles.row, styles.cijfers, styles.alignCenter]}>
            <Text style={[styles.text, styles.cijfer]}>{cijfer.resultaat}</Text>
            <SafeAreaView style={[styles.flex1]}>
              <Text style={[styles.text, styles.miniText, styles.bold]}>{cijfer.cursus_korte_naam}</Text>
              <Text style={[styles.text, styles.miniText]}>{cijfer.toets_omschrijving}</Text>
              <Text style={[styles.text, styles.gray, styles.miniText]}>{formatDutchDate(cijfer.toetsdatum)}</Text>
            </SafeAreaView>
          </SafeAreaView>
        ))}
      </SafeAreaView>
    </SafeAreaView>
  );
}
