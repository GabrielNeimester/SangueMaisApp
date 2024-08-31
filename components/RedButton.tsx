// components/RedButton.tsx
import { Button, ButtonText } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

interface RedButtonProps {
    onPress: () => void;
    title: string;
}

export default function RedButton({ onPress, title }: RedButtonProps) {
    return (
        <Button style={styles.button} onPress={onPress}>
            <ButtonText fontSize={24}>{title}</ButtonText>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#E31515',
        paddingLeft: 56,
        paddingRight: 56,
        paddingTop: 16,
        paddingBottom: 16,
        height: 'auto',
    },
});
