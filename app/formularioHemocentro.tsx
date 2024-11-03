import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Spinner } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import HemocentroHeader from "../components/HemocentroHeader";
import QuestoesComponent from "../components/QuestoesComponent";
import { createAgendamento, fetchHemocentro, fetchQuestoes } from "../utils/apiUtils";
import { IHemocentro } from "../interfaces/hemocentro";
import { IQuestoesResponse } from "../interfaces/questoes";
import ErrorPage from "./ErrorPage";

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
        if (questoes?.totalQuestoesComOpcoes && currentQuestionIndex < questoes.totalQuestoesComOpcoes) {
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

    const handleFinishForm = async () => {
        const agendamentoCompleto = {
            ...JSON.parse(agendamento as string),
            selectedAnswers
        };

        try {
            const {statusDoacao, impedimento, diasImpedidos, dataAgendamento, horario} = await createAgendamento(agendamentoCompleto)

            router.push({
                pathname: '/agendamentoResultado',
                params: {statusDoacao, impedimento, diasImpedidos, dataAgendamento, horario}
            });
        } catch (error) {

            router.push('/ErrorPage');
        }
    }

    const handleFinish = async () => {
        const agendamentoCompleto = {
            ...JSON.parse(agendamento as string)
        }
        
        try {
            const response = await createAgendamento(agendamentoCompleto)

            const {
                _id,
                hemocentroId,
                nomeCompleto,
                dataAgendamento,
                dataNascimento,
                horario,
                email,
                impedimento,
                diasImpedidos,
                statusDoacao
            } = response

            router.push({
                pathname: '/agendamentoResultado',
                params: {
                    id: _id,
                    hemocentroId,
                    nomeCompleto,
                    dataAgendamento,
                    dataNascimento,
                    horario,
                    email,
                    impedimento,
                    diasImpedidos,
                    statusDoacao
                }
            });
        } catch (error) {
            console.error('Erro ao criar o agendamento:', error);
            router.push('/ErrorPage');
        }
    }



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
                    {questoes && questoes.totalQuestoesComOpcoes === 0 ? (
                        <View>
                            <Text  fontSize={20} style={styles.text} color="#E31515">Esse hemocentro ainda não tem nenhum formulário cadastrado, para concluir o agendamento aperte o botão abaixo</Text>
                    <TouchableOpacity
                        style={styles.button_primary}
                        onPress={handleFinish}>
                        <Text style={styles.text_primary} fontSize={24}>Finalizar</Text>
                    </TouchableOpacity>
                        </View>
                    ) : questoes ? (
                        <QuestoesComponent
                            questoes={questoes}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            onFinish={handleFinishForm}
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
        marginTop: 8
    },
    text_primary: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 32,
        fontSize: 18
    }
});
