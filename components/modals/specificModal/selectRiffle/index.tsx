import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal } from 'react-native';
import { useTheme } from 'styled-components/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';
// eslint-disable-next-line import/extensions
import dataBullet from '@/constant/dataBullet.json';
import { Text20 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { BackButton, Container, ItemContainer, RiffleName } from '@/components/modals/specificModal/selectRiffle/style';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { DefaultRow } from '@/components/container/defaultBox';
import { useNewProfileStore } from '@/store/useNewProfileStore';

interface SelectRiffleModalProps {
    isOpen: boolean;
    closeHandler: () => void;
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

export const SelectRiffleModal: React.FC<SelectRiffleModalProps> = ({ closeHandler, isOpen }) => {
    const [filterString, setFilterString] = useState('');
    const selectRiffleFromList = useNewProfileStore(state => state.selectRiffleFromList);
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
    const [filteredData, setFilteredData] = useState(data);

    const filter = useMemo(
        () =>
            debounce(str => {
                setFilteredData(data.filter(el => el.name.toLowerCase().includes(str.toLowerCase())));
            }, 300),
        [],
    );

    const itemHandler = (val: (typeof data)[0]) => {
        selectRiffleFromList(val);
        closeHandler();
    };

    useEffect(() => {
        filter(filterString);
    }, [filterString, filter]);

    return (
        <Modal visible={isOpen} animationType="slide">
            <Container>
                <BackButton onPress={closeHandler}>
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

                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <Item title={item.name} handler={() => itemHandler(item)} />}
                    keyExtractor={item => item.id}
                />
            </Container>
        </Modal>
    );
};
