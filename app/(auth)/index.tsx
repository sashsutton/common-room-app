import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
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
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 260, height: 55, resizeMode: 'contain' }}
            accessibilityLabel="The Common Room"
          />
          <Text
            className="text-subtext text-center text-base mt-4"
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

        {/* About This App */}
        <View
          className="rounded-2xl p-5"
          style={{ backgroundColor: '#FDF6E3', marginBottom: 48 }}
        >
          <Text
            className="text-primary text-sm mb-2"
            style={{ fontWeight: '600' }}
          >
            About this app
          </Text>
          <Text
            className="text-ink text-sm"
            style={{ lineHeight: 22 }}
          >
            This app is a companion to the in-person Common Room workshops and The Purpose Workbook. It is designed to help members reflect on what matters most, record their selected purpose themes, and revisit their personal points of reflection between sessions.{'\n\n'}
            Please use this app only if you have attended at least one in-person workshop at a Common Room hub. It is not intended to replace the hosted workshop experience, facilitated conversations, peer support or workbook journey.{'\n\n'}
            If your local authority, organisation or community is interested in creating a Common Room, please email:{' '}
            <Text style={{ fontWeight: '600' }}>contact@lifework-lab.com</Text>
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
