import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

export default function Dashboard({ navigation }) {
  const stats = [
    { id: "1", title: "Deliveries Completed", body: "12 today" },
    { id: "2", title: "Total Collected", body: "₱4,560" },
    { id: "3", title: "Cash vs QRPH", body: "70% QRPH • 30% Cash" },
  ];

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image
          style={styles.logoImage}
          source={require("../assets/DashlessLogo.png")}
        />

        <FlatList
          data={stats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statBody}>{item.body}</Text>
            </View>
          )}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("DeliveryScreen")}
        >
          <Text style={styles.bigButtonText}>Check Your Deliveries</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF", // very light lavender
  },

  /* --- TOP SECTION --- */
  topSection: {
    flex: 2,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 25,
    resizeMode: "contain",
  },

  statCard: {
    backgroundColor: "white",
    width: width - 40,
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6842FF",
  },

  statBody: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "700",
    color: "#3A2D60",
  },

  /* --- BOTTOM SECTION --- */
  bottomSection: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  bigButton: {
    backgroundColor: "#8F6BFF",
    width: "100%",
    paddingVertical: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  bigButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "700",
  },
});
