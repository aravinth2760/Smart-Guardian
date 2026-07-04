import { useState } from "react";
import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { Mail, User } from "lucide-react-native";

import styles from "@/styles/complete-profile.styles";

import AppTextInput from "@/components/common/AppTextInput";
import AppSelect from "@/components/common/AppSelect";

import { completeProfile } from "@/api/auth.api";
import { login } from "@/store/slices/authSlice";
import { validateProfile } from "@/utils/validation";

import type { Relationship } from "@/types/auth";
import AppButton from "@/components/common/AppButton";

export default function CompleteProfileScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("son");

  const [loading, setLoading] = useState(false);

  // ERRORS
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

  const handleContinue = async () => {
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

      const response = await completeProfile({
        phone: phone as string,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        relationship,
      });

      dispatch(
        login({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      router.replace("/home");
    } catch (err) {
      setRelationshipError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <Text style={styles.subtitle}>
        Please fill in your details to continue.
      </Text>

      {/* NAME */}
      <AppTextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          setNameError(null);
        }}
        placeholder="Enter your name"
        keyboardType="default"
        editable={!loading}
        Icon={User}
        error={nameError}
      />

      {/* EMAIL */}
      <AppTextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(null);
        }}
        placeholder="Enter your email"
        keyboardType="email-address"
        editable={!loading}
        Icon={Mail}
        error={emailError}
      />

      {/* RELATIONSHIP */}
      <Text style={styles.label}>Relationship</Text>

      <AppSelect
        label="Select relationship"
        value={relationship}
        options={relationships}
        onChange={(val) => {
          setRelationship(val);
          setRelationshipError(null);
        }}
        error={relationshipError}
      />

      {/* BUTTON */}
      <AppButton title="Continue" onPress={handleContinue} loading={loading} />
    </View>
  );
}
