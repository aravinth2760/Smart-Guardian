import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "@/constants/colors";

interface SOSButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const BUTTON_SIZE = 100;
const CONTAINER_SIZE = BUTTON_SIZE + 50;
const PULSE_SCALE = 1.8;
const PULSE_DURATION = 1400;
const PULSE_DELAY = 700;

export default function SOSButton({
  onPress,
  disabled = false,
}: SOSButtonProps) {
  const primaryPulse = useRef(new Animated.Value(1)).current;
  const secondaryPulse = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulseAnimation = (
      animatedValue: Animated.Value,
      delay: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: PULSE_SCALE,
            duration: PULSE_DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    const primaryAnimation = createPulseAnimation(primaryPulse, 0);
    const secondaryAnimation = createPulseAnimation(
      secondaryPulse,
      PULSE_DELAY,
    );

    primaryAnimation.start();
    secondaryAnimation.start();

    return () => {
      primaryAnimation.stop();
      secondaryAnimation.stop();
    };
  }, [primaryPulse, secondaryPulse]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const renderPulse = (
    animatedValue: Animated.Value,
    initialOpacity: number,
  ) => (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulse,
        {
          opacity: animatedValue.interpolate({
            inputRange: [1, PULSE_SCALE],
            outputRange: [initialOpacity, 0],
          }),
          transform: [{ scale: animatedValue }],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {renderPulse(primaryPulse, 0.4)}
      {renderPulse(secondaryPulse, 0.25)}

      <Animated.View
        style={{
          transform: [{ scale: buttonScale }],
        }}
      >
        <Pressable
          accessibilityLabel="Emergency SOS button"
          accessibilityRole="button"
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.label}>SOS</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  pulse: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors.light.emergency,
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.light.emergency,
    borderWidth: 3,
    borderColor: colors.light.emergencyLight,

    shadowColor: colors.light.emergency,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },

  buttonPressed: {
    backgroundColor: colors.light.emergencyDark,
    borderColor: colors.light.emergency,

    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  label: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 4,
  },
});
