import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Address of the Express backend. On a real phone, "localhost" is the phone
// itself, so put your computer's local IP in mobile/.env (see .env.example).
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4200";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/weather?city=${encodeURIComponent(city.trim())}`
      );

      if (!response.ok) {
        setWeatherData(null);
        setError(response.status === 404 ? "City not found" : "Weather service error");
        return;
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error(err);
      setWeatherData(null);
      setError("Failed to connect to the weather server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>☁️ Weather App</Text>
          <Text style={styles.subtitle}>Check the weather in your city</Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              placeholderTextColor="#94a3b8"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            <Pressable
              onPress={handleSearch}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>{loading ? "..." : "Search"}</Text>
            </Pressable>
          </View>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#60a5fa" />
              <Text style={styles.loadingText}>Loading weather...</Text>
            </View>
          )}

          {weatherData && !loading && (
            <View style={styles.result}>
              <View style={styles.resultHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.city}>{weatherData.city}</Text>
                  <Text style={styles.muted}>Country: {weatherData.country}</Text>
                </View>
                <Text style={styles.icon}>🌤️</Text>
              </View>

              <Text style={styles.temperature}>
                {weatherData.weather.temperature_2m} {weatherData.units.temperature_2m}
              </Text>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>💧 Humidity</Text>
                  <Text style={styles.statValue}>
                    {weatherData.weather.relative_humidity_2m} {weatherData.units.relative_humidity_2m}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>💨 Wind speed</Text>
                  <Text style={styles.statValue}>
                    {weatherData.weather.wind_speed_10m} {weatherData.units.wind_speed_10m}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {error !== "" && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#020617" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0f172a", borderRadius: 20, padding: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#94a3b8", marginTop: 6, marginBottom: 24 },
  searchRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonPressed: { backgroundColor: "#1d4ed8" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: { color: "#60a5fa", fontWeight: "500" },
  result: { backgroundColor: "#1e293b", borderRadius: 14, padding: 20, marginTop: 20 },
  resultHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  city: { color: "#fff", fontSize: 24, fontWeight: "700" },
  muted: { color: "#94a3b8", marginTop: 2 },
  icon: { fontSize: 44 },
  temperature: { color: "#fff", fontSize: 48, fontWeight: "700", marginBottom: 20 },
  divider: { height: 1, backgroundColor: "#334155", marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 16 },
  stat: { flex: 1 },
  statLabel: { color: "#94a3b8", fontSize: 13, marginBottom: 4 },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "600" },
  error: {
    marginTop: 16,
    color: "#f87171",
    backgroundColor: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
});
