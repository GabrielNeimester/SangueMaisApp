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

        const handleBackPress = () => {
            router.replace('/')
            return true
        }

        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

       
        return () => backHandler.remove();
    }, [router]);

    const renderMessage = () => {
        if (statusDoacao === 'bloqueado') {
            if (impedimento === 'temporario') {
                return (
                    <View style={styles.messageContainer}>
                        <Text fontSize={32} style={styles.tittle} color="#E31515">
                            Ops não foi possível agendar
                        </Text>
                        <Icon name="cancel" size={160} color="#E31515" />
                        <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                            Você possui um IMPEDIMENTO TEMPORÁRIO {diasImpedidos} de dia(s)
                        </Text>
                        <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                            para mais informações entre em contato com o hemocentro selecionado.
                        </Text>
                        <TouchableOpacity style={styles.button_primary}
                        onPress={handleHome} >
                        <Text style={styles.text_primary} fontSize={24}>Voltar para o início</Text>
                    </TouchableOpacity>
                    </View>
                );
            } else if (impedimento === 'definitivo') {
                return (
                    <View style={styles.messageContainer}>
                        <Text fontSize={32} style={styles.tittle} color="#E31515">
                            Ops não foi possível agendar
                        </Text>
                        <Icon name="cancel" size={160} color="#E31515" />
                        <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                            Você possui um IMPEDIMENTO DEFINITIVO
                        </Text>
                        <Text fontSize={18} style={styles.text} fontWeight={'$bold'} color="#000000">
                            para mais informações entre em contato com o hemocentro selecionado.
                        </Text>
                        <TouchableOpacity style={styles.button_primary}
                        onPress={handleHome} >
                        <Text style={styles.text_primary} fontSize={24}>Voltar para o início</Text>
                    </TouchableOpacity>
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
                    <Text fontSize={18} style={styles.text} color="#000000">
                        Lembre-se de comparacer no hemocentro no dia {dataAgendamento} às {horario} e apresentar documento de identificação oficial com foto.
                    </Text>
                    <Text fontSize={18} style={styles.text} color="#000000">
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
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFF4F4'
    },
    messageContainer: {
        marginBottom: 32,
        marginLeft: 24,
        marginRight: 24,
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
        marginTop: 32,
    },
    text_primary: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});
