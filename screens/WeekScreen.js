import React from "react";
import { Text, View, StyleSheet } from "react-native";

const WeekScreen = () => {
  return (
    <View style={styles.container}>
      <Text>WeekScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WeekScreen;
