// React
import { useEffect, useState } from "react";

// React Native
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Constants
import colors from "@/constants/colors";

// Services
import {
  approveJoinRequest,
  getJoinRequests,
  rejectJoinRequest,
} from "@/services/group.service";

// Components
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";

type JoinRequest = {
  id: string;
  user: {
    id: string;
    name: string | null;
    phone: string;
  };
  createdAt: string;
};

export default function JoinRequestsScreen() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getJoinRequests();
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveJoinRequest(id);

      setRequests((prev) => prev.filter((item) => item.id !== id));

      Alert.alert("Success", "Request approved.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to approve request.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectJoinRequest(id);

      setRequests((prev) => prev.filter((item) => item.id !== id));

      Alert.alert("Success", "Request rejected.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to reject request.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ScreenContainer>
          <ActivityIndicator size="large" color={colors.light.primary} />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Join Requests" />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySubtitle}>
              New join requests from family members will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.user.name ?? "Unknown"}</Text>

              <Text style={styles.phone}>{item.user.phone}</Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.approveButton}
                onPress={() => handleApprove(item.id)}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </Pressable>

              <Pressable
                style={styles.rejectButton}
                onPress={() => handleReject(item.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  list: {
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
  },

  info: {
    marginBottom: 16,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.light.text,
  },

  phone: {
    marginTop: 6,
    fontSize: 14,
    color: colors.light.textSecondary,
  },

  actions: {
    flexDirection: "row",
  },

  approveButton: {
    flex: 1,
    backgroundColor: colors.light.success,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },

  rejectButton: {
    flex: 1,
    backgroundColor: colors.light.emergency,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 32,
  },
});
