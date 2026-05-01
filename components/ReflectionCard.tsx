import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

interface ReflectionCardProps {
  text: string;
  index: number;
}

export function ReflectionCard({ text, index }: ReflectionCardProps) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-secondary/30">
      <Text className="text-subtext text-sm mb-2">Reflection {index + 1}</Text>
      <Text className="text-ink text-base leading-relaxed" style={{ lineHeight: 26 }}>
        {text}
      </Text>
    </View>
  );
}
