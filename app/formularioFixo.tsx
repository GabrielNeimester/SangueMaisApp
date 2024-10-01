import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { Text, Heading } from '@gluestack-ui/themed'
import { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker'
import RedButton from "../components/RedButton"
import { router, useLocalSearchParams } from "expo-router"
import Icon from 'react-native-vector-icons/FontAwesome'
import Aviso from "../components/Aviso"
import CustomPicker from "../components/CustomPicker"
import { formatCPF, formatDate, formatDateForJson } from '../utils/formatUtils'
import { isValidCPF, isValidPhone, isValidEmail } from '../utils/validationUtils'

export default function FormularioFixo() {
    const [cpf, setCpf] = useState('')
    const [nome, setNome] = useState('')
    const [dataNascimento, setDataNascimento] = useState<Date>(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [sexo, setSexo] = useState('masculino')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [sangue, setSangue] = useState('A+')
    const [isAvisoOpen, setIsAvisoOpen] = useState(false)
    const [avisoMessage, setAvisoMessage] = useState('')

    const { id, agendamento } = useLocalSearchParams()

    const validateForm = () => {
        const camposVazios = []

        if (!cpf) camposVazios.push('CPF')
        if (!nome) camposVazios.push('Nome Completo')
        if (!telefone) camposVazios.push('Telefone/Celular')
        if (!email) camposVazios.push('E-mail')

        if (camposVazios.length > 0) {
            setAvisoMessage(`Por favor, preencha os seguintes campos obrigatórios: ${camposVazios.join(', ')}.`)
            setIsAvisoOpen(true)
            return false
        }

        return true
    }

    const handleFormularioHemcentro = () => {
        if (!validateForm()) return

        if (!isValidCPF(cpf)) {
            setAvisoMessage('CPF inválido. Por favor, insira um CPF válido (XXX.XXX.XXX-XX).')
            setIsAvisoOpen(true)
            return
        }

        if (!isValidPhone(telefone)) {
            setAvisoMessage('Telefone inválido. Por favor, insira um telefone válido.')
            setIsAvisoOpen(true)
            return
        }

        if (!isValidEmail(email)) {
            setAvisoMessage('E-mail inválido. Por favor, insira um e-mail válido.')
            setIsAvisoOpen(true)
            return
        }

        const agendamentoCompleto = {
            ...JSON.parse(agendamento as string),
            cpf,
            nomeCompleto: nome,
            tipoSanguineo: sangue,
            dataNascimento: formatDateForJson(dataNascimento),
            sexo,
            telefone,
            email,
        }

        router.push({ pathname: 'formularioHemocentro', params: { id, agendamento: JSON.stringify(agendamentoCompleto) } })
    }

    const handleCpfChange = (text: string) => {
        const formattedCPF = formatCPF(text)
        setCpf(formattedCPF)
    }

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dataNascimento
        setShowDatePicker(false)
        setDataNascimento(currentDate)
    }

    const applyPhoneMask = (text: string) => {
        let cleaned = text.replace(/\D/g, '')

        if (cleaned.length <= 10) {
            cleaned = cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        } else {
            cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        }

        return cleaned.trim()
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
                    maxLength={14}
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
                    maxLength={15}
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
                <RedButton title="Próxima" onPress={handleFormularioHemcentro}/>
            </View>
            <Aviso
                isOpen={isAvisoOpen}
                title="Aviso"
                message={avisoMessage}
                onClose={() => setIsAvisoOpen(false)}
            />
        </ScrollView>
    )
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
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 14,
        marginBottom: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderRadius: 0,
    },
    dateIconContainer: {
        marginLeft: 260,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    button_margin:{
        marginBottom: 16
    }
})
