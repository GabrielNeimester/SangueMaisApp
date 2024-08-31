import React, { useEffect, useState } from "react";
import { View, Button, ScrollView, StyleSheet } from "react-native";
import { Text } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { api } from "../config/api";

interface IQuestao {
    _id: string;
    descricao: string;
    hemocentroId: string;
}

interface IOpcoes {
    _id: string;
    descricao: string;
    questaoId: string;
}

export default function FormularioHemocentro() {
    const { id, agendamento } = useLocalSearchParams();
    console.log(agendamento)
    
    const [questoes, setQuestoes] = useState<IQuestao[]>([]);
    const [opcoes, setOpcoes] = useState<IOpcoes[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchQuestoes = async () => {
            try {
                const response = await fetch(`${api}/questoes/hemocentro/${id}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar as questões');
                }
                const data = await response.json();
                setQuestoes(data);
            } catch (err) {
                setError('Erro ao carregar as questões.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestoes();
    }, [id]);

    useEffect(() => {
        if (questoes.length > 0) {
            fetchOpcoes(questoes[currentQuestionIndex]._id);
        }
    }, [currentQuestionIndex, questoes]);

    const fetchOpcoes = async (questaoId: string) => {
        try {
            const response = await fetch(`${api}/opcoes/${questaoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar as opções');
            }
            const data = await response.json();
            setOpcoes(data);
        } catch (err) {
            setError('Erro ao carregar as opções.');
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questoes.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Carregando questões...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text color="red" textAlign="center">
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.detailsContainer}>  
                {questoes.length > 0 ? (
                    <>
                        <Text fontSize={18} marginBottom={8}>
                            Questão {currentQuestionIndex + 1} de {questoes.length}
                        </Text>
                        <Text fontSize={16} marginTop={36} textAlign="justify" color="#333">
                            {questoes[currentQuestionIndex].descricao}
                        </Text>

                        <View style={styles.opcoesContainer}>
                            {opcoes.map(opcao => (
                                <View key={opcao._id} style={styles.opcao}>
                                    <Text>{opcao.descricao}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Anterior"
                                onPress={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            />
                            <Button
                                title="Próxima"
                                onPress={handleNext}
                                disabled={currentQuestionIndex === questoes.length - 1}
                            />
                        </View>
                    </>
                ) : (
                    <Text>Nenhuma questão disponível.</Text>
                )}
            </View> 
        </ScrollView>
    );
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
    opcoesContainer: {
        marginBottom: 32,
    },
    opcao: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
