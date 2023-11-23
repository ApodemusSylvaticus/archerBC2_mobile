import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal } from 'react-native';
import debounce from 'lodash.debounce';
import { useTheme } from 'styled-components/native';
import { Text20 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import {
    BackButton,
    Container,
    ItemContainer,
    NotFoundText,
    RiffleName,
} from '@/components/modals/specificModal/selectBulletModal/style';
import { useNewProfileStore } from '@/store/useNewProfileStore';
// eslint-disable-next-line import/extensions
import dataBullet from '@/constant/dataBullet.json';
import { DefaultRow } from '@/components/container/defaultBox';
import { DefaultInput } from '@/components/Inputs/defaultInput';

interface SelectBulletModalProps {
    isOpen: boolean;
    closeHandler: () => void;
    bDiameter: string;
}

const Item: React.FC<{ title: string; handler: () => void }> = ({ title, handler }) => {
    const { t } = useTranslation();
    return (
        <ItemContainer>
            <RiffleName>{title}</RiffleName>
            <DefaultButton onPress={handler}>
                <Text20>{t('default_select')}</Text20>
            </DefaultButton>
        </ItemContainer>
    );
};

export const SelectBulletModal: React.FC<SelectBulletModalProps> = ({ closeHandler, isOpen, bDiameter }) => {
    const selectBulletFromList = useNewProfileStore(state => state.selectBulletFromList);
    const [filterString, setFilterString] = useState('');
    const { colors } = useTheme();
    const { t } = useTranslation();
    const data = useMemo(() => {
        return dataBullet.map(el => {
            return {
                id: el.ID01.toString(),
                name: el.NAME,
                bDiameter: el.DIAM,
                bWeight: el.MASS_GRAINS,
                bLength: el.LENGTH_IN,
                coefG1: {
                    single: el.BC_1_AVG,
                    multi: [
                        { bcCd: el['BC_1[0]'], mv: el['MACH_1[0]'] },
                        { bcCd: el['BC_1[1]'], mv: el['MACH_1[1]'] },
                        { bcCd: el['BC_1[2]'], mv: el['MACH_1[2]'] },
                        { bcCd: el['BC_1[3]'], mv: el['MACH_1[3]'] },
                    ],
                },
                coefG7: {
                    single: el.BC_2_AVG,
                    multi: [
                        { bcCd: el['BC_2[0]'], mv: el['MACH_2[0]'] },
                        { bcCd: el['BC_2[1]'], mv: el['MACH_2[1]'] },
                        { bcCd: el['BC_2[2]'], mv: el['MACH_2[2]'] },
                        { bcCd: el['BC_2[3]'], mv: el['MACH_2[3]'] },
                    ],
                },
            };
        });
    }, []);

    // TODO optimization, to many rerender by bDiameter props
    const currentData = useMemo(() => data.filter(res => res.bDiameter === +bDiameter), [data, bDiameter]);

    const [filteredData, setFilteredData] = useState(currentData);

    const handleClose = () => {
        setFilterString('');
        closeHandler();
    };
    const filter = useMemo(
        () =>
            debounce(str => {
                setFilteredData(currentData.filter(el => el.name.toLowerCase().includes(str.toLowerCase())));
            }, 300),
        [currentData],
    );

    useEffect(() => {
        filter(filterString);
    }, [filterString, filter]);

    const itemHandler = (val: (typeof data)[0]) => {
        selectBulletFromList(val);
        handleClose();
    };

    return (
        <Modal visible={isOpen} animationType="slide">
            <Container>
                <BackButton onPress={handleClose}>
                    <Text20>{t('default_go_back')}</Text20>
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

                {filteredData.length === 0 && (
                    <NotFoundText>{t('profile_nothing_founded_bullet', { bDiameter })}</NotFoundText>
                )}

                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <Item title={item.name} handler={() => itemHandler(item)} />}
                    keyExtractor={item => item.id}
                />
            </Container>
        </Modal>
    );
};
