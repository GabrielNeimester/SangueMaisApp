import { ScrollView, StyleSheet, View } from "react-native";
import { Button, ButtonText, Divider, Heading, Spinner, Text } from '@gluestack-ui/themed';
import { useEffect, useState } from "react";
import { api } from "../config/api";
import { router, useLocalSearchParams } from 'expo-router';
import { IHemocentro } from "../interfaces/hemocentro";

export default function HemocentroDetalhes() {
    const { id } = useLocalSearchParams();
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    function handleHemocentroData(id: string): void {
        router.push({ pathname: 'agendamentoData', params: { id } });
      }

    useEffect(() => {
        const fetchHemocentro = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`)
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`)
                }
                const data = await response.json();
                setHemocentro(data)
            } catch (err: any) {
                setError(`Ops...Ocorreu um erro ao carregar a página...`)
            } finally {
                setIsLoading(false)
            }
        };

        fetchHemocentro();
    }, [id]);

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            ) : hemocentro ? (
                <View style={styles.detailsContainer}>
                    <Heading fontSize={24} style={styles.title}>{hemocentro.nome}</Heading>
                    <Text fontSize={16}>{hemocentro.cnpj}</Text>
                    <View style={styles.cidade}>
                        <Text fontWeight={'700'} fontSize={16}>{hemocentro.cidade} - {hemocentro.estado}</Text>
                    </View>
                    <Heading>Contatos</Heading>
                    <Divider my="$1" bgColor="#000000" />
                    <View style={styles.contatos}>
                        <Text fontSize={16}>{hemocentro.telefone}</Text>
                        <Text fontSize={16}>{hemocentro.email}</Text>
                    </View>
                    <Button style={styles.button}>
                        <ButtonText fontSize={24} onPress={ () => handleHemocentroData(hemocentro._id)}>Agendar Doação</ButtonText>
                    </Button>
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
        marginBottom: 8,
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
    button: {
        backgroundColor: '#E31515',
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        height: 'auto'
    },
    cidade:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'flex-end'
    },
    contatos:{
        marginTop:16,
        marginBottom:32
    }
});

