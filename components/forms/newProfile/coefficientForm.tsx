import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { number } from 'yup';
import { useTranslation } from 'react-i18next';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { BallisticProfileType } from '@/interface/newProfile';
import { AddNewCoeffButton, ButtonContainer, ErrorText, MultiCoefficientWrapper } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { Text20, TextSemiBold20 } from '@/components/text/styled';
import { NumericInput } from '@/components/Inputs/numericInput';
import { Coefficient } from '@/interface/profile';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';

export const MultiCoefficientForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { t } = useTranslation();
    const { ballisticProfile, setMultiCoefficient } = useNewProfileStore(state => ({
        ballisticProfile: state.ballisticProfile,
        setMultiCoefficient: state.setMultiCoefficient,
    }));

    if (ballisticProfile === null || ballisticProfile.type === BallisticProfileType.SINGLE) {
        throw new Error('Use this component with multi ballistic profile');
    }

    const { rem, colors } = useTheme();

    const [coefficients, setCoefficients] = useState(ballisticProfile.coefficient);
    const [handleError, setHandleError] = useState('');

    const addOneMoreCoeff = () => setCoefficients(prevState => [...prevState, { mv: '', bc: '' }]);

    const handleChangeMV = (val: string, index: number) => {
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, mv: val } : el)));
    };
    const handleChangeBC = (val: string, index: number) => {
        setHandleError('');
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, bc: val } : el)));
    };

    const handleSubmit = async () => {
        const validCoefficient: Coefficient[] = [];
        coefficients.forEach(el => {
            const bc = +el.bc;
            if (el.bc === '' || Number.isNaN(bc)) {
                return;
            }
            if (bc <= 0 || bc > 10) {
                return;
            }
            if (el.mv === '') {
                validCoefficient.push({ mv: 0, bc });
                return;
            }

            const mv = +el.mv;

            if (Number.isNaN(mv)) {
                return;
            }

            if (mv <= 0 || mv > 3000) {
                return;
            }
            validCoefficient.push({ mv, bc });
        });

        if (validCoefficient.length === 0) {
            setHandleError('At least 1 coefficient must be filled');
            return;
        }

        setMultiCoefficient(coefficients);
        goForward();
    };

    const { mvSchema, bcSchema } = useValidationSchema();

    return (
        <>
            {coefficients.map((el, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MultiCoefficientWrapper key={index}>
                    <NumericInput
                        uint={t('uint_m_dash_s')}
                        label={t('profile_mv')}
                        value={el.mv}
                        schema={mvSchema}
                        onChangeText={(val: string) => handleChangeMV(val, index)}
                        onBlur={() => undefined}
                        background={colors.appBg}
                    />
                    <NumericInput
                        uint={t('uint_lb_dash_square_in')}
                        label={t('profile_bc')}
                        value={el.bc}
                        schema={bcSchema}
                        onChangeText={(val: string) => handleChangeBC(val, index)}
                        onBlur={() => undefined}
                        background={colors.appBg}
                    />
                </MultiCoefficientWrapper>
            ))}

            {handleError && <ErrorText>{handleError}</ErrorText>}
            {coefficients.length < 5 && (
                <AddNewCoeffButton onPress={addOneMoreCoeff}>
                    <TextSemiBold20>{t('profile_add_new_coefficient')}</TextSemiBold20>
                </AddNewCoeffButton>
            )}

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
                    fillColor={coefficients ? colors.activeTab : colors.l1ActiveEl}
                    onPress={handleSubmit}
                />
            </ButtonContainer>
        </>
    );
};

export const SingleCoefficientForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { t } = useTranslation();

    const { ballisticProfile, setSingleCoefficient } = useNewProfileStore(state => ({
        ballisticProfile: state.ballisticProfile,
        setSingleCoefficient: state.setSingleCoefficient,
    }));
    const { bcSchema } = useValidationSchema();

    if (ballisticProfile === null || ballisticProfile.type === BallisticProfileType.MULTI) {
        throw new Error('Use this component with single ballistic profile');
    }

    const [handleError, setHandleError] = useState('');
    const { rem, colors } = useTheme();
    const [coefficient, setCoefficient] = useState('');
    const handleSubmit = async () => {
        try {
            await number().required().min(0).max(10).validate(coefficient);
            setSingleCoefficient(coefficient);
            goForward();
        } catch (e) {
            setHandleError('Coefficient must be filled');
        }
    };
    const handleChangeCoefficient = (val: string) => {
        setHandleError('');
        setCoefficient(val);
    };

    return (
        <>
            <DefaultRow>
                <NumericInput
                    uint={t('uint_lb_dash_square_in')}
                    label={t('profile_bc')}
                    schema={bcSchema}
                    value={coefficient}
                    onChangeText={handleChangeCoefficient}
                    onBlur={() => undefined}
                    background={colors.appBg}
                />
            </DefaultRow>

            {handleError && <ErrorText>{handleError}</ErrorText>}
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
                    fillColor={coefficient ? colors.activeTab : colors.l1ActiveEl}
                    onPress={handleSubmit}
                />
            </ButtonContainer>
        </>
    );
};

export const CoefficientForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { ballisticProfile } = useNewProfileStore(state => ({
        ballisticProfile: state.ballisticProfile,
    }));

    if (ballisticProfile === null) {
        // TODO ErroBoundary v1

        return <Text20>ErrorBaundary</Text20>;
    }

    switch (ballisticProfile.type) {
        case BallisticProfileType.MULTI:
            return <MultiCoefficientForm goForward={goForward} goBack={goBack} />;
        case BallisticProfileType.SINGLE:
            return <SingleCoefficientForm goBack={goBack} goForward={goForward} />;

        // TODO ErroBoundary v1
        default:
            return <Text20>ErrorBaundary</Text20>;
    }
};
