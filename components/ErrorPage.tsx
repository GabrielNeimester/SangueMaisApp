import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@gluestack-ui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

export default function ErrorPage() {

    function handleHome(): void {
        router.replace('')
    }

    return (
        <View style={styles.container}>
            <View style={styles.content_container}>
                <Text fontSize={24} color="#E31515" style={styles.tittle} marginTop={32}>Ops... </Text>
                <Text fontSize={24} color="#E31515" style={styles.tittle}>Ocorreu um erro ao carregar a página...</Text>
                <Icon name="sentiment-dissatisfied" size={160} color="#E31515" />
                <Text fontSize={20} style={styles.text}>Por favor aperte o botão abaixo para retornar a página inicial</Text>
            </View>
            <TouchableOpacity style={styles.button_primary}
                onPress={handleHome} >
                <Text style={styles.text_primary} fontSize={24}>Voltar para o início</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tittle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16
    },
    button_primary: {
        display: 'flex',
        backgroundColor: '#E31515',
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 32
    },
    text_primary: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
});