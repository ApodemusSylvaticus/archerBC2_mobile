import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertModalContainer } from '@/components/modals/alertModal';
import { Text20, TextSemiBold20 } from '@/components/text/styled';
import { Button, CardContainer, Container, Row } from '@/components/modals/alertModal/areYouSure/style';

interface AreYouSureModalProps {
    isOpen: boolean;
    closeHandler: () => void;
    acceptHandler: () => void;
    question: string;
}
export const AreYouSureModal: React.FC<AreYouSureModalProps> = ({ closeHandler, acceptHandler, question, isOpen }) => {
    const { t } = useTranslation();
    return (
        <AlertModalContainer isOpen={isOpen} closeHandler={closeHandler}>
            <Container>
                <CardContainer>
                    <Text20>{question}</Text20>
                    <Row>
                        <Button onPress={acceptHandler}>
                            <TextSemiBold20>{t('default_accept')}</TextSemiBold20>
                        </Button>
                        <Button onPress={closeHandler}>
                            <TextSemiBold20>{t('default_go_back')}</TextSemiBold20>
                        </Button>
                    </Row>
                </CardContainer>
            </Container>
        </AlertModalContainer>
    );
};
