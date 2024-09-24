import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Spinner } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import HemocentroHeader from "../components/HemocentroHeader";
import QuestoesComponent from "../components/QuestoesComponent";
import { fetchHemocentro, fetchQuestoes, fetchOpcoes } from "../utils/apiUtils";
import { IHemocentro } from "../interfaces/hemocentro";
import { IQuestao } from "../interfaces/questoes";
import { IOpcoes } from "../interfaces/opcoes";

export default function FormularioHemocentro() {
    const { id, agendamento } = useLocalSearchParams();
    const [questoes, setQuestoes] = useState<IQuestao[]>([]);
    const [opcoes, setOpcoes] = useState<IOpcoes[]>([]);
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadHemocentro = async () => {
            setIsLoading(true);
            try {
                const data = await fetchHemocentro(id as string);
                setHemocentro(data);
            } catch {
                setError(`Ops...Ocorreu um erro ao carregar a página...`);
            } finally {
                setIsLoading(false);
            }
        };

        loadHemocentro();
    }, [id]);

    useEffect(() => {
        const loadQuestoes = async () => {
            try {
                const data = await fetchQuestoes(id as string);
                setQuestoes(data);
            } catch {
                setError('Erro ao carregar as questões.');
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestoes();
    }, [id]);

    useEffect(() => {
        if (questoes.length > 0) {
            const loadOpcoes = async () => {
                try {
                    const data = await fetchOpcoes(questoes[currentQuestionIndex]._id);
                    setOpcoes(data);
                } catch {
                    setError('Erro ao carregar as opções.');
                }
            };

            loadOpcoes();
        }
    }, [currentQuestionIndex, questoes]);

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Spinner size="large" />
                </View>
            ) : (
                <View style={styles.detailsContainer}>
                    {hemocentro ? (
                        <HemocentroHeader hemocentro={hemocentro} />
                    ) : (
                        <Text>Nenhum hemocentro encontrado.</Text>
                    )}
                    {questoes.length > 0 ? (
                        <QuestoesComponent
                            questoes={questoes}
                            opcoes={opcoes}
                            currentQuestionIndex={currentQuestionIndex}
                            onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                            onPrevious={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        />
                    ) : (
                        <Text>Nenhuma questão disponível.</Text>
                    )}
                </View>
            )}
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
    spinner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
