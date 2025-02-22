import React, { useState } from "react";
import { View, Text, Modal, FlatList, ScrollView, TouchableWithoutFeedback, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get('screen');

const UploadPrescriptionScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        validPrescriptionModal: false,
        prescriptionsList: [],
        deleteDialog: false,
        currentPrescriptionId: '',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        validPrescriptionModal,
        prescriptionsList,
        deleteDialog,
        currentPrescriptionId,
    } = state;

    const [uploadPrescriptionModal, setUploadPrescriptionModal] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            let newDataImg = prescriptionsList;
            let item = {
                id: Date.now(),
                url: result.assets[0].uri,
            };
            newDataImg.push(item);
            updateState({ prescriptionsList: newDataImg });
            setUploadPrescriptionModal(false);
        }
    };

    const pickImageFromCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted) {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true
            })

            if (!result.canceled) {
                let newDataImg = prescriptionsList;
                let item = {
                    id: Date.now(),
                    url: result.assets[0].uri,
                };
                newDataImg.push(item);
                updateState({ prescriptionsList: newDataImg });
                setUploadPrescriptionModal(false);
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0, }}
                >
                    {requestForUpload()}
                    {uploadMorePrescriptionButton()}
                    {

                        prescriptionsList.length != 0 ?
                            <View>
                                {pescriptionsAttachedInfo()}
                                {prescriptionImages()}
                                {contactInfo()}
                                {deletePrescriptionDialog()}
                            </View>
                            :
                            null
                    }
                    {validPrescriptionText()}
                </ScrollView>
                {continueButton()}
                {chooseFromCameraOrGalleryBox()}
                {validPrescriptionDemo()}
            </View>
        </View>
    )

    function contactInfo() {
        return (
            <View style={styles.contactInfoWrapStyle}>
                <Image
                    style={styles.doctorImageStyle}
                    source={require('../../assets/images/doctor.jpg')}
                />
                <View style={{ marginLeft: Sizes.fixPadding, width: width - 165.0, }}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 5.0, lineHeight: 20.0, ...Fonts.primaryColor17Regular }}>
                        Our Pharmacist will call you to confirm medicines from your prescriptions by
                    </Text>
                    <Text style={{ ...Fonts.primaryColor18Medium }}>
                        6:19 PM Today
                    </Text>
                </View>
            </View>
        )
    }

    function deletePrescriptionDialog() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteDialog}
                onRequestClose={() => {
                    updateState({ deleteDialog: false })
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        updateState({ deleteDialog: false })
                    }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={styles.dialogStyle}
                        >
                            <Text style={{
                                textAlign: 'center',
                                ...Fonts.blackColor19Medium,
                                paddingBottom: Sizes.fixPadding + 10.0
                            }}>
                                Delete prescription image?
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: Sizes.fixPadding * 2.0,
                            }}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => updateState({ deleteDialog: false })}
                                    style={styles.noButtonStyle}>
                                    <Text style={{ ...Fonts.primaryColor18Medium }}>
                                        No
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        removePrescription()
                                        updateState({ deleteDialog: false })
                                    }}
                                    style={styles.yesButtonStyle}>
                                    <Text style={{ ...Fonts.whiteColor18Medium }}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function pescriptionsAttachedInfo() {
        return (
            <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.primaryColor19Medium }}>
                Precriptions attached by you
            </Text>
        )
    }

    function prescriptionImages() {
        return (
            <FlatList
                horizontal
                data={prescriptionsList}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0, }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ width: 80, height: 105, marginRight: Sizes.fixPadding * 2.0, }}>
                        <Image
                            source={{ uri: item.url }}
                            style={{ width: 80, height: 105 }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                updateState({ currentPrescriptionId: item.id, deleteDialog: true })
                            }}
                            style={styles.prescriptionDeleteButtonStyle}>
                            <MaterialIcons name="close" size={20} color={Colors.whiteColor} />
                            <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.whiteColor15Regular }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        )
    }

    function removePrescription() {
        let filterArray = prescriptionsList.filter((val, i) => {
            if (val.id !== currentPrescriptionId) {
                return val;
            }
        })
        updateState({ prescriptionsList: filterArray })
    }

    function validPrescriptionDemo() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={validPrescriptionModal}
            >
                <TouchableWithoutFeedback>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.50)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <View style={{
                            width: width - 80.0,
                            backgroundColor: Colors.whiteColor,
                        }}>
                            <Image
                                source={require('../../assets/images/valid_prescription.png')}
                                style={{
                                    width: width - 80.0,
                                    height: height - 220,
                                    marginBottom: Sizes.fixPadding * 2.0,
                                }}
                                resizeMode="contain"
                            />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => updateState({ validPrescriptionModal: false })}
                                style={styles.okGotItButtonStyle}>
                                <Text style={{ ...Fonts.whiteColor19Medium }}>
                                    OK, GOT IT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function chooseFromCameraOrGalleryBox() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={uploadPrescriptionModal}
            >
                <TouchableWithoutFeedback>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.50)',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}>
                        <View style={styles.chooseFromCameraOrGalleryBoxStyle}>
                            <View style={styles.uploadPrescriptionModalHeaderStyle}>
                                <Text style={{ ...Fonts.primaryColor20Medium }}>
                                    Upload Prescription
                                </Text>
                                <MaterialIcons
                                    name="close"
                                    size={24}
                                    color={Colors.primaryColor}
                                    onPress={() => setUploadPrescriptionModal(false)}
                                />
                            </View>
                            <View style={styles.cameraAndGalleryButtonWrapStyle}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => { pickImageFromCamera() }}
                                    style={{
                                        ...styles.cameraAndGalleryButtonStyle,
                                        marginRight: Sizes.fixPadding,
                                    }}>
                                    <MaterialCommunityIcons name="camera-plus" size={24} color={Colors.primaryColor} />
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor19Medium }}>
                                        Camera
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => { pickImage() }}
                                    style={{
                                        ...styles.cameraAndGalleryButtonStyle,
                                        marginLeft: Sizes.fixPadding,
                                    }}
                                >
                                    <MaterialIcons name="photo-album" size={24} color={Colors.primaryColor} />
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor19Medium }}>
                                        Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function continueButton() {
        return (
            <View style={styles.continueButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => prescriptionsList.length != 0
                        ?
                        navigation.push('previouslyBoughtItems/previouslyBoughtItemsScreen')
                        :
                        null
                    }
                    style={styles.continueButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor19Medium }}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function validPrescriptionText() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => updateState({ validPrescriptionModal: true })}
            >
                <Text style={{ marginTop: Sizes.fixPadding * 3.0, ...Fonts.primaryColor15Regular, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                    What is a valid prescription
                </Text>
            </TouchableOpacity>
        )
    }

    function uploadMorePrescriptionButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setUploadPrescriptionModal(true)}
                style={styles.uploadMorePrescriptionButtonStyle}
            >
                <Text style={{ ...Fonts.primaryColor19Medium }}>
                    Upload More Prescription
                </Text>
            </TouchableOpacity>
        )
    }

    function requestForUpload() {
        return (
            <View style={{ flexDirection: 'row', margin: Sizes.fixPadding * 2.0, alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/icon_7.png')}
                    style={{ width: 30.0, height: 30.0, }}
                    resizeMode="contain"
                />
                <Text style={{ width: width - 85, paddingTop: Sizes.fixPadding, lineHeight: 22.0, marginLeft: Sizes.fixPadding, ...Fonts.primaryColor18Medium }}>
                    Please upload Images of your prescription
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.pop()}
                    />
                    <Text style={{
                        width: width / 1.7,
                        marginLeft: Sizes.fixPadding + 5.0,
                        ...Fonts.whiteColor19Medium
                    }}>
                        Upload Prescription
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons
                        name="search"
                        size={26}
                        color={Colors.whiteColor}
                        onPress={() => navigation.push('search/searchScreen')}
                    />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.push('cart/cartScreen')}
                    >
                        <MaterialIcons
                            name="shopping-cart"
                            size={26}
                            color={Colors.whiteColor}
                            style={{ marginLeft: Sizes.fixPadding + 10.0 }}
                        />
                        <View style={styles.cartItemCountWrapStyle}>
                            <Text style={{ ...Fonts.whiteColor15Regular, lineHeight: 21 }}>
                                1
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding,
    },
    cartItemCountWrapStyle: {
        position: 'absolute',
        right: -8.0,
        height: 17.0,
        width: 17.0,
        borderRadius: 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.redColor,
        elevation: 10.0,
    },
    continueButtonWrapStyle: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        position: 'absolute',
        left: 0.0,
        right: 0.0,
        bottom: 0.0,
        borderTopColor: Colors.bodyBackColor,
        borderTopWidth: 1.0,
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding
    },
    uploadMorePrescriptionButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: Colors.primaryColor, borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    cameraAndGalleryButtonWrapStyle: {
        backgroundColor: Colors.bodyBackColor,
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 4.0,
        borderBottomLeftRadius: Sizes.fixPadding,
        borderBottomRightRadius: Sizes.fixPadding,
    },
    cameraAndGalleryButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        justifyContent: 'center',
        flex: 1,
    },
    chooseFromCameraOrGalleryBoxStyle: {
        width: width - 20.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding
    },
    uploadPrescriptionModalHeaderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: 'space-between'
    },
    noButtonStyle: {
        backgroundColor: '#E0E0E0',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.0,
        marginRight: Sizes.fixPadding,
    },
    yesButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.0,
        marginLeft: Sizes.fixPadding,
    },
    deleteDialogWrapStyle: {
        width: width - 80.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        paddingBottom: Sizes.fixPadding * 2.0
    },
    doctorImageStyle: {
        width: 80.0,
        height: 80.0,
        borderRadius: 40.0,
        borderColor: 'rgba(0, 150, 136, 0.5)',
        borderWidth: 1.0,
        overflow: 'hidden'
    },
    contactInfoWrapStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
    },
    prescriptionDeleteButtonStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: Colors.blackColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    okGotItButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogStyle: {
        backgroundColor: Colors.whiteColor,
        alignSelf: 'center',
        width: '85%',
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 2.0
    }
});

export default UploadPrescriptionScreen;