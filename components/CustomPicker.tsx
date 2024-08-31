import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'

interface CustomPickerProps {
    label: string
    selectedValue: string
    onValueChange: (value: string) => void
    items: { label: string, value: string }[]
    placeholder: string
    disabled?: boolean
}

const CustomPicker: React.FC<CustomPickerProps> = ({ label, selectedValue, onValueChange, items, placeholder, disabled }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.pickerContainer, disabled && styles.disabledPicker]}>
                <Picker
                    selectedValue={selectedValue}
                    style={styles.picker}
                    onValueChange={onValueChange}
                    enabled={!disabled}
                >
                    <Picker.Item label={placeholder} value="" />
                    {items.map((item) => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginHorizontal: 8,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
    },
    pickerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    picker: {
        height: 40,
        width: '100%',
    },
    disabledPicker: {
        opacity: 0.5,
    },
});

export default CustomPicker;
