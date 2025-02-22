import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Timeline from 'react-native-timeline-flatlist';
import MyStatusBar from "../../component/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";

const trackData = [
    { title: 'Order Accept', description: '21 Aug, 2020' },
    { title: 'Order Packed', description: '21 Aug, 2020' },
    { title: 'Order Dispatch', description: '22 Aug, 2020' },
    { title: 'Order Arriving at HealthMeda Fulfilment Center', description: '24 Aug, 2020' },
];

const { width } = Dimensions.get('screen');

const TrackOrderScreen = () => {

    const navigation = useNavigation();

    var { item } = useLocalSearchParams();
    item = JSON.parse(item);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                {productInfo()}
                {orderInfo()}
            </View>
        </View>
    )

    function productInfo() {
        return (
            <View
                style={styles.productInfoWrapStyle}>
                <Image
                    source={item.image}
                    style={{ width: 100.0, height: 100.0, }}
                    resizeMode="contain"
                />
                <View style={{ paddingTop: Sizes.fixPadding - 8.0, marginLeft: Sizes.fixPadding, width: width - 150, }}>
                    <Text style={{ lineHeight: 24.0, ...Fonts.primaryColor18Medium }}>
                        {item.name}
                    </Text>
                    <Text style={{ ...Fonts.grayColor17Regular }}>
                        Arriving: {item.arriving}
                    </Text>
                </View>
            </View>
        )
    }

    function orderInfo() {
        return (
            <Timeline
                data={trackData}
                showTime={false}
                circleColor={Colors.primaryColor}
                circleSize={12}
                lineColor={Colors.primaryColor}
                style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}
                titleStyle={{ ...Fonts.primaryColor15Medium }}
                descriptionStyle={{ ...Fonts.grayColor15Medium }}
                detailContainerStyle={{ marginTop: -12, }}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={Colors.whiteColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, ...Fonts.whiteColor19Medium }}>
                    Track Order
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    productInfoWrapStyle: {
        backgroundColor: Colors.bodyBackColor,
        flexDirection: 'row',
        padding: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    }
});

export default TrackOrderScreen;