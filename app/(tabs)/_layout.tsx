import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.secondary + '60',
        },
        tabBarLabelStyle: { fontSize: 11 },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontFamily: 'Georgia', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'My Purpose',
          tabBarIcon: ({ color, size }) => <Feather name="compass" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adopt"
        options={{
          title: 'Themes',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="layers" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reflections"
        options={{
          title: 'Reflections',
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'My Note',
          tabBarIcon: ({ color, size }) => <Feather name="edit-3" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
