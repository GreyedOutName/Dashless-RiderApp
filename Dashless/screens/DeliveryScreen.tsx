import React, { useState , useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  Pressable,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

// Dynamic background color based on status
const statusColor = {
  Pending: "#baa7ffff",
  "En Route": "#9d89daff",
  Arrived: "#7562b6ff",
  Payment: "#664ab9ff",
  Completed: "#7c7299ff",
};

const cityImages: { [key: string]: any } = {
  "Manila City": require("../assets/manila.jpg"),
  "Quezon City": require("../assets/quezon_city.jpg"),
  "Makati City": require("../assets/makati.jpg"),
  "Pasig City": require("../assets/pasig.jpg"),
  "Taguig City": require("../assets/taguig.jpg"),
  "Mandaluyong City": require("../assets/mandaluyong.jpg"),
  "Parañaque City": require("../assets/paranaque.jpg"),
  "C*l*ocan City": require("../assets/caloocan.jpg"),
  // add more cities as needed
};

export default function DeliveryScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [userid, setid] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDelivery, setNewDelivery] = useState<DeliveryItem | null>(null);

  const filipinoNames = ["Juan Dela Cruz", "Maria Santos", "Jose Rizal", "Ana Cruz", "Mark Reyes", "Ella Bautista", "Framancilio Banug Hari", "Mark Kuzunoha Santos"];
  const metroManilaAddresses = [
    "Quezon City", "Makati City", "Pasig City", "Taguig City", "Mandaluyong City", "Manila City", "Parañaque City", "C*l*ocan City"
  ];
  const statuses: DeliveryItem["status"][] = ["Pending"];

  // Randomizer helpers
  const getRandomArrayItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const getRandomCodAmount = () => Math.floor(Math.random() * 40 + 2) * 50; // 100-2000 in multiples of 50

  const generateRandomDelivery = (): DeliveryItem => ({
    id: Math.random().toString(36).substr(2, 9),
    rider_id: userid || "unknown",
    created_at: new Date().toISOString(),
    customer_name: getRandomArrayItem(filipinoNames),
    customer_address: getRandomArrayItem(metroManilaAddresses),
    cod_amount: getRandomCodAmount(),
    status: getRandomArrayItem(statuses),
    payment_type: 'cash'
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("user_id");
      if (value !== null) setid(value);
    } catch (e) {
      console.log("Error reading value");
    }
  };

  const getDeliveriesData = async () => {
    try {
      const response = await fetch(
        "https://dashless-backend-production.up.railway.app/orders_table",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch deliveries");
      setDeliveries(data);
    } catch (error: any) {
      console.error(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const newDeliveriesData = async (payment_type:string) =>{
    try {
      const response = await fetch("https://dashless-backend-production.up.railway.app/order-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...newDelivery, payment_type:payment_type}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      console.log("Order created:", data);
      Alert.alert("Success", `Order for ${newDelivery?.customer_name} added!`);

      await sendLocalNotification("There's a New Job for You!",`To ${newDelivery?.customer_address} for ${newDelivery?.customer_name}`)

      // Optional: refresh your deliveries list
      getDeliveriesData();
    } catch (error: any) {
      console.error(error.message);
      Alert.alert("Error", error.message);
    }
  }

  async function sendLocalNotification(title:string,body:string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: "default",
      },
      trigger: null, // null = fire immediately
    });
  }

  useEffect(() => {
    getData();
    getDeliveriesData();
  }, []);

  const renderItem = ({ item }: { item: DeliveryItem }) => {
    const cityImage = cityImages[item.customer_address] || null; // fallback if city not found

  return (
    <TouchableOpacity
      style={[
        styles.listItem,
        { backgroundColor: statusColor[item.status] || "#EEE" },
      ]}
      onPress={() =>
        navigation.navigate("OrderScreen", {
          id: item.id,
          name: item.customer_name,
          address: item.customer_address,
          amount: item.cod_amount,
          status: item.status,
          payment_type: item.payment_type,
        })
      }
    >
      {/* Optional Image Background */}
      {cityImage && (
        <Image
          source={cityImage}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            opacity: 0.8, 
            width: 100,  // fixed width
            height: 100, // fixed height
            alignSelf: 'center' 
          }} // fills the TouchableOpacity
          resizeMode="contain"
        />
      )}

      <View style={{ flex: 1, zIndex: 1, padding: 10 }}>
        <Text style={styles.name}>{item.customer_name}</Text>
        <Text style={styles.address}>{item.customer_address}</Text>
        <Text style={styles.amount}>₱{item.cod_amount}</Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.statusText}>
          Payment Type: {item.payment_type.toUpperCase()}
        </Text>
        <Text style={styles.dateText}>
          Added: {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>

      <Ionicons
        name="arrow-forward-circle"
        size={32}
        color="#3A2D60"
        style={{ marginLeft: 10, zIndex: 1 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Your Deliveries</Text>
          <Text style={styles.headerSubtext}>
            View and manage your active deliveries for today.
          </Text>
        </View>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              const generated = generateRandomDelivery();
              setNewDelivery(generated);
              setModalVisible(true);
            }}
          >
            <Text style={styles.toggleText}>Find Delivery Job</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delivery List */}
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ flex: 1 }}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {newDelivery && (
              <>
                <Text style={styles.modalTitle}>New Delivery For You!</Text>
                <Text style={styles.modalText}>
                  Here are the details for the delivery:
                </Text>
                <Text style={styles.infoText}>
                  Customer Name: {newDelivery.customer_name}
                </Text>
                <Text style={styles.infoText}>
                  Customer Address: {newDelivery.customer_address}
                </Text>
                <Text style={styles.infoText}>
                  COD Amount: ₱{newDelivery.cod_amount}
                </Text>

                <View style={[styles.buttonRow,{flexDirection:"column", gap:30}]}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={()=>{newDeliveriesData('cash');setModalVisible(false)}}
                  >
                    <Text style={styles.modalButtonText}>Take as Cash Payment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={()=>{newDeliveriesData('qrph');setModalVisible(false)}}
                  >
                    <Text style={styles.modalButtonText}>Take as QRPH Payment</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
    paddingTop: 30,
    paddingHorizontal: 16,
  },

  buttonRow: {
    flexDirection: "row",
    width:"100%",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  toggleButton: {
    backgroundColor: "#8F6BFF",
    paddingVertical: 12,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
  },

  modalButton: {
    backgroundColor: "#8F6BFF",
    borderRadius: 6,        // slightly rounded
    paddingVertical: 12,     // small vertical padding
    paddingHorizontal: 18,  // small horizontal padding
    alignItems: "center",
    alignSelf: "flex-end", // so it doesn’t stretch
    minWidth: 70,            // optional minimum width
  },

  toggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  headerSection: {
    marginBottom: 20,
  },

  headerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  headerTitle: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#3A2D60" 
  },

  headerSubtext: { 
    fontSize: 16, 
    marginTop: 6, 
    color: "#7C6A94" 
  },

  listItem: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000000ff",   // light purple border for cool effect
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ translateY: Math.random() * 5 }], // optional slight vertical offset
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffffff",
    textShadowColor: "rgba(0, 0, 0, 2)", // black with some opacity
    textShadowOffset: { width: 2, height: 2 }, // slight offset
    textShadowRadius: 1, // subtle blur
  },

  address: {
    fontSize: 14,
    marginTop: 4,
    color: "#ffffffff",
  },

  amount: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: "600",
    color: "#ffffffff",
  },

  statusText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffffff",
  },

  dateText: {
    fontSize: 11,
    color: "#ffffffff",
    marginTop: 4,
    opacity: 0.85,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#3A2D60',
  },
  modalButtonText: { color: "white", fontSize: 20, fontWeight: "600" },
});