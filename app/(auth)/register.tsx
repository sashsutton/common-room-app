import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';

const GENDER_OPTIONS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  function validate(): string | null {
    if (!fullName.trim()) return 'Please enter your name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (!gender) return 'Please select a gender option.';
    const year = parseInt(yearOfBirth, 10);
    if (!yearOfBirth || isNaN(year) || year < 1920 || year > new Date().getFullYear() - 16) {
      return 'Please enter a valid year of birth.';
    }
    if (!postcode.trim()) return 'Please enter your home postcode.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  async function handleRegister() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError("Let's try that again — we couldn't create your account.");
      return;
    }

    if (data.user) {
      await supabase.from('profiles').update({
        full_name: fullName.trim(),
        gender,
        year_of_birth: parseInt(yearOfBirth, 10),
        home_postcode: postcode.trim().toUpperCase(),
      }).eq('id', data.user.id);
    }

    setLoading(false);

    if (!data.session) {
      // Email confirmation required
      setEmailSent(true);
    }
    // If session exists, auth gate in _layout.tsx handles redirect automatically
  }

  if (emailSent) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text
          className="text-primary text-center"
          style={{ fontFamily: 'Georgia', fontSize: 26, marginBottom: 16 }}
        >
          Check your inbox
        </Text>
        <Text className="text-ink text-base text-center" style={{ lineHeight: 26, marginBottom: 32 }}>
          We've sent a confirmation link to{' '}
          <Text style={{ fontWeight: '600' }}>{email}</Text>.{'\n\n'}
          Open it to activate your account, then come back and sign in.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/sign-in')}
          className="bg-primary rounded-2xl items-center justify-center px-8"
          style={{ minHeight: 52 }}
        >
          <Text className="text-white text-base" style={{ fontWeight: '600' }}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-12" style={{ paddingTop: 64 }}>

          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 28 }}
          >
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>

          {/* Heading */}
          <Text
            className="text-primary"
            style={{ fontFamily: 'Georgia', fontSize: 30, lineHeight: 38, marginBottom: 8 }}
          >
            Create your account
          </Text>
          <Text className="text-subtext text-base" style={{ marginBottom: 32 }}>
            Just a few details to get you started
          </Text>

          {/* ── Full Name ── */}
          <Field label="Full name">
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={Colors.subtext}
              autoComplete="name"
              autoCapitalize="words"
              style={inputStyle}
            />
          </Field>

          {/* ── Email ── */}
          <Field label="Email">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={inputStyle}
            />
          </Field>

          {/* ── Gender ── */}
          <Field label="Gender">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setGender(option)}
                  style={{
                    minHeight: 44,
                    paddingHorizontal: 16,
                    borderRadius: 100,
                    borderWidth: 1.5,
                    borderColor: gender === option ? Colors.primary : Colors.secondary,
                    backgroundColor: gender === option ? Colors.primary : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={{
                      color: gender === option ? 'white' : Colors.text,
                      fontSize: 14,
                      fontWeight: gender === option ? '600' : '400',
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          {/* ── Year of birth ── */}
          <Field label="Year of birth">
            <TextInput
              value={yearOfBirth}
              onChangeText={(t) => setYearOfBirth(t.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="e.g. 1978"
              placeholderTextColor={Colors.subtext}
              keyboardType="number-pad"
              maxLength={4}
              style={inputStyle}
            />
          </Field>

          {/* ── Postcode ── */}
          <Field label="Home postcode">
            <TextInput
              value={postcode}
              onChangeText={(t) => setPostcode(t.toUpperCase())}
              placeholder="e.g. SW1A 1AA"
              placeholderTextColor={Colors.subtext}
              autoCapitalize="characters"
              style={inputStyle}
            />
          </Field>

          {/* ── Password ── */}
          <Field label="Password">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.subtext}
              secureTextEntry
              autoComplete="new-password"
              style={inputStyle}
            />
          </Field>

          {/* ── Confirm password ── */}
          <Field label="Confirm password">
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              placeholderTextColor={Colors.subtext}
              secureTextEntry
              style={inputStyle}
            />
          </Field>

          {error ? (
            <Text className="text-error text-sm" style={{ marginBottom: 12 }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary rounded-2xl items-center justify-center"
            style={{ minHeight: 52, marginTop: 8, opacity: loading ? 0.7 : 1 }}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white text-base" style={{ fontWeight: '600' }}>Create Account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/sign-in')}
            style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
          >
            <Text className="text-subtext text-sm">
              Already have an account?{' '}
              <Text className="text-primary">Sign in</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 8 }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

const inputStyle = {
  minHeight: 52,
  backgroundColor: 'white',
  borderWidth: 1.5,
  borderColor: Colors.secondary,
  borderRadius: 12,
  paddingHorizontal: 16,
  fontSize: 16,
  color: Colors.text,
} as const;
