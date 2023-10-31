import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultRow } from '@/components/container/defaultBox';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { useSettingStore } from '@/store/useSettingStore';
import { ErrorContainer, ErrorMsg, RetryWithErrorMsgContainer } from '@/components/retry/style';

interface RetryProps {
    retryHandler: () => void;
}
export const Retry: React.FC<RetryProps> = ({ retryHandler }) => {
    const { colors } = useTheme();
    const { serverHost, setServerHost } = useSettingStore(state => ({
        serverHost: state.serverHost,
        setServerHost: state.setServerHost,
    }));
    const { t } = useTranslation();

    const [localServerHost, setLocalServerHost] = useState(serverHost);

    const buttonHandler = () => {
        if (localServerHost !== serverHost) {
            setServerHost(localServerHost);
        } else {
            retryHandler();
        }
    };

    return (
        <DefaultRow>
            <DefaultInput
                value={localServerHost}
                onChangeText={setLocalServerHost}
                label="Server host"
                onBlur={() => undefined}
                background={colors.appBg}
            />
            <DefaultButton onPress={buttonHandler}>
                <TextSemiBold20>{t('default_retry')}</TextSemiBold20>
            </DefaultButton>
        </DefaultRow>
    );
};

interface RetryWithErrorMsgProps extends RetryProps {
    msg: string;
}
export const RetryWithErrorMsg: React.FC<RetryWithErrorMsgProps> = ({ retryHandler, msg }) => {
    return (
        <RetryWithErrorMsgContainer>
            <ErrorContainer>
                <ErrorMsg>{msg}</ErrorMsg>
            </ErrorContainer>
            <Retry retryHandler={retryHandler} />
        </RetryWithErrorMsgContainer>
    );
};
