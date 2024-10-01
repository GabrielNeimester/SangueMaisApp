import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Spinner } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import HemocentroHeader from "../components/HemocentroHeader";
import QuestoesComponent from "../components/QuestoesComponent";
import { fetchHemocentro, fetchQuestoes } from "../utils/apiUtils";
import { IHemocentro } from "../interfaces/hemocentro";
import { IQuestoesResponse } from "../interfaces/questoes";
import ErrorComponent from "../components/ErrorComponent";
import ErrorPage from "../components/ErrorPage";

export default function FormularioHemocentro() {
    const { id, agendamento } = useLocalSearchParams();
    const [questoes, setQuestoes] = useState<IQuestoesResponse | null>(null);
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<boolean>(false);
    const [isLoadingHemocentro, setIsLoadingHemocentro] = useState<boolean>(true);
    const [isLoadingQuestoes, setIsLoadingQuestoes] = useState<boolean>(true);

    useEffect(() => {
        const loadHemocentro = async () => {
            setIsLoadingHemocentro(true);
            try {
                const data = await fetchHemocentro(id as string);
                setHemocentro(data);
            } catch {
                setError(true);
            } finally {
                setIsLoadingHemocentro(false);
            }
        };

        loadHemocentro();
    }, [id]);

    useEffect(() => {
        const loadQuestoes = async () => {
            setIsLoadingQuestoes(true);
            try {
                const data = await fetchQuestoes(id as string, currentQuestionIndex);
                setQuestoes(data);
            } catch {
                setError(true);
            } finally {
                setIsLoadingQuestoes(false);
            }
        };

        loadQuestoes();
    }, [id, currentQuestionIndex]);

    const handleNext = () => {
        if (currentQuestionIndex < questoes.totalQuestoesComOpcoes) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 1) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleValueChange = (questaoId: string, value: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questaoId]: value
        }));
    };

    const handleFinish = () => {
        const agendamentoCompleto = {
            ...JSON.parse(agendamento as string),
            selectedAnswers
        };
        console.log(agendamentoCompleto);
    };

    return (
        <ScrollView style={styles.container}>
            {isLoadingHemocentro || isLoadingQuestoes ? (
                <View style={styles.spinner}>
                    <Spinner size="large" />
                </View>
            ) : (
                <View style={styles.detailsContainer}>
                    {hemocentro ? (
                        <HemocentroHeader hemocentro={hemocentro} />
                    ) : (
                        <Text></Text>
                    )}
                    {questoes ? (
                        <QuestoesComponent
                            questoes={questoes}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            onFinish={handleFinish}
                            onValueChange={handleValueChange}
                            selectedAnswers={selectedAnswers}
                        />
                    ) : (
                        <Text></Text>
                    )}
                    {error && <ErrorPage />}
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
    }
});
