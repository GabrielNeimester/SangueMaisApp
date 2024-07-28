import { ScrollView, StyleSheet, View } from "react-native";
import { Heading, Text } from '@gluestack-ui/themed';
import { useEffect, useState } from "react";
import { api } from "../config/api";
import { useLocalSearchParams } from 'expo-router';

interface IHemocentro {
    _id: string;
    cnpj: string;
    nome: string;
    estado: string;
    cidade: string;
    bairro: string;
    telefone: string;
    email: string;
    ativo: boolean;
}

export default function HemocentroDetalhes() {
    const { id } = useLocalSearchParams();
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchHemocentro = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setHemocentro(data);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(`Failed to fetch data: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHemocentro();
    }, [id]);

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Text>Loading...</Text>
                </View>
            ) : hemocentro ? (
                <View style={styles.detailsContainer}>
                    <Heading fontSize={24} style={styles.title}>{hemocentro.nome}</Heading>
                    <Text fontSize={16}><Text style={styles.label}>CNPJ:</Text> {hemocentro.cnpj}</Text>
                    <Text fontSize={16}><Text style={styles.label}>Cidade:</Text> {hemocentro.cidade}</Text>
                    <Text fontSize={16}><Text style={styles.label}>Estado:</Text> {hemocentro.estado}</Text>
                    <Text fontSize={16}><Text style={styles.label}>Bairro:</Text> {hemocentro.bairro}</Text>
                    <Text fontSize={16}><Text style={styles.label}>Telefone:</Text> {hemocentro.telefone}</Text>
                    <Text fontSize={16}><Text style={styles.label}>Email:</Text> {hemocentro.email}</Text>
                </View>
            ) : (
                <Text style={styles.error}>{error ? error : "Hemocentro não encontrado"}</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 16,
    },
    label: {
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 16,
    },
    spinner: {
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
