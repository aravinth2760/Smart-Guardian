import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { getAuth } from "@react-native-firebase/auth";

import {
  registerUser,
  validateProfile,
  completeProfileStyles as styles,
  setUser,
} from "@/features/auth/index";

import { colors } from "@/constants/colors";
import { useDispatch } from "react-redux";

type Role = "parent" | "child" | "neighbour";

export default function CompleteProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("parent");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleContinue = async () => {
    try {
      setError(null);

      const validationError = validateProfile(name, email, role);

      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);

      const user = getAuth().currentUser;

      if (!user) {
        setError("User not found");
        return;
      }

      const response = await registerUser(
        user.uid,
        user.phoneNumber!,
        name.trim(),
        email.trim().toLowerCase(),
        role,
      );

      dispatch(
        setUser({
          firebaseUid: response.user.firebase_uid,
          phoneNumber: response.user.phone,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
        }),
      );

      router.replace("/(tabs)/home");
    } catch (err) {
      console.log("Register Error:", err);

      setError("Failed to create profile. Please try again.");
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

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor={colors.light.textTertiary}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
        maxLength={50}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor={colors.light.textTertiary}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        style={styles.input}
      />

      <Text style={styles.label}>Who are you?</Text>

      <View style={styles.roleContainer}>
        {(["parent", "child", "neighbour"] as Role[]).map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.roleButton,
              role === item && styles.roleButtonSelected,
            ]}
            onPress={() => {
              setRole(item);
              setError(null);
            }}
          >
            <Text
              style={[
                styles.roleText,
                role === item && styles.roleTextSelected,
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.light.card} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
