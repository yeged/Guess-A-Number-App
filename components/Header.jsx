import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Colors from "../constants/Colors"

function Header(props) {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 90,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingTop: 36
    },
    headerTitle: {
        fontSize:18,
        color: "black"
    }

})

export default Header;