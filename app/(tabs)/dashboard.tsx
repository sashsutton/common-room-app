import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <Text className="text-ink text-2xl" style={{ fontFamily: 'Georgia' }}>
        My Purpose Dashboard
      </Text>
    </View>
  );
}
