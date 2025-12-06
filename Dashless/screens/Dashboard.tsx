import { StatusBar } from "expo-status-bar";
import { useEffect , useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [stats,setstats] = useState([
    { id: "1", title: "Deliveries Completed", body: "...Loading" },
    { id: "2", title: "Total Collected", body: "...Loading" },
    { id: "3", title: "Cash vs QRPH", body: "...Loading" },
  ]);

  const getStats=async()=>{
    try {
      const [completedRes, totalCodRes, paymentRes] = await Promise.all([
        fetch("https://dashless-backend-production.up.railway.app/orders-today/completed-count"),
        fetch("https://dashless-backend-production.up.railway.app/orders-today/total-cod"),
        fetch("https://dashless-backend-production.up.railway.app/orders-today/payment-percentages"),
      ]);

      const completedData = await completedRes.json();
      const totalCodData = await totalCodRes.json();
      const paymentData = await paymentRes.json();

      setstats([
        {
          id: "1",
          title: "Deliveries Completed",
          body: `${completedData.count} today`,
        },
        {
          id: "2",
          title: "Total Collected",
          body: `₱${totalCodData.total}`,
        },
        {
          id: "3",
          title: "Cash vs QRPH",
          body: `${paymentData.qrphPercent}% QRPH • ${paymentData.cashPercent}% Cash`,
        },
      ]);

    } catch (err) {
      console.error("Stats error:", err);
    }
  }

  useEffect(()=>{
    getStats()
  },[])

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image
          style={styles.logoImage}
          source={require("../assets/DashlessLogo.png")}
        />
        <Text style={styles.logoTitle}>DASHLESS</Text>
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

  logoTitle: {
    color: "#8F6BFF",
    fontWeight: "bold",
    fontSize: 32,
    textTransform: "uppercase",
    marginBottom: 20, // adjust spacing below
    position: "relative",
    top: -60, // move it upwards, overlapping the logo
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
