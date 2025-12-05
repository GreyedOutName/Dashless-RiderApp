import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeliveryItem {
  id: string;
  name: string;
  address: string;
  amount: number;
  status: "Pending" | "En Route" | "Arrived" | "Payment" | "Completed";
}

const dummyDeliveries: DeliveryItem[] = [
  { id: "1", name: "Juan Dela Cruz", address: "Makati City", amount: 240, status: "Pending" },
  { id: "2", name: "Maria Santos", address: "Quezon City", amount: 520, status: "En Route" },
  { id: "3", name: "Pedro Dizon", address: "Taguig City", amount: 150, status: "Arrived" },
  { id: "4", name: "Anna Robles", address: "Pasig City", amount: 310, status: "Payment" },
  { id: "5", name: "Ella Marcos", address: "Pasay City", amount: 420, status: "Completed" },
];

const { width } = Dimensions.get("window");

// Dynamic background color based on status
const statusColor = {
  Pending: "#EEE8FF",
  "En Route": "#DCD0FF",
  Arrived: "#C7B6FF",
  Payment: "#B69DFF",
  Completed: "#A685FF",
};

export default function DeliveryScreen({navigation}) {
  const [arrowLeft, setArrowLeft] = useState(false);

  const toggleArrowPosition = () => {
    setArrowLeft((prev) => !prev);
  };

  const renderItem = ({ item }: { item: DeliveryItem }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        { backgroundColor: statusColor[item.status] },
      ]}
      onPress={()=>navigation.navigate("OrderScreen", {
            name: item.name,
            address: item.address,
            amount: item.amount,
            status: item.status,
            })
        }
    >
      {/* Left arrow if toggle ON */}
      {arrowLeft && (
        <Ionicons
          name="arrow-forward-circle"
          size={32}
          color="#3A2D60"
          style={{ marginRight: 10 }}
        />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.amount}>₱{item.amount}</Text>

        {/* ⭐ New Status Field */}
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>

      {/* Right arrow if toggle OFF */}
      {!arrowLeft && (
        <Ionicons
          name="arrow-forward-circle"
          size={32}
          color="#3A2D60"
          style={{ marginLeft: 10 }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Your Deliveries</Text>
        <Text style={styles.headerSubtext}>
          View and manage your active deliveries for today.
        </Text>

        {/* Toggle Button */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleArrowPosition}>
          <Text style={styles.toggleText}>
            Arrow on {arrowLeft ? "Left" : "Right"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FlatList */}
      <FlatList
        data={dummyDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
  },

  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3A2D60",
  },

  headerSubtext: {
    fontSize: 15,
    marginTop: 6,
    color: "#7C6A94",
  },

  toggleButton: {
    marginTop: 15,
    backgroundColor: "#8F6BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: "flex-start",
  },

  toggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  listItem: {
    flexDirection: "row",
    width: width - 20,
    marginHorizontal: 10,
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A2D60",
  },

  address: {
    fontSize: 14,
    marginTop: 4,
    color: "#4C3D73",
  },

  amount: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: "600",
    color: "#3A2D60",
  },

  statusText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#3A2D60",
  },
});
