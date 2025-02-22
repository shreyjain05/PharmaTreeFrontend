import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, LogBox, StatusBar } from 'react-native';
import AppProvider from './context/AppProvider'


LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    Mukta_Light: require("../assets/fonts/mukta/Mukta-Light.ttf"),
    Mukta_Medium: require("../assets/fonts/mukta/Mukta-Medium.ttf"),
    Mukta_Regular: require("../assets/fonts/mukta/Mukta-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const subscription = AppState.addEventListener("change", (_) => {
      StatusBar.setBarStyle("light-content");
    });
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/signinScreen" options={{ gestureEnabled: false }} />
        <Stack.Screen name="auth/registerScreen" />
        <Stack.Screen name="auth/verificationScreen" />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="search/searchScreen" />
        <Stack.Screen name="chooseLocation/chooseLocationScreen" />
        <Stack.Screen name="addAddress/addAddressScreen" />
        <Stack.Screen name="offers/offersScreen" />
        <Stack.Screen name="offerDetail/offerDetailScreen" />
        <Stack.Screen name="cart/cartScreen" />
        <Stack.Screen name="orderMedicines/orderMedicinesScreen" />
        <Stack.Screen name="selectAddress/selectAddressScreen" />
        <Stack.Screen name="previouslyBoughtItems/previouslyBoughtItemsScreen" />
        <Stack.Screen name="productDescription/productDescriptionScreen" />
        <Stack.Screen name="availableProduct/availableProductScreen" />
        <Stack.Screen name="filter/filterScreen" />
        <Stack.Screen name="uploadPrescription/uploadPrescriptionScreen" />
        <Stack.Screen name="activeOrders/activeOrdersScreen" />
        <Stack.Screen name="trackOrder/trackOrderScreen" />
        <Stack.Screen name="payment/paymentScreen" />
        <Stack.Screen name="termsAndConditions/termsAndConditionsScreen" />

        <Stack.Screen name="adminPanel/CustomerInformationScreen" />
        <Stack.Screen name="adminPanel/OrderStatusChangeScreen" />
        <Stack.Screen name="adminPanel/CreateOrderAdminScreen" />
        <Stack.Screen name="adminPanel/UploadAllStockScreen" />
        <Stack.Screen name="adminPanel/PaymentsInformationScreen" />
        <Stack.Screen name="adminPanel/InvoiceInformationScreen" />
        <Stack.Screen name="adminPanel/InventoryInformationScreen" />
        <Stack.Screen name="adminPanel/ChemistDiscountConfigScreen" />
        <Stack.Screen name="adminPanel/ChemistPaymentOptionScreen" />
        <Stack.Screen name="adminPanel/OrderInformationScreen" />
        <Stack.Screen name="adminPanel/GracePeriodSettingScreen" />
        <Stack.Screen name="adminPanel/TargetsSettingScreen" />
        <Stack.Screen name="adminPanel/DrugLicenseApprovalScreen" />
        <Stack.Screen name="adminPanel/AdminProductScreen" />
        <Stack.Screen name="allProducts/allProducts" />
      </Stack>
    </AppProvider>
  );
}
