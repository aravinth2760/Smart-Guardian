import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import colors from "@/constants/colors";

interface SOSButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const PULSE_SCALE = 1.6;
const PULSE_DURATION = 1400;
const PULSE_DELAY = 700;

export default function SOSButton({
  onPress,
  disabled = false,
}: SOSButtonProps) {
  const { width } = useWindowDimensions();

  const BUTTON_SIZE = Math.max(72, Math.min(width * 0.22, 96));
  const CONTAINER_SIZE = BUTTON_SIZE + 34;

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
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
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
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
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
    <View
      style={[
        styles.container,
        {
          width: CONTAINER_SIZE,
          height: CONTAINER_SIZE,
        },
      ]}
    >
      {renderPulse(primaryPulse, 0.35)}
      {renderPulse(secondaryPulse, 0.2)}

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
            {
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              borderRadius: BUTTON_SIZE / 2,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                fontSize: BUTTON_SIZE * 0.3,
                letterSpacing: BUTTON_SIZE * 0.02,
              },
            ]}
          >
            SOS
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  pulse: {
    position: "absolute",
    backgroundColor: colors.light.emergency,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.light.emergency,
    borderWidth: 3,
    borderColor: colors.light.emergencyLight,

    shadowColor: colors.light.emergency,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonPressed: {
    backgroundColor: colors.light.emergencyDark,
    borderColor: colors.light.emergency,

    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  label: {
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
