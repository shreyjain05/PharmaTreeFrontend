import { Tabs } from 'expo-router';
import React, { useState, useCallback } from "react";
import { BackHandler, View, Text, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../component/myStatusBar";

export default function TabLayout() {

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0)
    }, 1000)
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.companyPrimary,
          tabBarInactiveTintColor: Colors.grayColor,
          tabBarLabelStyle: {
            fontSize: 14.0,
            fontFamily: 'Mukta_Regular',
          },
          tabBarStyle: { ...styles.tabBarStyle },
          tabBarHideOnKeyboard: true,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{
                color: Colors.whiteColor,
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name='home/homeScreen'
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={27} color={color} />,
            tabBarLabel: 'Home'
          }}
        />
        <Tabs.Screen
          name='search/searchScreen'
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="search" size={27} color={color} />,
            tabBarLabel: 'Search'
          }}
        />
        <Tabs.Screen
          name='notifications/notificationsScreen'
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={27} color={color} />,
            tabBarLabel: 'Notifications'
          }}
        />
        <Tabs.Screen
          name='account/accountScreen'
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={27} color={color} />,
            tabBarLabel: 'Account'
          }}
        />
      </Tabs>
      {exitInfo()}
    </View>
  );

  function exitInfo() {
    return (
      backClickCount == 1
        ?
        <View style={styles.animatedView}>
          <Text style={{ ...Fonts.whiteColor15Regular }}>
            Press back once again to exit
          </Text>
        </View>
        :
        null
    )
  }
}

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: '#333333',
    position: "absolute",
    bottom: 20,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    height: 70.0,
    elevation: 3.0,
    borderColor: '#cccccc',
    borderTopWidth: 1.0,
    borderLeftWidth: 1.0,
    borderRightWidth: 1.0,
    borderTopLeftRadius: Sizes.fixPadding + 10.0,
    borderTopRightRadius: Sizes.fixPadding + 10.0,
    paddingTop: Sizes.fixPadding - 5.0,
    paddingBottom: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
  }
})
