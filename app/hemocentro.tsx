import { ScrollView, StyleSheet, View, TextInput } from "react-native"
import { Card, Heading, Spinner, Text } from '@gluestack-ui/themed'
import React, { useEffect, useState } from "react"
import { api } from "../config/api"
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { router, useNavigation } from "expo-router"
import { IHemocentro } from "../interfaces/hemocentro"

export default function Hemocentro() {
    const [hemocentro, setHemocentro] = useState<IHemocentro[]>([])
    const [filteredHemocentro, setFilteredHemocentro] = useState<IHemocentro[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | false>(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const navigation = useNavigation()

    function handleHemocentroDetalhes(id: string): void {
        router.push({ pathname: 'hemocentroDetalhes', params: { id } })
      }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${api}/hemocentro`)
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`)
                }
                const json = await response.json()
                setHemocentro(json)
                setFilteredHemocentro(json)
            } catch (err: any) {
                console.error('Fetch error:', err)
                setError(`Failed to fetch data: ${err.message}`)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSearch = (text: string) => {
        setSearchQuery(text)
        setIsLoading(true)
        if (text) {
            const filteredData = hemocentro.filter(item => 
                item.nome.toLowerCase().includes(text.toLowerCase())
            )
            setIsLoading(false)
            setFilteredHemocentro(filteredData)
        } else {
            setIsLoading(false)
            setFilteredHemocentro(hemocentro)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Heading fontSize={24} style={styles.titulo}>Doação de Sangue</Heading>   
            <View style={styles.texto}>
                <Text fontSize={16}>Primeiro por favor selecione um</Text>
                <Text fontSize={16}>hemocentro para começar</Text>
            </View>
            <View style={styles.searchContainer}>
                <MaterialIcon name="search" size={20} color="#000" style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Pesquisar hemocentro"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            ) : (
                filteredHemocentro.map((hemocentro) => (
                    <Card 
                        onTouchEnd={() => handleHemocentroDetalhes(hemocentro._id)}
                        key={hemocentro._id} 
                        style={styles.card} 
                    >
                        <Heading>{hemocentro.nome}</Heading>
                        <Text>{hemocentro.bairro}</Text>
                        <View style={styles.cidade}>
                            <Text fontWeight={500}>{hemocentro.cidade}, {hemocentro.estado}</Text>
                        </View>
                    </Card>
                ))
            )}
            {error && <Text sx={styles.error}>{error}</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4F4',
    },
    pesquisa: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 16
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        },
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        backgroundColor: '#FFF4F4',
    },
    cidade: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    texto: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    titulo: {
        alignSelf: 'center',
        marginTop: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
        paddingLeft: 8
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    spinner: {
        margin: 16
    }
});
