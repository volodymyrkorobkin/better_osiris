import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

import { Image } from "react-native";

import HomeIcon from "@/assets/images/home.png";
import ProfileIcon from "@/assets/images/profile.png";
import MoreIcon from "@/assets/images/more.png";

const iconSize = 40;

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          default: {
            height: 60, // Increase the height of the tab bar
          },
        }),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={ProfileIcon}
              style={{
                width: iconSize * 1.2,
                height: iconSize * 1.2,
                tintColor: focused ? color : undefined,
                marginTop: 20,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={HomeIcon}
              style={{
                width: iconSize,
                height: iconSize,
                tintColor: focused ? color : undefined,
                marginTop: 20,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={MoreIcon}
              style={{
                width: iconSize * 0.9,
                height: iconSize * 0.9,
                tintColor: focused ? color : undefined,
                marginTop: 20,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
