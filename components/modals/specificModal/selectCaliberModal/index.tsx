import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import debounce from 'lodash.debounce';
import { FlatList, Modal } from 'react-native';
import {
    BackButton,
    Container,
    ItemContainer,
    RiffleName,
} from '@/components/modals/specificModal/selectBulletModal/style';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { DefaultRow } from '@/components/container/defaultBox';
import { DefaultInput } from '@/components/Inputs/defaultInput';
// eslint-disable-next-line import/extensions
import caliberData from '@/constant/caliberData.json';

interface SelectCaliberModalProps {
    isOpen: boolean;
    closeHandler: () => void;
}

const Item: React.FC<{ title: string; handler: () => void }> = ({ title, handler }) => {
    const { t } = useTranslation();
    return (
        <ItemContainer>
            <RiffleName>{title}</RiffleName>
            <DefaultButton onPress={handler}>
                <TextSemiBold20>{t('default_select')}</TextSemiBold20>
            </DefaultButton>
        </ItemContainer>
    );
};

export const SelectCaliberModal: React.FC<SelectCaliberModalProps> = ({ closeHandler, isOpen }) => {
    const [filterString, setFilterString] = useState('');
    const selectCaliberFromList = useNewProfileStore(state => state.selectCaliberFromList);
    const { colors } = useTheme();
    const { t } = useTranslation();
    const data = useMemo(() => {
        return caliberData.map(el => {
            return {
                name: el.name,
                bDiameter: el.bDiameter,
            };
        });
    }, []);
    const [filteredData, setFilteredData] = useState(data);

    const filter = useMemo(
        () =>
            debounce(str => {
                setFilteredData(data.filter(el => el.name.toLowerCase().includes(str.toLowerCase())));
            }, 300),
        [],
    );

    const itemHandler = (val: (typeof data)[0]) => {
        selectCaliberFromList(val);
        closeHandler();
    };

    useEffect(() => {
        filter(filterString);
    }, [filterString, filter]);

    return (
        <Modal visible={isOpen} animationType="slide">
            <Container>
                <BackButton onPress={closeHandler}>
                    <TextSemiBold20>{t('default_go_back')}</TextSemiBold20>
                </BackButton>
                <DefaultRow>
                    <DefaultInput
                        label={t('profile_riffle_search')}
                        value={filterString}
                        onChangeText={setFilterString}
                        background={colors.cardBg}
                        onBlur={() => undefined}
                    />
                </DefaultRow>

                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <Item title={item.name} handler={() => itemHandler(item)} />}
                    keyExtractor={item => item.name}
                />
            </Container>
        </Modal>
    );
};
