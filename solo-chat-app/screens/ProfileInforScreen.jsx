import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Input } from "react-native-elements";

import { useNavigation } from "@react-navigation/core";

const ProfileInforScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Pressable onPress={navigation.navigate("Home")}>
        <Text>Please provide your name and an optional profile picture </Text>
      </Pressable>
      <Input placeholder="Type your name here" />
    </View>
  );
};

export default ProfileInforScreen;
