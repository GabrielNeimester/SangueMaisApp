import { ScrollView, StyleSheet, View } from "react-native";
import { Button, ButtonText, Divider, Heading, Input, InputField, Spinner, Text } from '@gluestack-ui/themed';
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../config/api";
import { router, useLocalSearchParams } from 'expo-router';
import { IHemocentro } from "../interfaces/hemocentro";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function AgendamentoDados() {
    const { id } = useLocalSearchParams();
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState('')

    const [date, setDate] = useState(new Date(1598051730000));

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
        const currentDate = selectedDate || new Date()
        setDate(currentDate);
    };

    const showMode = (currentMode: 'date') => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('date');
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        console.log(inputValue); // Aqui você pega o valor do input
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.detailsContainer}>
                <Heading fontSize={24} style={styles.title}>Dados do Doador</Heading>
                <Input onTouchStart={showDatepicker} isReadOnly={true}><InputField value={String(date)}/></Input>
                <Button style={styles.button}>
                    <ButtonText fontSize={24}>Agendar Doação</ButtonText>
                </Button>
            </View>

        </ScrollView>
    );
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
    }
});

