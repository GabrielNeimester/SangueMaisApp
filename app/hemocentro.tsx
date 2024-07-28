import { ScrollView, View } from "react-native";
import { Card, Heading, Text } from '@gluestack-ui/themed'
import { useEffect, useState } from "react";
import { api } from "../config/api";

interface IHemocentro {
    _id: string
    cnpj: string
    nome: string
    estado: string
    cidade: string
    bairro: string
    telefone: string
    email: string
    ativo: boolean
}


export default function Hemocentro(){

    const [hemocentro, setHemocentro] = useState<IHemocentro[]>([])
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/hemocentro`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const json = await response.json();
                setHemocentro(json);
            } catch (err:any) {
                console.error('Fetch error:', err);
                setError(`Failed to fetch data: ${err.message}`);
            }
        };

        fetchData();
    }, []);

    return(
        <ScrollView>
            <Heading>Doação de Sangue</Heading>
            <Text>Primeiro por favor selecione um</Text>
            <Text>hemocentro para começar</Text>
            {hemocentro.map((item) => (
                <Card key={item._id}>
                    <Text>{item.nome}</Text>
                    <Text>{item.bairro}</Text>
                    <Text>{item.estado} - {item.cidade}</Text>
                </Card>
            ))}

        </ScrollView>
    )
}