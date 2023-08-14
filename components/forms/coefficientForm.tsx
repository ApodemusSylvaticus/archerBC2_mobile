import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { Button, View } from 'react-native';
import { number, array, object } from 'yup';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { BallisticProfileType } from '@/interface/newProfile';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { IForm } from '@/interface/form';
import { Text20 } from '@/components/text/styled';

export const MultiCoefficientForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { ballisticProfile, setMultiCoefficient } = useNewProfileStore(state => ({
        ballisticProfile: state.ballisticProfile,
        setMultiCoefficient: state.setMultiCoefficient,
    }));

    if (ballisticProfile === null || ballisticProfile.type === BallisticProfileType.SINGLE) {
        throw new Error('Use this component with multi ballistic profile');
    }

    const { rem, colors } = useTheme();

    const [coefficients, setCoefficients] = useState(ballisticProfile.coefficient);

    const addOneMoreCoeff = () => setCoefficients(prevState => [...prevState, { mv: '', bc: '' }]);

    const handleChangeMV = (val: string, index: number) => {
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, mv: val } : el)));
    };
    const handleChangeBC = (val: string, index: number) => {
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, bc: val } : el)));
    };

    const handleSubmit = async () => {
        try {
            const validSchema = object().shape({
                mv: number().max(0).min(100),
                bc: number().required().min(0).max(100),
            });
            await array().of(validSchema).validate(coefficients);
            setMultiCoefficient(coefficients);
            goForward();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            {coefficients.map((el, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 8 }}>
                    <DefaultInput
                        label="mv"
                        value={el.mv}
                        onChangeText={(val: string) => handleChangeMV(val, index)}
                        error={undefined}
                        touched={undefined}
                        onBlur={() => undefined}
                        style={{ width: 'auto', flexGrow: 1 }}
                        background={colors.appBg}
                    />
                    <DefaultInput
                        label="bc"
                        value={el.bc}
                        onChangeText={(val: string) => handleChangeBC(val, index)}
                        error={undefined}
                        touched={undefined}
                        onBlur={() => undefined}
                        style={{ width: 'auto', flexGrow: 1 }}
                        background={colors.appBg}
                    />
                </View>
            ))}
            <Button title="Dobav" onPress={addOneMoreCoeff} />
            <ButtonContainer>
                <ArrowSVG orientation="left" size={rem * 5.5} fillColor={colors.secondary} onPress={() => goBack()} />
                <ArrowSVG
                    orientation="right"
                    size={rem * 5.5}
                    fillColor={coefficients ? colors.activeTab : colors.l1ActiveEl}
                    onPress={handleSubmit}
                />
            </ButtonContainer>
        </>
    );
};

export const SingleCoefficientForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { ballisticProfile, setSingleCoefficient } = useNewProfileStore(state => ({
        ballisticProfile: state.ballisticProfile,
        setSingleCoefficient: state.setSingleCoefficient,
    }));

    if (ballisticProfile === null || ballisticProfile.type === BallisticProfileType.MULTI) {
        throw new Error('Use this component with single ballistic profile');
    }
    const { rem, colors } = useTheme();
    const [coefficient, setCoefficient] = useState('');
    const handleSubmit = async () => {
        try {
            await number().required().min(0).max(100).validate(coefficient);
            setSingleCoefficient(coefficient);
            goForward();
        } catch (e) {
            console.log(e);
        }
    };
    const handleChangeCoefficient = (val: string) => {
        setCoefficient(val);
    };

    return (
        <>
            <DefaultInput
                label="bc"
                value={coefficient}
                onChangeText={handleChangeCoefficient}
                error={undefined}
                touched={undefined}
                keyboardType="numeric"
                onBlur={() => undefined}
                background={colors.appBg}
            />
            <ButtonContainer>
                <ArrowSVG orientation="left" size={rem * 5.5} fillColor={colors.secondary} onPress={() => goBack()} />
                <ArrowSVG
                    orientation="right"
                    size={rem * 5.5}
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
