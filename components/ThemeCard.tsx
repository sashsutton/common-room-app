import { View, Text, TouchableOpacity } from 'react-native';
import { Database } from '@/lib/database.types';
import { MIN_TOUCH_TARGET } from '@/constants/theme';

type AdoptTheme = Database['public']['Tables']['adopt_themes']['Row'];

interface ThemeCardProps {
  theme: AdoptTheme;
  selected: boolean;
  onSelect: () => void;
  onInfo: () => void;
}

export function ThemeCard({ theme, selected, onSelect, onInfo }: ThemeCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{ minHeight: MIN_TOUCH_TARGET }}
      className={`rounded-xl p-4 mb-3 border-2 ${
        selected ? 'border-accent' : 'border-transparent'
      }`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <View style={{ backgroundColor: theme.category_colour ?? '#F6F6F3' }} className="absolute inset-0 rounded-xl opacity-30" />
      <View className="flex-row items-center justify-between">
        <Text className="text-ink text-base flex-1 mr-2" style={{ fontFamily: 'Georgia' }}>
          {theme.theme}
        </Text>
        <TouchableOpacity
          onPress={onInfo}
          style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' }}
          accessibilityLabel={`More info about ${theme.theme}`}
        >
          <Text className="text-primary text-lg">ⓘ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
