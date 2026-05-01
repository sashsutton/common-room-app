import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: { backgroundColor: Colors.background },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'My Purpose' }} />
      <Tabs.Screen name="adopt" options={{ title: 'Themes' }} />
      <Tabs.Screen name="reflections" options={{ title: 'Reflections' }} />
      <Tabs.Screen name="notes" options={{ title: 'My Note' }} />
    </Tabs>
  );
}
