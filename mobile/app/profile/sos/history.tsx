import { FlatList, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";

const SOS_HISTORY = [
  {
    id: "1",
    date: "12 Jul 2026",
    time: "10:30 AM",
    status: "Completed",
    location: true,
    contacts: 3,
  },
  {
    id: "2",
    date: "08 Jul 2026",
    time: "08:15 PM",
    status: "Cancelled",
    location: false,
    contacts: 0,
  },
];

export default function SOSHistoryScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="SOS History" />

      <View style={styles.container}>
        <FlatList
          data={SOS_HISTORY}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.date}>{item.date}</Text>

                <Text
                  style={[
                    styles.status,
                    item.status === "Completed"
                      ? styles.success
                      : styles.cancelled,
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <Text style={styles.time}>{item.time}</Text>

              <Text style={styles.info}>
                📍 Live Location: {item.location ? "Shared" : "Not Shared"}
              </Text>

              <Text style={styles.info}>
                👥 Contacts Notified: {item.contacts}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No SOS history found</Text>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    padding: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  status: {
    fontSize: 13,
    fontWeight: "700",
  },

  success: {
    color: "green",
  },

  cancelled: {
    color: "orange",
  },

  time: {
    marginTop: 6,
    color: colors.light.textSecondary,
  },

  info: {
    marginTop: 10,
    color: colors.light.text,
    fontSize: 14,
  },

  empty: {
    marginTop: 50,
    textAlign: "center",
    color: colors.light.textSecondary,
  },
});
