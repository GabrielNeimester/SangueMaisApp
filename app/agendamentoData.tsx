import { ScrollView, StyleSheet, View } from "react-native"
import { Spinner, Text } from '@gluestack-ui/themed'
import { useLocalSearchParams } from 'expo-router'
import HemocentroHeader from "../components/HemocentroHeader"
import Aviso from "../components/Aviso"
import AgendamentoForm from "../components/AgendamentoForm"
import { useAgendamentoData } from '../hooks/useAgendamentoData'
import ErrorComponent from "./ErrorPage"

export default function AgendamentoData() {
    const { id } = useLocalSearchParams()

    const hemocentroId = Array.isArray(id) ? id[0] : id

    const {
        hemocentro,
        datas,
        horarios,
        selectedData,
        selectedHorario,
        isLoading,
        showAlertDialog,
        setShowAlertDialog,
        handleDataChange,
        handleHorarioChange,
        handleResponderFormulario,
    } = useAgendamentoData(hemocentroId)

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            ) : hemocentro ? (
                <View style={styles.detailsContainer}>
                    <HemocentroHeader hemocentro={hemocentro} />
                    <AgendamentoForm
                        datas={datas}
                        horarios={horarios}
                        selectedData={selectedData}
                        selectedHorario={selectedHorario}
                        onResponderFormulario={() => handleResponderFormulario(hemocentro._id)}
                        onDataChange={handleDataChange}
                        onHorarioChange={handleHorarioChange}
                    />
                </View>
            ) : (
                <View style={styles.spinner}>
                    <Spinner size={'large'} />
                </View>
            )}
            <Aviso
                isOpen={showAlertDialog}
                onClose={() => setShowAlertDialog(false)}
                title="Seleção Obrigatória"
                message="Por favor, selecione uma data e um horário antes de prosseguir."
            />
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
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
