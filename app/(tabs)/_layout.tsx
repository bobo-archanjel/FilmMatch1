import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,        // hide the top header
        tabBarStyle: { backgroundColor: '#191919' },
        tabBarActiveTintColor: '#FF3366',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',    // rename “index” to “Home” in the tab
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarLabel: 'Matches',
        }}
      />
    </Tabs>
  );
}
