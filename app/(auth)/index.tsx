import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-6 pb-10" style={{ paddingTop: 80 }}>

        {/* Wordmark */}
        <View className="items-center" style={{ marginBottom: 48 }}>
          <Text
            className="text-primary text-center"
            style={{ fontFamily: 'Georgia', fontSize: 36, lineHeight: 44 }}
          >
            The Common Room
          </Text>
          <Text
            className="text-subtext text-center text-base mt-3"
            style={{ lineHeight: 24 }}
          >
            A space for reflection, clarity, and purpose
          </Text>
        </View>

        {/* AI Disclaimer */}
        <View
          className="rounded-2xl p-5"
          style={{ backgroundColor: '#E8EFF1', marginBottom: 48 }}
        >
          <Text
            className="text-primary text-sm mb-2"
            style={{ fontWeight: '600' }}
          >
            A note about this app
          </Text>
          <Text
            className="text-ink text-sm"
            style={{ lineHeight: 22 }}
          >
            The Common Room uses AI to generate personalised Points of Reflection
            based on the themes you choose. These are offered as prompts for your
            own thinking — not advice, diagnosis, or instruction.{'\n\n'}
            You are always the expert on your own life.
          </Text>
        </View>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="bg-primary rounded-2xl items-center justify-center"
            style={{ minHeight: 52 }}
            activeOpacity={0.85}
          >
            <Text className="text-white text-base" style={{ fontWeight: '600' }}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-in')}
            className="rounded-2xl items-center justify-center"
            style={{ minHeight: 52, borderWidth: 1.5, borderColor: Colors.primary + '40' }}
            activeOpacity={0.7}
          >
            <Text className="text-primary text-base">
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
