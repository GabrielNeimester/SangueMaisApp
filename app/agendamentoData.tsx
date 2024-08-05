import { ScrollView, StyleSheet, View } from "react-native";
import { Button, ButtonText, ChevronDownIcon, Divider, Heading, Icon, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Spinner, Text } from '@gluestack-ui/themed';
import { useEffect, useState } from "react";
import { api } from "../config/api";
import { router, useLocalSearchParams } from 'expo-router'
import { IHemocentro } from "../interfaces/hemocentro";
import { IData } from "../interfaces/data";
import { IHorario } from "../interfaces/hora";


export default function AgendamentoData() {
    const { id } = useLocalSearchParams();
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null)
    const [datas, setDatas] = useState<IData[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [horarios, setHorarios] = useState<IHorario[]>([])
    const [selectedData, setSelectedData] = useState<string>('')
    const [selectedHorario, setSelectedHorario] = useState<string>('')

    function handleAgendamentoDados(id: string): void {
        router.push({ pathname: 'agendamentoDados', params: { id } });
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

        fetchHemocentro()
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${api}/data/showByHemocentro/${id}`)
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`)
                }
                const data = await response.json()
                if (Array.isArray(data)) {
                    setDatas(data)
                } else {
                    setDatas([])
                    setError('Formato de dados inesperado.')
                }
            } catch (err: any) {
                setError(`Ops...Ocorreu um erro ao carregar a página...`)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [id])


    const fetchHorarios = async (dataId: string) => {
        try {
            const response = await fetch(`${api}/hora/${dataId}`)
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`)
            }
            const data = await response.json()
            if (Array.isArray(data)) {
                setHorarios(data)
            } else {
                setHorarios([])
                setError('Formato de dados inesperado.')
            }
        } catch (err: any) {
            setError(`Ops...Ocorreu um erro ao carregar os horários...`)
        }
    }

    const handleDataChange = (data: string) => {
        setSelectedData(data)
        setSelectedHorario('')
        fetchHorarios(data)
    }

    const handleHorarioChange = (horarioId: string) => {
        setSelectedHorario(horarioId)
    }

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
                    <Heading>Agendamento</Heading>
                    <Divider my="$1" bgColor="#000000" />
                    <View style={styles.contatos}>
                        <Text fontSize={16}>Para Prosseguir basta escolher uma data e horário disponível para a doação.</Text>
                    </View>
                    <Heading>Escolha um data</Heading>
                    <Divider my="$1" bgColor="#000000" />
                    <Select style={styles.select} onValueChange={handleDataChange}>
                        <SelectTrigger variant="underlined" size="md">
                            <SelectInput placeholder="Selecione uma data"/>
                            <Icon as={ChevronDownIcon} mr="$3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />

                            <SelectContent>
                                <ScrollView style={styles.selectContent}>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {datas.map(dataItem => (
                                        <SelectItem
                                            key={dataItem._id}
                                            label={dataItem.data}
                                            value={dataItem._id}
                                        />
                                    ))}
                                </ScrollView>
                            </SelectContent>

                        </SelectPortal>
                    </Select>
                    <Heading>Escolha um horário</Heading>
                    <Divider my="$1" bgColor="#000000" />
                    <Select style={styles.select} onValueChange={handleHorarioChange}>
                        <SelectTrigger variant="underlined" size="md">
                            <SelectInput placeholder="Selecione um horário" value={selectedHorario} />
                            <Icon as={ChevronDownIcon} mr="$3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />

                            <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {horarios.map(horario => (
                                        <SelectItem
                                            key={horario._id}
                                            label={horario.horario}
                                            value={horario.horario}
                                        />
                                    ))}

                            </SelectContent>

                        </SelectPortal>
                    </Select>
                    <Button style={styles.button}>
                        <ButtonText fontSize={24} onPress={() => handleAgendamentoDados(hemocentro._id)}>Prosseguir</ButtonText>
                    </Button>
                </View>
            ) : (
                <Text style={styles.error}>{error ? error : "Hemocentro não encontrado"}</Text>
            )}
        </ScrollView>
    )
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
        marginTop: 16,
        backgroundColor: '#E31515',
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        height: 'auto'
    },
    cidade: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    contatos: {
        marginTop: 16,
        marginBottom: 32
    },
    select: {
        marginTop: 16,
        marginBottom: 24
    },
    selectContent:{
        display:'flex',
        alignSelf:'flex-start',
        width:'100%'

    }
});

