import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

export default function App({route}) {
  const {id} = route.params
  const navigation = useNavigation<any>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<React.ElementRef<typeof CameraView>>(null);

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

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo.uri);
      // Navigate to DeliveryScreen after photo
      await updateOrderStatus(id,getNextStatus("Payment" as DeliveryItem["status"]))
      navigation.navigate('DeliveryScreen');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000' }, // black background for contrast
  message: { textAlign: 'center', paddingBottom: 10, color: '#fff' },
  camera: {
    flex: 1,
    margin: 16,              // space around the camera
    borderRadius: 20,        // rounded corners
    borderWidth: 4,          // black border thickness
    borderColor: '#000',     // black border
    overflow: 'hidden',      // ensure corners are clipped
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: '#8F6BFF', // nice purple button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: { fontSize: 18, fontWeight: 'bold', color: 'white' },
});
