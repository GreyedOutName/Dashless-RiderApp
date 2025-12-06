import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";

const { width } = Dimensions.get("window");

// Type for route params
type OrderScreenProps = {
  route: {
    params: {
      id: string;
      name: string;
      address: string;
      amount: number;
      status: string;
    };
  };
  navigation: any;
};

interface DeliveryItem {
  id: string;
  rider_id: string;
  created_at: string;
  customer_name: string;
  customer_address: string;
  cod_amount: number;
  status: "Pending" | "En Route" | "Arrived" | "Payment" | "Completed";
  payment_type: string;
}

const statusArray = ["Pending","En Route", "Arrived", "Payment", "Completed"]

export default function OrderScreen({ route, navigation }: OrderScreenProps) {
  const { id, name, address, amount, status, payment_type } = route.params;

  const updateOrderStatus = async (orderId: string, newStatus: DeliveryItem["status"]) => {
    try {
      const response = await fetch(
        `https://dashless-backend-production.up.railway.app/order-status/${orderId}`, // include id in URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      
      console.log("Order updated:", data.order);
      Alert.alert("Success", `Order status updated to ${newStatus}`);
      
      // Optional: refresh your deliveries list here
      // getDeliveriesData();

    } catch (error: any) {
      console.error(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const getNextStatus = (currentStatus: DeliveryItem["status"]): DeliveryItem["status"] => {
    const index = statusArray.indexOf(currentStatus);
    if (index === -1) throw new Error("Invalid status");
    
    // If it's the last status, return itself
    if (currentStatus === "Completed" || index === statusArray.length - 1) {
      return "Completed";
    }

    // Type assertion to tell TypeScript this is a valid status
    return statusArray[index + 1] as DeliveryItem["status"];
  };


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

        <Text style={styles.label}>Payment Type</Text>
        <Text style={styles.value}>{payment_type.toUpperCase()}</Text>
      </View>

      {/* Bottom Button */}
      {
        status !== "Payment" && status !== "Completed" ? (
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={async() => {
              await updateOrderStatus(id, getNextStatus(status as DeliveryItem["status"]));
              navigation.navigate('DeliveryScreen');
            }}
          >
            <Text style={styles.buttonText}>Advance Status</Text>
          </TouchableOpacity>
        ) : status === "Payment" ? (
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate('Payrex', { id:id, amount: amount * 100, name: name , payment_type: payment_type, status:status})}
          >
            <Text style={styles.buttonText}>Go to Payment Verification</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )
      }

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
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
