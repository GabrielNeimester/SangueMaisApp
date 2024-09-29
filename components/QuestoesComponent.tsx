import React from 'react';
import { View, Button } from 'react-native';
import { CircleIcon, Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel, Text, VStack } from '@gluestack-ui/themed';
import { IQuestoesResponse } from '../interfaces/questoes';
import { IAgendamento } from '../interfaces/agendamento';

interface QuestoesComponentProps {
    questoes: IQuestoesResponse;
    onNext: () => void;
    onPrevious: () => void;
    onFinish: (answers: { [key: string]: string }) => void; // Passa as respostas ao finalizar
    onValueChange: (questaoId: string, value: string) => void; // Nova prop para mudar o valor
    selectedAnswers: { [key: string]: string }; // Nova prop para respostas selecionadas
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
        <View style={{ marginVertical: 16 }}>
            <Text fontWeight="bold">{`Questão ${questoes.page}`}</Text>
            <Text>{questoes.descricao}</Text>
            <RadioGroup 
                value={selectedAnswers[questoes.id] || ''} // Use a resposta armazenada ou uma string vazia
                onChange={(value) => onValueChange(questoes.id, value)} // Passar o ID da questão
            >
                <VStack space="sm">
                    {questoes.opcoes.map((opcao) => (
                        <Radio value={opcao.id} key={opcao.id}>
                            <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>{opcao.descricao}</RadioLabel>
                        </Radio>
                    ))}
                </VStack>
            </RadioGroup>

            <View style={{ marginTop: 16 }}>
                {questoes.page > 1 && (
                    <Button title="Anterior" onPress={onPrevious} />
                )}
                {questoes.page < questoes.totalQuestoesComOpcoes ? (
                    <Button
                        title="Próximo"
                        onPress={onNext}
                        disabled={!selectedAnswers[questoes.id]} // Habilitar apenas se uma opção estiver selecionada
                    />
                ) : (
                    <Button
                        title="Finalizar"
                        onPress={() => onFinish(selectedAnswers)} // Passar as respostas ao finalizar
                        disabled={!selectedAnswers[questoes.id]} // Habilitar apenas se uma opção estiver selecionada
                    />
                )}
            </View>
        </View>
    );
}
