import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";

export default function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logoImage}
        source={require("../assets/DashlessLogo.png")}
      />

      <Text style={styles.title}>Welcome Back Rider!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")} // <-- FIXED NAME
      >
        <Text style={styles.buttonText}>Go to your Dashboard</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF", // light lavender
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain", // <-- Fixes distortion
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3A2D60",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#8F6BFF",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});


