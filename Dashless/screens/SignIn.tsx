import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import React, { useState } from "react";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [offset,setOffset] = useState(false)
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://dashless-backend-production.up.railway.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!data.session || !data.user) {
        return Alert.alert("Login failed", "Invalid credentials");
      }

      await AsyncStorage.setItem("token", data.session.access_token);
      await AsyncStorage.setItem("user_id", data.user.id);
      navigation.navigate("Splash");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Login failed", error.message);
    }
  };

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS uses padding, Android height
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="light" />
      <Image
        style={styles.logoImage}
        source={require("../assets/DashlessLogo.png")}
      />
      <Text style={styles.logoTitle}>DASHLESS</Text>
      <Text style={styles.title}>Welcome Back, Rider!</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9B95B8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9B95B8"
        value={password}
        onFocus={() => setOffset(true)}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF", // light lavender
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3A2D60",
    marginBottom: 30,
  },

  logoTitle: {
    color: "#8F6BFF",
    fontWeight: "bold",
    fontSize: 32,
    textTransform: "uppercase",
    marginBottom: 20, // adjust spacing below
    position: "relative",
    top: -80, // move it upwards, overlapping the logo
  },

  input: {
    width: "100%",
    backgroundColor: "#EDE8F9",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#3A2D60",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  button: {
    backgroundColor: "#8F6BFF",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#8F6BFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

