import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Stack, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabHome() {
  const [data, setData] = React.useState<
    { id: number; name: string; email: string }[]
  >([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const headerRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/modal")}
      style={{ marginRight: 10 }}
    >
      <FontAwesome name="plus-circle" size={28} color="blue" />
    </TouchableOpacity>
  );

  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      name: string;
      email: string;
    }>("SELECT * FROM users");
    setData(result);
  };

  const handleDelete = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM users WHERE id = ?;", [id]);
      await loadData(); // refresh list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "crimson" },
          headerTintColor: "white",
          title: "Home",
          headerRight,
        }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => router.push(`/modal?id=${item.id}`)}
                  style={[styles.button, { backgroundColor: "crimson" }]}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={[styles.button, { backgroundColor: "blue" }]}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDD0", // cream background
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "crimson",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "crimson",
  },
  email: {
    fontSize: 14,
    color: "slategray",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    height: 30,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});