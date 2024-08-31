import { useEffect, useState } from "react";
import { api } from "../config/api";
import { IHemocentro } from "../interfaces/hemocentro";
import { IData } from "../interfaces/data";
import { IHorario } from "../interfaces/hora";
import { router } from 'expo-router';

export function useAgendamentoData(id: string) {
    const [hemocentro, setHemocentro] = useState<IHemocentro | null>(null);
    const [datas, setDatas] = useState<IData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [horarios, setHorarios] = useState<IHorario[]>([]);
    const [selectedData, setSelectedData] = useState<string>('');
    const [selectedHorario, setSelectedHorario] = useState<string>('');
    const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

    useEffect(() => {
        const fetchHemocentro = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setHemocentro(data);
            } catch (err: any) {
                setError(`Ops...Ocorreu um erro ao carregar a página...`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHemocentro();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${api}/data/showByHemocentro/${id}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDatas(data);
                } else {
                    setDatas([]);
                    setError('Formato de dados inesperado.');
                }
            } catch (err: any) {
                setError(`Ops...Ocorreu um erro ao carregar a página...`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const fetchHorarios = async (dataId: string) => {
        try {
            const response = await fetch(`${api}/hora/${dataId}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setHorarios(data);
            } else {
                setHorarios([]);
                setError('Formato de dados inesperado.');
            }
        } catch (err: any) {
            setError(`Ops...Ocorreu um erro ao carregar os horários...`);
        }
    };

    const handleDataChange = (data: string) => {
        setSelectedData(data);
        setSelectedHorario('');
        if (data) {
            fetchHorarios(data);
        } else {
            setHorarios([]);
        }
    };

    const handleHorarioChange = (horarioId: string) => {
        setSelectedHorario(horarioId);
    };

    const handleResponderFormulario = (_id: string) => {
        if (!selectedData || !selectedHorario) {
            setShowAlertDialog(true);
            return;
        }

        const agendamento = {
            hemocentroId: id,
            dataAgendamento: selectedData,
            horario: selectedHorario,
        };

        router.push({ pathname: 'responderFormulario', params: { id, agendamento: JSON.stringify(agendamento) } });
    };

    return {
        hemocentro,
        datas,
        error,
        isLoading,
        horarios,
        selectedData,
        selectedHorario,
        showAlertDialog,
        handleDataChange,
        handleHorarioChange,
        setShowAlertDialog,
        handleResponderFormulario,
    };
}
