import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Database } from '@/lib/database.types';
import { Colors } from '@/constants/theme';

type AdoptTheme = Database['public']['Tables']['adopt_themes']['Row'];

interface ThemeInfoModalProps {
  theme: AdoptTheme | null;
  onClose: () => void;
}

export function ThemeInfoModal({ theme, onClose }: ThemeInfoModalProps) {
  return (
    <Modal
      visible={!!theme}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Scrim */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        {/* Sheet — stop press propagation so tapping inside doesn't close */}
        <Pressable
          style={{
            backgroundColor: Colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '82%',
            overflow: 'hidden',
          }}
          onPress={() => {}}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.subtext + '50' }} />
          </View>

          {/* Category colour header strip */}
          {theme && (
            <View
              style={{
                backgroundColor: theme.category_colour ?? Colors.secondary,
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 12, color: Colors.text, opacity: 0.7 }}>
                {theme.category}
              </Text>
              <Text
                style={{
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  color: Colors.text,
                  lineHeight: 30,
                  marginTop: 2,
                }}
              >
                {theme.theme}
              </Text>
            </View>
          )}

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            {theme?.third_person_description && (
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.text,
                  lineHeight: 24,
                }}
              >
                {theme.third_person_description}
              </Text>
            )}
          </ScrollView>

          {/* Close button */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 14,
                minHeight: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
