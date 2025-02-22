import React, { useState, useContext, useEffect, updateState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { TextInput } from "react-native-paper";
import { useNavigation } from "expo-router";
import {
  User,
  ChevronRight,
  ListChecks,
  PlusCircle,
  Upload,
  CreditCard,
  FileText,
  Package,
  Percent,
  CreditCardIcon,
  Info,
  Clock,
  Target,
} from "lucide-react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Card, Dialog } from "react-native-paper";
import { CheckCircle, XCircle, Search } from "lucide-react";

const { width } = Dimensions.get("screen");

const DrugLicenseApprovalScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useContext(AppContext);

  console.log("Is user Admin :", isAdmin);

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  console.log("Current Users:" + JSON.stringify(users));
  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/customer`)
      .then((res) => res.json())
      .then((data) => {
        const filteredUsers = data.filter((user) => user.active === false);
        setUsers(filteredUsers);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);



  function updateCustomer() {
      fetch(`${BASE_URL}/api/v1/customer`)
        .then((res) => res.json())
        .then((data) => {
          const filteredUsers = data.filter((user) => user.active === false);
          setUsers(filteredUsers);
        })
  }

  function successDialog() {
    return (
        <Dialog
            visible={showSuccessDialog}
            style={styles.dialogWrapStyle}
        >
            <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                <View style={styles.successIconWrapStyle}>
                    <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
                </View>
                <Text style={{ ...Fonts.grayColor18Medium, marginTop: Sizes.fixPadding + 10.0 }}>
                    Drug License Status has been updated!
                </Text>
            </View>
        </Dialog>
    )
}

  function handleApproval(id) {
    console.log("Approving customer", id)
     fetch(`${BASE_URL}/api/v1/customer/approval`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ customerId: id, approved: true }),
     })
       .then((res) => res.json())
       .then(() => {console.log("Approved");
       updateCustomer() // update user list after approval
       updateState({ showSuccessDialog: true })
       setTimeout(() => {
           updateState({ showSuccessDialog: false })
           navigation.push('/DrugLicenseApprovalScreen');
       }, 2000);})
       .catch((err) => console.error(err));
  }

  function handleRejection(id) {
    console.log("Rejecting customer", id)
    fetch(`${BASE_URL}/api/v1/customer/approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: id, approved: true }),
    })
      .then((res) => res.json())
      .then(() => {console.log("Approved");
      updateCustomer() // update user list after approval
      updateState({ showSuccessDialog: true })
      setTimeout(() => {
          updateState({ showSuccessDialog: false })
          navigation.push('/DrugLicenseApprovalScreen');
      }, 2000);})
      .catch((err) => console.error(err));
  }

  const [state, setState] = useState({
          showSuccessDialog: false,
          logout: false,
      })
  
      const updateState = (data) => setState((state) => ({ ...state, ...data }))
  
      const {
          showSuccessDialog,
          logout,
      } = state;

  function adminPanelButton(title, icon, screenName) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push(screenName)}
        style={styles.adminPanelButtonStyle}
      >
        {/* {icon}
                    <Text style={{ ...Fonts.primaryColor19Medium, marginLeft: 10 }}>
                        {title}
                    </Text>
                    */}
        {/* Left Arrow Icon */}

        {/* Icon inside Circle */}
        <View style={styles.iconContainer}>{icon}</View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        <ChevronRight size={24} color="#0B678C" style={styles.leftArrow} />

        {/* Bottom Separator */}
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        {header()}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ ...Fonts.whiteColor16Regular }}>Save</Text>
        </TouchableOpacity>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {/* {nameAndMobileNumberInfo()}
                        {activeOrderButton()}
                        {logoutButton()} */}
          {/* <Text style={styles.heading}>Admin Panel</Text> */}
          <Card
            style={{
              padding: 25,
              marginBottom: 20,
              borderRadius: 20,
              elevation: 5,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#10857F",
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              🔍 Pending License Approval
            </Text>
          </Card>
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
            animationType="fade"
          >
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1729505622656-6da75375c3a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} style={styles.largeImage} />
              </View>
            </TouchableOpacity>
          </Modal>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                style={{
                  padding: 20,
                  margin: 15,
                  borderRadius: 15,
                  backgroundColor: "#FFFFFF",
                  elevation: 3,
                }}
              >
                {item.status === "INACTIVE" ? (
                  <View style={{ padding: 16 }}>
                    {/* Centered Name */}
                    <View style={{ alignItems: "center", marginBottom: 10 }}>
                      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#10857F" }}>
                        {item.firstName} {item.lastName}
                      </Text>
                    </View>

                    {/* License Information in Single Line */}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Drug License 20B
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Drug License 21B
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Food License
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.drugLicenseNumber20B}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.drugLicenseNumber21B}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.foodLicenseNumber}
                      </Text>
                    </View>

                    {/* Action Buttons */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleApproval(item.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#10857F",
                          padding: 12,
                          borderRadius: 10,
                          flex: 1,
                          marginRight: 5,
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircle
                          size={20}
                          color="#FFFFFF"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                          Approve
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleRejection(item.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#10857F",
                          padding: 12,
                          borderRadius: 10,
                          flex: 1,
                          marginHorizontal: 5,
                          justifyContent: "center",
                        }}
                      >
                        <XCircle
                          size={20}
                          color="#FFFFFF"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                          Reject
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#10857F",
                          padding: 12,
                          borderRadius: 10,
                          flex: 1,
                          marginLeft: 5,
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircle
                          size={20}
                          color="#FFFFFF"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                          View License
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: item.status === "Approved" ? "#2E7D32" : "#D32F2F",
                      textAlign: "center",
                    }}
                  >
                    {item.status}
                  </Text>
                )}
              </Card>
            )}
          />
          
        </ScrollView>
        
        {logoutDialog()}
      </View>
      {successDialog()}
    </View>
  );

  function logoutDialog() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={logout}
        onRequestClose={() => {
          updateState({ logout: false });
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            updateState({ logout: false });
          }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={{ ...styles.logoutDialogWrapStyle }}
            >
              <Text
                style={{
                  ...Fonts.blackColor19Medium,
                  paddingBottom: Sizes.fixPadding + 10.0,
                }}
              >
                Are You sure want to logout?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => updateState({ logout: false })}
                  style={styles.cancelButtonStyle}
                >
                  <Text style={{ ...Fonts.primaryColor18Medium }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    updateState({ logout: false });
                    navigation.push("auth/signinScreen");
                  }}
                  style={styles.dialogLogoutButtonStyle}
                >
                  <Text style={{ ...Fonts.whiteColor18Medium }}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function logoutButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => updateState({ logout: true })}
        style={styles.logoutButtonStyle}
      >
        <Text style={{ ...Fonts.primaryColor19Medium }}>Logout</Text>
      </TouchableOpacity>
    );
  }

  function activeOrderButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push("activeOrders/activeOrdersScreen")}
        style={styles.activeOrderButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor19Medium }}>Active Orders</Text>
      </TouchableOpacity>
    );
  }

  function nameAndMobileNumberInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}
      >
        {nameTextField()}
        {mobileNumberTextField()}
      </View>
    );
  }

  function mobileNumberTextField() {
    return (
      <TextInput
        label="Mobile Number"
        value={mobileNumber}
        onChangeText={(text) => updateState({ mobileNumber: text })}
        mode="outlined"
        style={{
          height: 50.0,
          ...Fonts.primaryColor17Medium,
          backgroundColor: Colors.whiteColor,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        outlineColor={Colors.grayColor}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: { primary: Colors.primaryColor, underlineColor: "#C5C5C5" },
        }}
        keyboardType="phone-pad"
      />
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={(text) => updateState({ name: text })}
        style={{
          height: 50.0,
          ...Fonts.primaryColor17Medium,
          backgroundColor: Colors.whiteColor,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
        outlineColor={Colors.grayColor}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: { primary: Colors.primaryColor, underlineColor: "#C5C5C5" },
        }}
      />
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.whiteColor}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              ...Fonts.whiteColor19Medium,
              marginLeft: Sizes.fixPadding + 5.0,
            }}
          >
            Drug License Approval
          </Text>
        </View>
        {/* <MaterialIcons
            name="search"
            size={24}
            color={Colors.whiteColor}
            onPress={() => navigation.push("search/searchScreen")}
            /> */}
      </View>
    );
  }
};

