import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { Text, Heading } from '@gluestack-ui/themed'
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import RedButton from "../components/RedButton";
import { router, useLocalSearchParams } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';
import Aviso from "../components/Aviso";
import CustomPicker from "../components/CustomPicker";

export default function FormularioFixo() {
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sexo, setSexo] = useState('masculino');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [sangue, setSangue] = useState('A+');
    const [isAvisoOpen, setIsAvisoOpen] = useState(false);
    const [avisoMessage, setAvisoMessage] = useState('');

    const { id, agendamento } = useLocalSearchParams();

    const validateForm = () => {
        const camposVazios = [];

        if (!cpf) camposVazios.push('CPF');
        if (!nome) camposVazios.push('Nome Completo');
        if (!telefone) camposVazios.push('Telefone/Celular');
        if (!email) camposVazios.push('E-mail');

        if (camposVazios.length > 0) {
            setAvisoMessage(`Por favor, preencha os seguintes campos obrigatórios: ${camposVazios.join(', ')}.`);
            setIsAvisoOpen(true);
            return false;
        }

        return true;
    };

    const handleFormularioHemcentro = () => {
        if (!validateForm()) return;

        if (!isValidCPF(cpf)) {
            setAvisoMessage('CPF inválido. Por favor, insira um CPF válido (XXX.XXX.XXX-XX).');
            setIsAvisoOpen(true);
            return;
        }

        if (!isValidPhone(telefone)) {
            setAvisoMessage('Telefone inválido. Por favor, insira um telefone válido.');
            setIsAvisoOpen(true);
            return;
        }

        if (!isValidEmail(email)) {
            setAvisoMessage('E-mail inválido. Por favor, insira um e-mail válido.');
            setIsAvisoOpen(true);
            return;
        }        

        const agendamentoCompleto = {
            ...JSON.parse(agendamento as string),
            cpf,
            nomeCompleto: nome,
            tipoSanguineo: sangue,
            dataNascimento: formatDate(dataNascimento),
            sexo,
            telefone,
            email,
        };

        router.push({ pathname: 'formularioHemocentro', params: { id, agendamento: JSON.stringify(agendamentoCompleto) } });
    };

    const handleCpfChange = (text: string) => {
        const formattedCPF = formatCPF(text);
        setCpf(formattedCPF);
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dataNascimento;
        setShowDatePicker(false);
        setDataNascimento(currentDate);
    };

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const isValidCPF = (cpf: string) => {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        sum = 0;

        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    };

    const applyPhoneMask = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
    
        if (cleaned.length <= 10) {
            cleaned = cleaned.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
                return [
                    p1 ? `(${p1}` : '',
                    p2 ? `) ${p2}` : '',
                    p3 ? `-${p3}` : ''
                ].join('');
            });
        } else {
            cleaned = cleaned.replace(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3, p4) => {
                return [
                    p1 ? `(${p1}` : '',
                    p2 ? `) ${p2} ` : '',
                    p3 ? `${p3}` : '',
                    p4 ? `-${p4}` : ''
                ].join('');
            });
        }
    
        return cleaned.trim(); 
    };

    const isValidPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    return (
        <ScrollView style={styles.container}>
            <Heading fontSize={24} style={styles.titulo}>Dados do Doador</Heading>
            <View style={styles.formContainer}>
                <Text sx={styles.label}>CPF</Text>
                <TextInput
                    style={styles.input}
                    value={cpf}
                    onChangeText={handleCpfChange}
                    placeholder="Digite seu CPF"
                    keyboardType="numeric"
                />

                <Text sx={styles.label}>Nome Completo</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite seu nome completo"
                />

                <CustomPicker
                    label="Tipo Sanguíneo"
                    selectedValue={sangue}
                    onValueChange={(itemValue) => setSangue(itemValue)}
                    items={[
                        { label: "A+", value: "A+" },
                        { label: "A-", value: "A-" },
                        { label: "B+", value: "B+" },
                        { label: "B-", value: "B-" },
                        { label: "AB+", value: "AB+" },
                        { label: "AB-", value: "AB-" },
                        { label: "O+", value: "O+" },
                        { label: "O-", value: "O-" },
                    ]}
                    placeholder="Selecione seu tipo sanguíneo"
                />

                <Text sx={styles.label}>Data de Nascimento</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text>{formatDate(dataNascimento)}</Text>
                    <View style={styles.dateIconContainer}>
                        <Icon name="calendar" size={20} color="#000" />
                    </View>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dataNascimento}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <CustomPicker
                    label="Sexo"
                    selectedValue={sexo}
                    onValueChange={(itemValue) => setSexo(itemValue)}
                    items={[
                        { label: "Masculino", value: "masculino" },
                        { label: "Feminino", value: "feminino" },
                    ]}
                    placeholder="Selecione seu sexo"
                />

                <Text sx={styles.label}>Telefone/Celular</Text>
                <TextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={(text) => setTelefone(applyPhoneMask(text))}
                    placeholder="Digite seu telefone"
                    keyboardType="numeric"
                />

                <Text sx={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.footer}>
                <RedButton title="Próxima" onPress={handleFormularioHemcentro} />
            </View>
            <Aviso
                isOpen={isAvisoOpen}
                title="Aviso"
                message={avisoMessage}
                onClose={() => setIsAvisoOpen(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF4F4',
    },
    formContainer: {
        marginBottom: 24,
    },
    titulo: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderRadius: 8,
        borderBottomColor: '#000',
        backgroundColor: '#FFF', 
        paddingHorizontal: 10,
        marginBottom: 16,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    dateIconContainer: {
        marginLeft: 265, 
        alignItems: 'center',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderRadius: 0,
    },
    dateIcon: {
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
});

