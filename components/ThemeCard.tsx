import { View, Text, TouchableOpacity } from 'react-native';
import { Database } from '@/lib/database.types';
import { Colors } from '@/constants/theme';

type AdoptTheme = Database['public']['Tables']['adopt_themes']['Row'];

interface ThemeCardProps {
  theme: AdoptTheme;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onInfo: () => void;
}

export function ThemeCard({ theme, selected, disabled, onSelect, onInfo }: ThemeCardProps) {
  const categoryBg = theme.category_colour ?? '#F6F6F3';

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      style={{
        marginBottom: 10,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: selected ? Colors.accent : 'transparent',
        opacity: disabled ? 0.38 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Category colour wash */}
      <View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: categoryBg,
          opacity: 0.25,
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, minHeight: 64 }}>
        {/* Selected indicator */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor: selected ? Colors.accent : Colors.subtext,
            backgroundColor: selected ? Colors.accent : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          {selected && (
            <Text style={{ color: 'white', fontSize: 12, lineHeight: 16, fontWeight: '700' }}>✓</Text>
          )}
        </View>

        {/* Theme name + description */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <Text
            style={{ fontFamily: 'Georgia', fontSize: 16, color: Colors.text, lineHeight: 22 }}
            numberOfLines={2}
          >
            {theme.theme}
          </Text>
          {theme.description ? (
            <Text
              style={{ fontSize: 13, color: Colors.subtext, marginTop: 2, lineHeight: 18 }}
              numberOfLines={1}
            >
              {theme.description}
            </Text>
          ) : null}
        </View>

        {/* Info button */}
        <TouchableOpacity
          onPress={onInfo}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          accessibilityLabel={`More information about ${theme.theme}`}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderWidth: 1.5,
              borderColor: Colors.primary + '60',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600', lineHeight: 18 }}>
              i
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
