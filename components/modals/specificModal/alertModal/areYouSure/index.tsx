import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertModalContainer } from '../index';
import { TextSemiBold20 } from '@/components/text/styled';
import {
    Button,
    CardContainer,
    Container,
    DefaultAcceptButton,
    Header,
    Row,
} from '@/components/modals/specificModal/alertModal/areYouSure/style';

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
                    <Header>{question}</Header>
                    <Row>
                        <Button onPress={closeHandler}>
                            <TextSemiBold20>{t('default_go_back')}</TextSemiBold20>
                        </Button>
                        <DefaultAcceptButton onPress={acceptHandler}>
                            <TextSemiBold20>{t('default_accept')}</TextSemiBold20>
                        </DefaultAcceptButton>
                    </Row>
                </CardContainer>
            </Container>
        </AlertModalContainer>
    );
};
