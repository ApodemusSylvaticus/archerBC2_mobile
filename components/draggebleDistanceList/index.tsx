import React, { useEffect, useState } from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { DistanceContainer } from '@/components/draggebleDistanceList/style';
import { Text20 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ContentContainer } from '@/components/modals/style';
import { InputWrapper } from '@/components/modals/draggebleDistanceList/style';
import { NumericInput } from '@/components/Inputs/numericInput';
import { PureArrow } from '@/components/svg/pureArrow';
import { TrashSVG } from '@/components/svg/trash';

interface IDATA {
    title: string;
    isZeroDistance: boolean;
    id: string;
}
export const DraggableDistanceList: React.FC = () => {
    const { distanceListId } = useModalControllerStore(state => ({
        distanceListId: state.distanceListId,
    }));
    const { setDistance, profiles } = useProfileStore(state => ({
        setDistance: state.setDistance,
        profiles: state.profiles,
    }));

    const [newDistantValue, setNewDistantValue] = useState('');
    const { colors, rem } = useTheme();

    const [state, setState] = useState<IDATA[]>([]);

    useEffect(() => {
        const actualProfile = profiles.find(el => el.id === distanceListId);
        if (actualProfile) {
            setState(
                actualProfile.distances.map((el, index) => ({
                    title: el.toString(),
                    isZeroDistance: index === actualProfile.cZeroDistanceIdx,
                    id: index.toString(),
                })),
            );
        }
    }, [profiles, distanceListId]);

    const swapAction = (data: IDATA[]) => {
        setDistance({ id: distanceListId, distances: data.map(el => +el.title) });
    };

    const addNewDistant = () => {
        if (newDistantValue && +newDistantValue > 0) {
            const newDistances = [+newDistantValue, ...state.map(el => +el.title)];
            setDistance({ distances: newDistances, id: distanceListId });
            setNewDistantValue('');
        }
    };

    const removeDistant = (item: IDATA) => {
        const newDistances = state.filter(el => el.id !== item.id).map(el => +el.title);
        setDistance({ distances: newDistances, id: distanceListId });
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <DistanceContainer onLongPress={drag} disabled={isActive}>
                    <Text20> {item.title}</Text20>
                    <TrashSVG
                        width={rem * 2}
                        height={rem * 2}
                        fillColor={colors.primary}
                        onPress={() => removeDistant(item)}
                    />
                </DistanceContainer>
            </ScaleDecorator>
        );
    };

    return (
        <ContentContainer>
            <InputWrapper>
                <NumericInput
                    value={newDistantValue}
                    onChangeText={setNewDistantValue}
                    label="Add new distant"
                    onBlur={() => undefined}
                    uint="m"
                    background={colors.appBg}>
                    <PureArrow
                        orientation="right"
                        width={rem * 2}
                        height={rem * 2}
                        fillColor={colors.primary}
                        onPress={addNewDistant}
                    />
                </NumericInput>
            </InputWrapper>
            <GestureHandlerRootView style={{ width: '100%', height: '100%' }}>
                <DraggableFlatList
                    data={state}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    onDragEnd={({ data }) => swapAction(data)}
                />
            </GestureHandlerRootView>
        </ContentContainer>
    );
};
