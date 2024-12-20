import { SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";
import MijnGegevens from "@/components/MijnGegevens";
import styles from "@/components/styles";
import MijnAfwerzigheid from "@/components/Afwezigheid";
import MijnCijfers from "@/components/Cijfers";

import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const app = useAppContext();

  useFocusEffect(
    React.useCallback(() => {
      app.refresh();
    }, [app.forceRefresh])
  );

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ScrollView>
        <Text style={[styles.text, styles.h1, styles.bold]}>Profiel</Text>
        <MijnGegevens data={app.profile} />
        <MijnAfwerzigheid data={app.profile} />
        <MijnCijfers data={app.profile} />
      </ScrollView>
    </SafeAreaView>
  );
}
