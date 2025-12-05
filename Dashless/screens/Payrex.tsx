import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , ActivityIndicator } from 'react-native';
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";

export default function Payrex({ route }) {
  const { amount } = route.params;
  const [clientSecret, setClientSecret] = useState(null);

  // Fetch clientSecret from backend (Supabase Edge Function / Node.js backend)
  const createPaymentIntent = async () => {
    const res = await fetch(
      "https://YOUR-SUPABASE-PROJECT/functions/v1/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Build HTML that loads PayRex Elements
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://js.payrexhq.com/v1/payrex.js"></script>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          #payment-element { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2>QRPH Payment</h2>
        <p>Scan the QR code to pay ₱${amount / 100}</p>

        <div id="payment-element"></div>

        <script>
          const payrex = PayRex("YOUR_PUBLISHABLE_KEY");

          const elements = payrex.elements({
            clientSecret: "${clientSecret}"
          });

          const paymentElement = elements.create("payment");
          paymentElement.mount("#payment-element");
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html }}
      originWhitelist={["*"]}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}

