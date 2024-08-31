import { View, StyleSheet } from "react-native";
import { Button, ButtonText, Divider, Heading, Text } from '@gluestack-ui/themed';
import CustomPicker from "./CustomPicker";
import { formatDate } from "../utils/formatDate";
import { IData } from "../interfaces/data";
import { IHorario } from "../interfaces/hora";

interface AgendamentoFormProps {
    datas: IData[];
    horarios: IHorario[];
    selectedData: string;
    selectedHorario: string;
    onResponderFormulario: () => void;
    onDataChange: (data: string) => void;
    onHorarioChange: (horarioId: string) => void;
}

export default function AgendamentoForm({
    datas,
    horarios,
    selectedData,
    selectedHorario,
    onResponderFormulario,
    onDataChange,
    onHorarioChange,
}: AgendamentoFormProps) {
    return (
        <View style={styles.detailsContainer}>
            <Heading>Agendamento</Heading>
            <Divider my="$1" bgColor="#000000" />
            <View style={styles.contatos}>
                <Text fontSize={16}>Para prosseguir basta escolher uma data e horário disponível para a doação.</Text>
            </View>
            <CustomPicker
                label="Escolha uma data"
                selectedValue={selectedData}
                onValueChange={onDataChange}
                items={datas.map(dataItem => ({
                    label: formatDate(dataItem.data),
                    value: dataItem._id
                }))}
                placeholder={datas.length > 0 ? "Selecione uma data" : "Sem datas disponíveis"}
                disabled={datas.length === 0}
            />
            <CustomPicker
                label="Escolha um horário"
                selectedValue={selectedHorario}
                onValueChange={onHorarioChange}
                items={horarios.map(horario => ({ label: horario.horario, value: horario._id }))}
                placeholder={horarios.length > 0 ? "Selecione um horário" : "Sem horários disponíveis para essa data"}
                disabled={!selectedData || horarios.length === 0}
            />
            <Button
                style={styles.button}
                onPress={onResponderFormulario}
                disabled={!selectedData || !selectedHorario}
            >
                <ButtonText fontSize={24}>Prosseguir</ButtonText>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#E31515',
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        height: 'auto',
    },
    contatos: {
        marginTop: 16,
        marginBottom: 32,
    },
});
