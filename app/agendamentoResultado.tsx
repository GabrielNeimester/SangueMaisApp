import { ScrollView, View, StyleSheet, BackHandler } from "react-native"
import { Text } from "@gluestack-ui/themed"
import Icon from "react-native-vector-icons/MaterialIcons"
import ErrorPage from "./ErrorPage"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react";
import RedButton from '../components/RedButton'

export default function AgendamentoResultado() {
    const router = useRouter();
    const { statusDoacao, impedimento, diasImpedidos, dataAgendamento, horario } = useLocalSearchParams()

    function handleHome(): void {
        router.replace('')
    }

    useEffect(() => {
        const handleBackPress = () => {
            router.replace('/')
            return true
        }
        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        return () => backHandler.remove()
    }, [router])

    const renderMessage = () => {
        if (statusDoacao === 'bloqueado') {
            const impedimentoMessage = impedimento === 'temporario' ? 
                `Você possui um IMPEDIMENTO TEMPORÁRIO ${diasImpedidos} de dia(s)` : 
                'Você possui um IMPEDIMENTO DEFINITIVO'

            return (
                <View style={styles.messageContainer}>
                    <Text fontSize={32} style={styles.title} color="#E31515">
                        Ops não foi possível agendar
                    </Text>
                    <Icon name="cancel" size={160} color="#E31515" />
                    <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                        {impedimentoMessage}
                    </Text>
                    <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                        Para mais informações entre em contato com o hemocentro selecionado.
                    </Text>
                    <View style={{ marginTop: 30 }}>
                        <RedButton onPress={handleHome} title="Voltar para o início" />
                    </View>
                </View>
            );
        } else if (statusDoacao === 'liberado' && impedimento === 'nenhum') {
            return (
                <View style={styles.messageContainer}>
                    <Text fontSize={32} style={styles.title} color="#E31515">
                        Agendamento concluído com sucesso!
                    </Text>
                    <Icon name="check-circle" size={160} color="#00B712" />
                    <Text fontSize={18} style={styles.text} color="#000000">
                        Lembre-se de comparecer no hemocentro no dia {dataAgendamento} às {horario} e apresentar documento de identificação oficial com foto.
                    </Text>
                    <Text fontSize={18} style={styles.text} color="#000000">
                        <Text fontSize={18} fontWeight={'$bold'}>Menores de idade</Text> é necessário estarem acompanhados ou portar um consentimento formal do responsável legal para fazer a doação!
                    </Text>
                    <View style={{ marginTop: 30 }}>
                        <RedButton onPress={handleHome} title="Voltar para o início" />
                    </View>
                </View>
            );
        } else {
            return (
                <ErrorPage />
            );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {renderMessage()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFF4F4',
        padding: 16,
    },
    messageContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        paddingHorizontal: 16,
    },
    title: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    text: {
        textAlign: "center",
        marginBottom: 16,
        paddingHorizontal: 8
    },
})
