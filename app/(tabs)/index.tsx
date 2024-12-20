import React, { useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import TimelineCalendar, { EventItem, CalendarKitHandle, CalendarHeader, CalendarContainer, CalendarBody } from "@howljs/calendar-kit";
import { useAppContext } from "@/context/appContext";
import Login from "@/components/Login";
import { useFocusEffect } from "@react-navigation/native";

import styles from "@/components/styles";

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import BetterOsirisCache from "@/lib/BetterOsirisCache";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // log warnings and errors
  strict: false, // Reanimated runs in strict mode by default
});

function formatDutchDate(dateString: string): string {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter.format(date);
}

function smartTimeUntil(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();

  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Het is al begonnen";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `nog ${days} ${days === 1 ? "dag" : "dagen"}`;
  }

  return `nog ${hours}:${minutes.toString().padStart(2, "0")}`;
}

function formatEventDuration(startString: string, endString: string) {
  const startDate = new Date(startString);
  const endDate = new Date(endString);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const formatTime = (date: Date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  const durationMs = endDate.getTime() - startDate.getTime();
  if (durationMs <= 0) {
    throw new Error("End time must be after start time");
  }

  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  let durationText = `${durationHours} ${durationHours === 1 ? "uur" : "uren"}`;
  if (durationMinutes > 0) {
    durationText += ` en ${durationMinutes} ${durationMinutes === 1 ? "minuut" : "minuten"}`;
  }

  return {
    formattedTime: `${startTime} - ${endTime}`,
    duration: durationText,
  };
}

function EventDetails({ event, onClose }: { event: any; onClose: () => void }) {
  const [color, setColor] = React.useState<string | null>(null);

  React.useEffect(() => {
    BetterOsirisCache.getColor(event.title).then((color) => {
      setColor(color);
    });
  }, [event.title]);

  return (
    <SafeAreaView style={[styles.modal]}>
      <SafeAreaView style={[styles.baseMargin, styles.modalContent, styles.gap]}>
        <TouchableOpacity onPress={onClose} style={[styles.pressable]}>
          <Text style={[styles.text, styles.backButton]}>{"< Terug"}</Text>
        </TouchableOpacity>
        <Text style={[styles.text, styles.h2, styles.bold]}>{event.title}</Text>

        <SafeAreaView>
          <SafeAreaView style={[styles.limitHeight, styles.row, styles.alignCenter, styles.gap]}>
            <Text style={styles.text}>{formatDutchDate(event.start.dateTime)}</Text>
            <Text style={[styles.text, styles.gray, styles.miniText]}>{"(" + smartTimeUntil(event.start.dateTime) + ")"}</Text>
          </SafeAreaView>

          <SafeAreaView style={[styles.limitHeight, styles.row, styles.alignCenter, styles.gap]}>
            <Text style={styles.text}>{formatEventDuration(event.start.dateTime, event.end.dateTime).formattedTime}</Text>
            <Text style={[styles.text, styles.gray]}>
              {"(" + formatEventDuration(event.start.dateTime, event.end.dateTime).duration + ")"}
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView style={styles.limitHeight}>
          <Text style={[styles.text, styles.gray]}>Locatie:</Text>
          <Text style={styles.text}>{event.locatie}</Text>
        </SafeAreaView>

        <SafeAreaView style={styles.limitHeight}>
          <Text style={[styles.text, styles.gray]}>Docent:</Text>
          <Text style={styles.text}>{event.docenten.flatMap((docent: any) => docent.naam).join(", ")}</Text>
        </SafeAreaView>

        <SafeAreaView>
          <Text style={[styles.text, styles.gray]}>Kleur</Text>
          <TouchableOpacity
            onPress={async () => {
              const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
              await BetterOsirisCache.setColor(event.title, randomColor);
              setColor(randomColor);
            }}
          >
            <SafeAreaView style={[styles.row, styles.alignCenter, styles.gap]}>
              <Text style={styles.text}>{color}</Text>
              <SafeAreaView style={[styles.kleur, { backgroundColor: color || "#FFFFFF" }]}></SafeAreaView>
            </SafeAreaView>
          </TouchableOpacity>
        </SafeAreaView>

        <TouchableOpacity onPress={onClose} style={[styles.backShortcut]}>
          <Text style={[styles.backShortcutButton]}>{"<"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const calendarRef = useRef<CalendarKitHandle>(null);
  const [colors, setColors] = React.useState<{ [key: string]: string }>({});

  const appСontext = useAppContext();

  useFocusEffect(
    React.useCallback(() => {
      calendarRef.current?.goToHour(1, false);
      calendarRef.current?.goToDate({ date: new Date().toISOString(), animatedDate: true, hourScroll: false, animatedHour: false });
      if (selectedEvent) {
        setSelectedEvent(null);
      }

      appСontext.refresh();
    }, [appСontext.forceRefresh])
  );

  useEffect(() => {
    BetterOsirisCache.getColors().then((colors) => {
      setColors(colors);
    });
  }, [selectedEvent]);

  return !appСontext.token ? (
    <Login setToken={appСontext.setToken} />
  ) : (
    <SafeAreaView style={styles.container}>
      <CalendarContainer
        numberOfDays={5}
        ref={calendarRef}
        scrollByDay={false}
        overlapType="overlap"
        events={appСontext.events.map((event) => ({
          ...event,
          color: colors[event.title] || "#B1AFFF",
        }))}
        hideWeekDays={[6, 7]} // Hide weekends
        overlapEventsSpacing={500}
        rightEdgeSpacing={2}
        scrollToNow={true}
        spaceFromTop={-390}
        onPressEvent={(e) => {
          console.log("Event pressed", e);
          setSelectedEvent(e);
        }}
      >
        <CalendarHeader dayBarHeight={60} />
        <CalendarBody
          renderEvent={(event) => (
            <SafeAreaView style={styles.border}>
              <Text style={[styles.eventHead]}>
                {event.locatie
                  .split(",")
                  .map((loc: string) => loc.split("S")[1])
                  .join(", ")}
              </Text>
              <Text style={styles.eventText}>{event.title}</Text>
            </SafeAreaView>
          )}
        />
      </CalendarContainer>
      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </SafeAreaView>
  );
}
