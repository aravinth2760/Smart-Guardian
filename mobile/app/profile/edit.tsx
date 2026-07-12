import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ArrowLeft, Mail, User } from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import colors from "@/constants/colors";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import AppButton from "@/components/common/AppButton";
import AppSelect from "@/components/common/AppSelect";
import AppTextInput from "@/components/common/AppTextInput";

import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";

import { updateProfile } from "@/api/auth.api";
import { tokenService } from "@/services/token.service";

import { Relationship } from "@/types/auth";

import { validateProfile } from "@/utils/validation";

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(userData?.name ?? "");
  const [email, setEmail] = useState(userData?.email ?? "");
  const [phone] = useState(() => {
    const phone = userData?.phone ?? "";
    return phone.length === 12 ? phone.slice(2) : phone;
  });
  const [relationship, setRelationship] = useState<Relationship>(
    userData?.relationship ?? "other",
  );

  const hasChanges =
    name.trim() !== (userData?.name ?? "") ||
    email.trim() !== (userData?.email ?? "") ||
    relationship !== (userData?.relationship ?? "other");

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

    // Nothing changed
    if (!hasChanges) {
      return;
    }

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

      const response = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        relationship,
      });

      if (response.success) {
        await tokenService.saveUser(response.data);
        dispatch(setUser(response.data));
        router.back();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* HEADER */}
      <ScreenHeader title="Edit Profile" />

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
          value={phone as string}
          onChangeText={() => {}}
          editable={false}
          keyboardType="phone-pad"
          isLogin={true}
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
            disabled={!hasChanges || loading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
});
