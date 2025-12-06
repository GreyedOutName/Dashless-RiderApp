import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , ActivityIndicator , TouchableOpacity, Alert} from 'react-native';
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";

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

export default function Payrex({ navigation, route }) {
  const { id , amount, name , payment_type, status:status_current } = route.params;
  const [clientSecret, setClientSecret] = useState(null);
  
  const createPaymentIntent = async () => {
    const res = await fetch(
      "https://dashless-backend-production.up.railway.app/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );

    const data = await res.json();
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  if (!clientSecret) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://js.payrexhq.com"></script>
    <style>
      /* Make the entire body a vertical flex container */
      body {
        display: flex;
        flex-direction: column;
        gap: 20px; /* spacing between elements */
        font-family: sans-serif;
        padding: 20px;
        min-height: 100vh;
        box-sizing: border-box;
      }

      h2, p {
        margin: 0;
      }

      #payment-element {
        width: 100%;
        min-height: 300px; /* initial space for payment content */
      }

      #confirm-btn {
        width: 100%;
        padding: 15px;
        border: none;
        border-radius: 8px;
        background: #6C47FF;
        color: white;
        font-size: 18px;
        font-weight: bold;
      }

      #status-text {
        font-size: 16px;
        color: #444;
      }

    </style>
  </head>

  <body>
    <h2>QRPH Payment</h2>
    <p>Scan the QR code to pay ₱${amount/100}</p>

    <div id="payment-element"></div>
    <button id="confirm-btn">Confirm Payment</button>
    <div id="status-text"></div>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const payrex = Payrex("pk_test_HXJEZ48JYw8rnGAnnCDXwgBFfuj4bvmQ");

        const elements = payrex.elements({
          clientSecret: "${clientSecret}",
        });

        const paymentElement = elements.create("payment",{
          defaultValues: {
            billingDetails: {
              email: "dummy@gmail.com",
              name: "${name}",
            }
          }
        });
        paymentElement.mount("#payment-element");

        document.getElementById("confirm-btn").addEventListener("click", async () => {
          document.getElementById("status-text").innerText = "Confirming payment...";

          try {
            const result = await payrex.attachPaymentMethod({
              elements,
              redirect: "none",
              options: {
                return_url: "https://dashless-landing-page.vercel.app/", 
              },
            });

            if (result?.error) {
              document.getElementById("status-text").innerText = "Payment Failed: " + result.error.message;
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                status: "failed",
                error: result.error.message,
              }));
              return;
            }

            document.getElementById("status-text").innerText = "Payment completed successfully!";
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              status: "success",
              paymentIntent: result?.payment_intent || null,
            }));
          } catch (err) {
            document.getElementById("status-text").innerText = "Unexpected error: " + err.message;
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              status: "failed",
              error: err.message,
            }));
          }
        });
      });
    </script>
  </body>
</html>

`;

  return (
    <View style={styles.outerWrapper}>
        {payment_type=="cash"?
          (
            <View style={styles.cashContainer}>
              <Text style={styles.cashText}>Cash Payment</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cashButton} onPress={()=>navigation.navigate('Camera',{id:id})}>
                  <Text style={styles.cashButtonText}>{`Verify Payment \n (Take Photo)`}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cashButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.cashButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
          :
          (
          <View style={styles.innerWrapper}>
          <WebView
            source={{ html }}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={{ borderRadius: 10 }}
            onMessage={async (event) => {
              const data = JSON.parse(event.nativeEvent.data);

              if (data.status === "success") {
                console.log("Payment success!", data.paymentIntent);
                await updateOrderStatus(id, getNextStatus(status_current as DeliveryItem["status"]))
                navigation.replace("PaymentSuccess");
              } else {
                console.log("Payment failed:", data.error);
                alert("Payment Failed: " + data.error);
              }
            }}
          />
          </View>
          )
        }
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  outerWrapper: {
    flex: 1,
    backgroundColor: "#8F6BFF", // Purple background
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  innerWrapper: {
    flex: 1,
    width: "100%",
    borderWidth: 15,   // thick white outline
    borderColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },

   cashContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cashText: {
    fontSize: 36,
    fontWeight: "700",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "column",
    gap: 30,
    justifyContent: "space-around",
    width: "80%",
  },
  cashButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  cashButtonText: {
    color: "#8F6BFF",
    fontSize: 18,
    fontWeight: "700",
  },
});