const ApprovalCard = ({ imageUri, onAccept, onReject }) => {
  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAccept = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to accept the license?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            onAccept();
            setStatus("accepted");
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to reject the license?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            onReject();
            setStatus("rejected");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {/* <Image source={{ uri: imageUri }} style={styles.image} /> */}
      </TouchableOpacity>
      {/* <Text style={styles.description}>Click to show full image</Text> */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: imageUri }} style={styles.largeImage} />
          </View>
        </TouchableOpacity>
      </Modal>
      {status === null ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAccept}>
            <Text style={styles.buttonText}>✔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReject}>
            <Text style={styles.buttonText}>✖</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.statusText}>
          {status === "accepted" ? "Accepted License" : "Rejected License"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  activeOrderButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: 'center',
},
  logoutButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginRight: Sizes.fixPadding,
  },
  dialogLogoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginLeft: Sizes.fixPadding,
  },
  logoutDialogWrapStyle: {
    width: width - 80.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    padding: Sizes.fixPadding * 2.0,
    alignSelf: "center",
  },
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // Optional: Ensures a clean background
    // paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0B678C",
    textAlign: "left", // Change to "center" if needed
    // marginVertical: 30,
    backgroundColor: "#E0F4FF",
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginBottom: 10,
  },
  adminPanelButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  leftArrow: {
    marginRight: 10, // Spacing between arrow and icon
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F4FF", // Lighter shade of #0B678C
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  largeImage: { width: 300, height: 300, resizeMode: "contain" },
  description: {
    fontSize: 14,
    color: "#555",
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    flex: 1,
    fontSize: 19,
    color: "#0B678C",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Light grey separator
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 20,
  },
});

export default DrugLicenseApprovalScreen;
