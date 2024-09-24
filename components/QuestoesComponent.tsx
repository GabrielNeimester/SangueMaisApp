import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Text } from '@gluestack-ui/themed';
import { IQuestao } from '../interfaces/questoes'
import { IOpcoes } from "../interfaces/opcoes";

interface QuestoesComponentProps {
    questoes: IQuestao[];
    opcoes: IOpcoes[];
    currentQuestionIndex: number;
    onNext: () => void;
    onPrevious: () => void;
}

export default function QuestoesComponent({
    questoes,
    opcoes,
    currentQuestionIndex,
    onNext,
    onPrevious,
}: QuestoesComponentProps) {
    return (
        <View>
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
                    onPress={onPrevious}
                    disabled={currentQuestionIndex === 0}
                />
                <Button
                    title="Próxima"
                    onPress={onNext}
                    disabled={currentQuestionIndex === questoes.length - 1}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
