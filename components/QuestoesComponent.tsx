import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleIcon, Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { IQuestoesResponse } from '../interfaces/questoes';
import { IAgendamento } from '../interfaces/agendamento';

interface QuestoesComponentProps {
    questoes: IQuestoesResponse;
    onNext: () => void;
    onPrevious: () => void;
    onFinish: (answers: { [key: string]: string }) => void; 
    onValueChange: (questaoId: string, value: string) => void; 
    selectedAnswers: { [key: string]: string };
}



export default function QuestoesComponent({
    questoes,
    onNext,
    onPrevious,
    onFinish,
    onValueChange,
    selectedAnswers,
}: QuestoesComponentProps) {
    return (
        <ScrollView>
            <Text fontWeight="bold" fontSize={16}>{`Questão ${questoes.page}`}</Text>
            <Text fontSize={24} style={styles.question}>{questoes.descricao}</Text>
            <RadioGroup
                value={selectedAnswers[questoes.id] || ''} // Use a resposta armazenada ou uma string vazia
                onChange={(value) => onValueChange(questoes.id, value)} // Passar o ID da questão
            >
                <VStack space="sm">
                    {questoes.opcoes.map((opcao) => (
                        <Radio value={opcao.id} key={opcao.id}>
                            <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon}/>
                            </RadioIndicator>
                            <RadioLabel fontSize={24} style={styles.options}>{opcao.descricao}</RadioLabel>
                        </Radio>
                    ))}
                </VStack>
            </RadioGroup>

            <View style={{ marginTop: 16 }}>
                {questoes.page > 1 && (
                    <TouchableOpacity onPress={onPrevious} style={styles.button_secondary} >
                        <Text style={styles.text_secondary} fontSize={24}>Anterior</Text>
                    </TouchableOpacity>
                )}
                {questoes.page < questoes.totalQuestoesComOpcoes ? (
                    <TouchableOpacity style={styles.button_primary}
                        onPress={onNext}
                        disabled={!selectedAnswers[questoes.id]} // Habilitar apenas se uma opção estiver selecionada
                    >
                        <Text style={styles.text_primary} fontSize={24}>Próximo</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.button_primary}
                        onPress={() => onFinish(selectedAnswers)} // Passar as respostas ao finalizar
                        disabled={!selectedAnswers[questoes.id]} >
                        <Text style={styles.text_primary} fontSize={24}>Finalizar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    button_secondary: {
        display: 'flex',
        borderWidth: 1,
        borderColor: '#E31515',
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
    text_secondary: {
        color: '#E31515',
        fontWeight: 'bold'
    },
    options: {
        marginTop: 4,
        marginBottom: 4
    },
    question:{
        marginTop: 16,
        marginBottom: 8
    }
});

