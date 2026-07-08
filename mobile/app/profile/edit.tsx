import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, User } from "lucide-react-native";
import { router } from "expo-router";

import colors from "@/constants/colors";

import AppTextInput from "@/components/common/AppTextInput";
import AppSelect from "@/components/common/AppSelect";
import AppButton from "@/components/common/AppButton";
import { Relationship } from "@/types/auth";
import { validateProfile } from "@/utils/validation";

export default function EditProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@gmail.com");
  const [phone] = useState("9876543210");
  const [relationship, setRelationship] = useState<Relationship>("son");

  const [loading, setLoading] = useState(false);

  // Errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [relationshipError, setRelationshipError] = useState<string | null>(
    null,
  );

  const relationships: Relationship[] = [
    "father",
    "mother",
    "son",
    "daughter",
    "grandfather",
    "grandmother",
    "guardian",
    "other",
  ];

  const handleSave = async () => {
    setNameError(null);
    setEmailError(null);
    setRelationshipError(null);

    const error = validateProfile(name, email, relationship);

    if (error) {
      if (error.toLowerCase().includes("name")) {
        setNameError(error);
      } else if (error.toLowerCase().includes("email")) {
        setEmailError(error);
      } else if (error.toLowerCase().includes("relationship")) {
        setRelationshipError(error);
      }
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // await updateProfile(...)

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.light.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.content}>
        {/* NAME */}
        <Text style={styles.label}>Name</Text>

        <AppTextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError(null);
          }}
          placeholder="Enter your name"
          Icon={User}
          editable={!loading}
          error={nameError}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>

        <AppTextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(null);
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          Icon={Mail}
          editable={!loading}
          error={emailError}
        />

        {/* PHONE */}
        <Text style={styles.label}>Phone Number</Text>

        <AppTextInput
          value={phone}
          onChangeText={() => {}}
          editable={false}
          keyboardType="phone-pad"
        />

        {/* RELATIONSHIP */}
        <Text style={styles.label}>Relationship</Text>

        <AppSelect
          label="Select Relationship"
          value={relationship}
          options={relationships}
          onChange={(value) => {
            setRelationship(value);
            setRelationshipError(null);
          }}
          error={relationshipError}
        />

        <View style={{ marginTop: 32 }}>
          <AppButton
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.cardBorder,
  },

  headerTitle: {
    marginLeft: 16,
    fontSize: 22,
    fontWeight: "700",
    color: colors.light.text,
  },

  content: {
    flex: 1,
    padding: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
});
