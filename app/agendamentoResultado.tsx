import { ScrollView, View, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { Text } from "@gluestack-ui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import ErrorPage from "./ErrorPage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";


export default function AgendamentoResultado() {

    const router = useRouter();
    const { statusDoacao, impedimento, diasImpedidos, dataAgendamento, horario } = useLocalSearchParams();

    function handleHome(): void {
        router.replace('')
    }

    useEffect(() => {
        // Função para interceptar o botão de voltar no Android
        const handleBackPress = () => {
            router.replace('/'); // Redireciona para a página inicial
            return true; // Impede o comportamento padrão do botão de voltar
        };

        // Adiciona o listener do BackHandler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Limpa o listener ao desmontar o componente
        return () => backHandler.remove();
    }, [router]);

    const renderMessage = () => {
        if (statusDoacao === 'bloqueada') {
            if (impedimento === 'temporario') {
                return (
                    <View style={styles.messageContainer}>
                        <Text fontSize={24} style={styles.tittle}>
                            Ops não foi possível agendar
                        </Text>
                        <Icon name="cancel" size={160} color="#E31515" />
                        <Text fontSize={18} style={styles.text}>
                            Você possui um IMPEDIMENTO TEMPORÁRIO {diasImpedidos} de dia(s)
                        </Text>
                        <Text fontSize={18} style={styles.text}>
                            para mais informações entre em contato com o hemocentro selecionado.
                        </Text>
                    </View>
                );
            } else if (impedimento === 'definitivo') {
                return (
                    <View style={styles.messageContainer}>
                        <Text fontSize={24} style={styles.tittle}>
                            Ops não foi possível agendar
                        </Text>
                        <Icon name="cancel" size={160} color="#E31515" />
                        <Text fontSize={18} style={styles.text}>
                            Você possui um IMPEDIMENTO DEFINITIVO
                        </Text>
                        <Text fontSize={18} style={styles.text}>
                            para mais informações entre em contato com o hemocentro selecionado.
                        </Text>
                    </View>
                );
            }
        } else if (statusDoacao === 'liberado' && impedimento === 'nenhum') {
            return (
                <View style={styles.messageContainer}>
                    <Text fontSize={32} style={styles.tittle} color="#E31515">
                        Agendamento concluído com sucesso!
                    </Text>
                    <Icon name="check-circle" size={160} color="#00B712" />
                    <Text fontSize={18} style={styles.text}>
                        Lembre-se de comparacer no hemocentro no dia {dataAgendamento} às {horario} e apresentar documento de identificação oficial com foto.
                    </Text>
                    <Text fontSize={18} style={styles.text}>
                        <Text fontSize={18} fontWeight={'$bold'}>Menores de idade</Text> é necessário estarem acompanhados ou portar um consentimento formal do responsável legal para fazer a doação!</Text>
                    <TouchableOpacity style={styles.button_primary}
                        onPress={handleHome} >
                        <Text style={styles.text_primary} fontSize={24}>Voltar para o início</Text>
                    </TouchableOpacity>
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
        margin: 24
    },
    messageContainer: {
        marginBottom: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    tittle: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    text: {
        textAlign: "center",
        marginBottom: 16
    },
    button_primary: {
        display: "flex",
        backgroundColor: "#E31515",
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginTop: 32,
    },
    text_primary: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});
