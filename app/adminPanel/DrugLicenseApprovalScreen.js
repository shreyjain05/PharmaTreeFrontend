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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Card, Dialog } from "react-native-paper";

const { width } = Dimensions.get("screen");

const DrugLicenseApprovalScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useContext(AppContext);

  console.log("Is user Admin :", isAdmin);

  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState("");

  const [users, setUsers] = useState([]);
  console.log("Current Users:" + JSON.stringify(users));

  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/customer`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Received Response", data);
        const filteredUsers = data.filter((user) => user.active === false);
        setUsers(filteredUsers);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleApproval = (userId, status) => {
    setSelectedUserId(userId);
    setSelectedStatus(status);
    console.log("Received status:", status);
    setApprovalModalVisible(true);
  };

  const confirmApproval = () => {
    // Call API or update status here
    handleApprovalStatus();
    console.log(
      `Status changed for user ${selectedUserId} to ${selectedStatus}`
    );
    setApprovalModalVisible(false);
  };

  function updateCustomer() {
    fetch(`${BASE_URL}/api/v1/customer`)
      .then((res) => res.json())
      .then((data) => {
        const filteredUsers = data.filter((user) => user.active === false);
        setUsers(filteredUsers);
      });
  }

  function successDialog() {
    return (
      <Dialog visible={showSuccessDialog} style={styles.dialogWrapStyle}>
        <View
          style={{ backgroundColor: Colors.whiteColor, alignItems: "center" }}
        >
          <View style={styles.successIconWrapStyle}>
            <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
          </View>
          <Text
            style={{
              ...Fonts.grayColor18Medium,
              marginTop: Sizes.fixPadding + 10.0,
            }}
          >
            Drug License Status has been updated!
          </Text>
        </View>
      </Dialog>
    );
  }

  function handleApprovalStatus() {
    console.log(
      "Updating customer with Status",
      selectedUserId,
      selectedStatus
    );
    fetch(`${BASE_URL}/api/v1/customer/approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: selectedUserId,
        approved: selectedStatus,
        comments: comment,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        updateCustomer(); // update user list after approval
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          navigation.push("adminPanel/DrugLicenseApprovalScreen");
        }, 2000);
      })
      .catch((err) => console.error(err));
  }

  const [state, setState] = useState({
    showSuccessDialog: false,
    logout: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showSuccessDialog, logout } = state;

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
              margin: 10,
              borderRadius: 20,
              elevation: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
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
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1729505622656-6da75375c3a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={styles.largeImage}
                />
              </View>
            </TouchableOpacity>
          </Modal>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                {item.status === "INACTIVE" && (
                  <View style={{ padding: 16 }}>
                    <View style={styles.centeredText}>
                      <Text style={styles.nameText}>
                        {item.firstName} {item.lastName}
                      </Text>
                    </View>

                    <View style={styles.licenseRow}>
                      <Text style={styles.licenseText}>Drug License 20B</Text>
                      <Text style={styles.licenseText}>Drug License 21B</Text>
                      <Text style={styles.licenseText}>Food License</Text>
                    </View>

                    <View style={styles.licenseRow}>
                      <Text style={styles.licenseText}>
                        {item.drugLicenseNumber20B}
                      </Text>
                      <Text style={styles.licenseText}>
                        {item.drugLicenseNumber21B}
                      </Text>
                      <Text style={styles.licenseText}>
                        {item.foodLicenseNumber}
                      </Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        onPress={() => handleApproval(item.id, "Approved")}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Approve</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleApproval(item.id, "Rejected")}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleApproval(item.id, "Review")}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Review</Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.commentBox}
                      placeholder="Add a comment..."
                      value={comment}
                      onChangeText={setComment}
                      placeholderTextColor="#777"
                    />

                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={styles.viewButton}
                    >
                      <Text style={styles.buttonText}>View License</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Approval Confirmation Modal */}
                <Modal
                  visible={approvalModalVisible}
                  transparent={true}
                  animationType="slide"
                >
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>
                        Confirm Status Change
                      </Text>
                      <Text style={styles.modalText}>
                        Are you sure you want to change status to{" "}
                        {selectedStatus}?
                      </Text>

                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          onPress={confirmApproval}
                          style={styles.modalButton}
                        >
                          <Text style={styles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setApprovalModalVisible(false)}
                          style={styles.modalButtonCancel}
                        >
                          <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </Card>
            )}
          />
        </ScrollView>
      </View>
      {successDialog()}
    </View>
  );

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
    alignSelf: "center",
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
  card: {
    padding: 20,
    margin: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  centeredText: {
    alignItems: "center",
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10857F",
  },
  licenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  licenseText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10857F",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10857F",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  commentBox: {
    marginTop: 10,
    height: 40, // Keeps it compact
    borderWidth: 1,
    borderColor: "#10857F",
    borderRadius: 5, // Fully rounded on all sides
    paddingHorizontal: 15, // Added padding for better text alignment
    backgroundColor: "#F8F8F8",
    fontSize: 14,
    color: "#10857F",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Light shadow effect
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  largeImage: {
    width: 300,
    height: 400,
    resizeMode: "contain",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#10857F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DrugLicenseApprovalScreen;
