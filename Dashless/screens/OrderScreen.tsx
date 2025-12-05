import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// Type for route params
type OrderScreenProps = {
  route: {
    params: {
      name: string;
      address: string;
      amount: number;
      status: string;
    };
  };
  navigation: any;
};

export default function OrderScreen({ route, navigation }: OrderScreenProps) {
  const { name, address, amount, status } = route.params;

  return (
    <View style={styles.container}>
      {/* Main Centered Content */}
      <View style={styles.card}>
        <Text style={styles.title}>Order Details</Text>

        <Text style={styles.label}>Customer Name</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{address}</Text>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>₱{amount}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Deliveries</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: width * 0.88,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3A2D60",
    marginBottom: 25,
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    color: "#7C6A94",
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A2D60",
    marginTop: 3,
  },

  bottomButton: {
    marginTop: 40,
    backgroundColor: "#8F6BFF",
    width: width * 0.85,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
