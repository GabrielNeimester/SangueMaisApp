import React from "react";
import { View, StyleSheet } from "react-native";
import { Heading, Text } from "@gluestack-ui/themed";
import { IHemocentro } from "../interfaces/hemocentro";

interface HemocentroHeaderProps {
    hemocentro: IHemocentro;
}

export default function HemocentroHeader({ hemocentro }: HemocentroHeaderProps) {
    return (
        <View style={styles.container}>
            <Heading fontSize={24} style={styles.title}>{hemocentro.nome}</Heading>
            <Text fontSize={16}>{hemocentro.cnpj}</Text>
            <View style={styles.cidade}>
                <Text fontWeight={'700'} fontSize={16}>{hemocentro.cidade} - {hemocentro.estado}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        marginBottom: 8,
    },
    cidade: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
