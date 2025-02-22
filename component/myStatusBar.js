import { SafeAreaView, StatusBar } from "react-native";
import React from "react";
import { Colors } from "../constant/styles";

const MyStatusBar = () => {
  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryColor }}>
      <StatusBar
        translucent={false}
        // backgroundColor={Colors.primaryColor}
        backgroundColor="black"
        barStyle={"light-content"}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;