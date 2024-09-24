import { StyleSheet, View } from "react-native"
import { router, useLocalSearchParams } from 'expo-router'
import RedButton from "../components/RedButton"

export default function ResponderFormularioFixo() {
    const { id, agendamento } = useLocalSearchParams()

    const handleFormularioFixo = () => {
        router.push({ pathname: 'formularioFixo', params: { id, agendamento } })
    }

    return (
        <View style={styles.container}>
            <RedButton title="Responder Formulário" onPress={handleFormularioFixo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF4F4',
    },
})
