import { ScrollView, StyleSheet, View } from "react-native"
import { Button, ButtonText, Divider, Heading, Spinner, Text } from '@gluestack-ui/themed'
import { useEffect, useState } from "react"
import { api } from "../config/api"
import { router, useLocalSearchParams } from 'expo-router'
import { IHemocentro } from "../interfaces/hemocentro"
import HemocentroHeader from "../components/HemocentroHeader"
import ErrorComponent from "../components/ErrorComponent"

export default function HemocentroDetalhes() {
    const { id } = useLocalSearchParams()

    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null)
    const [error, setError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    function handleHemocentroData(id: string): void {
        router.push({ pathname: 'agendamentoData', params: { id } })
    }

    useEffect(() => {
        const fetchHemocentro = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`)
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`)
                }
                const data = await response.json()
                setHemocentro(data)
            } catch (err: any) {
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHemocentro()
    }, [id])

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            ) : hemocentro ? (
                <View style={styles.detailsContainer}>
                    <HemocentroHeader hemocentro={hemocentro} />
                    <Heading>Contatos</Heading>
                    <Divider my="$1" bgColor="#000000" />
                    <View style={styles.contatos}>
                        <Text fontSize={16}>{hemocentro.telefone}</Text>
                        <Text fontSize={16}>{hemocentro.email}</Text>
                    </View>
                    <Button style={styles.button}>
                        <ButtonText fontSize={24} onPress={() => handleHemocentroData(hemocentro._id)}>Agendar Doação</ButtonText>
                    </Button>
                </View>
            ) : (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            )}
            {error && <ErrorComponent></ErrorComponent>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4F4',
        padding: 16,
    },
    detailsContainer: {
        flex: 1,
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
    contatos: {
        marginTop: 16,
        marginBottom: 32
    }
})

