import { useTheme } from 'styled-components/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { SelectInput } from '@/components/Inputs/select/select';
import { ballisticFunctionList } from '@/constant/data';

export const BallisticProfileForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { t } = useTranslation();
    const { rem, colors } = useTheme();

    const { range, setRange, ballisticProfile, setBallisticProfile, setBallisticFunctionType, ballisticFunction } =
        useNewProfileStore(state => ({
            range: state.range,
            ballisticFunction: state.ballisticFunction,
            ballisticProfile: state.ballisticProfile,
            setRange: state.setRange,
            setBallisticFunctionType: state.setBallisticFunctionType,
            setBallisticProfile: state.setBallisticProfile,
        }));

    const [actualRange, setActualRange] = useState(range);

    const [actualBallisticFunction, setActualBallisticFunction] = useState(ballisticFunction);
    const [actualBallisticProfile, setActualBallisticProfile] = useState(
        ballisticProfile ? ballisticProfile.type : null,
    );

    const checkIsAllCorrect = () => {
        return actualBallisticFunction !== null && actualBallisticProfile !== null && actualRange !== null;
    };
    const handleSubmit = () => {
        if (checkIsAllCorrect()) {
            setRange(actualRange!);
            setBallisticProfile(actualBallisticProfile!);
            setBallisticFunctionType(actualBallisticFunction!);
            goForward();
        }
    };

    const rangeList = [
        t('profile_range_subsonic'),
        t('profile_range_short'),
        t('profile_range_middle'),
        t('profile_range_long'),
    ];

    const ballisticProfileList = [t('profile_ballistic_profile_single'), t('profile_ballistic_profile_multi')];

    return (
        <>
            <SelectInput
                label={t('profile_range_list_title')}
                background={colors.appBg}
                chosenEl={actualRange}
                list={rangeList}
                setElem={val => setActualRange(val)}
                zIndex={4}
            />
            <SelectInput
                label={t('profile_ballistic_function')}
                background={colors.appBg}
                chosenEl={actualBallisticFunction}
                list={ballisticFunctionList}
                setElem={val => setActualBallisticFunction(val)}
                zIndex={3}
            />
            <SelectInput
                label={t('profile_ballistic_profile')}
                background={colors.appBg}
                chosenEl={actualBallisticProfile}
                list={ballisticProfileList}
                setElem={val => setActualBallisticProfile(val)}
                zIndex={2}
            />

            <ButtonContainer>
                <ArrowSVG
                    orientation="left"
                    width={rem * 5.5}
                    height={rem * 5.5}
                    fillColor={colors.primary}
                    onPress={() => goBack()}
                />
                <ArrowSVG
                    orientation="right"
                    width={rem * 5.5}
                    height={rem * 5.5}
                    fillColor={checkIsAllCorrect() ? colors.activeTab : colors.l1ActiveEl}
                    onPress={handleSubmit}
                />
            </ButtonContainer>
        </>
    );
};
