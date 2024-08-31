import React from 'react';
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, ButtonText, Heading, Text } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

interface AvisoProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmText?: string;
}

const Aviso: React.FC<AvisoProps> = ({ isOpen, onClose, title, message, confirmText = "Ok" }) => {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent style={styles.container}>
                <AlertDialogHeader>
                    <Heading size='lg'>{title}</Heading>
                    <AlertDialogCloseButton style={{ display: 'none' }} />
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Text size='sm'>{message}</Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        style={styles.button}
                        variant="outline"
                        action="secondary"
                        onPress={onClose}
                    >
                        <ButtonText style={styles.buttonText}>{confirmText}</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF4F4'
    },
    button: {
        backgroundColor: '#E31515',
    },
    buttonText: {
        color: '#FFFFFF',
    }
});

export default Aviso;
