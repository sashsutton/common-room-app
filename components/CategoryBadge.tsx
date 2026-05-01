import { View, Text } from 'react-native';
import { CategoryColors } from '@/constants/theme';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = CategoryColors[category] ?? '#F6F6F3';
  return (
    <View className="rounded-full px-3 py-1 self-start" style={{ backgroundColor: color }}>
      <Text className="text-ink text-xs">{category}</Text>
    </View>
  );
}
