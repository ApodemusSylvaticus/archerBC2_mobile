import React, { useCallback, useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DistanceContainer } from '@/components/draggebleDistanceList/style';
import { Text20 } from '@/components/text/styled';
import { IDraggableListItem, useModalControllerStore } from '@/store/useModalControllerStore';
import { ContentContainer } from '@/components/modals/style';
import { InputWrapper } from '@/components/modals/draggebleDistanceList/style';
import { NumericInput } from '@/components/Inputs/numericInput';
import { TrashSVG } from '@/components/svg/trash';
import { AcceptButton, DefaultButton } from '@/components/button/style';

interface RenderItemProps {
    item: IDraggableListItem;
    drag: () => void;
    isActive: boolean;
    removeDistant: (item: IDraggableListItem) => void;
}

const RenderItem: React.FC<RenderItemProps> = React.memo(({ item, drag, isActive, removeDistant }) => {
    const { colors, rem } = useTheme();

    const onRemove = () => {
        removeDistant(item);
    };

    return (
        <DistanceContainer onLongPress={drag} disabled={isActive} isActive={isActive}>
            <Text20> {item.title}</Text20>
            {item.isZeroDistance === false && (
                <TrashSVG width={rem * 2.4} height={rem * 2.4} fillColor={colors.primary} onPress={onRemove} />
            )}
        </DistanceContainer>
    );
});

export const DraggableDistanceList: React.FC = () => {
    const { distanceList, handler, zeroDistanceIdx, closeModal } = useModalControllerStore(state => ({
        distanceList: state.distanceList,
        handler: state.distanceListHandler,
        zeroDistanceIdx: state.zeroDistanceIdx,
        closeModal: state.closeDistanceList,
    }));

    const { t } = useTranslation();
    const id = useRef<number>(0);

    const [newDistantValue, setNewDistantValue] = useState('');
    const { colors } = useTheme();

    const [state, setState] = useState(
        distanceList.map((el, index) => {
            const val = {
                title: el.toString(),
                isZeroDistance: index === zeroDistanceIdx,
                id: id.current.toString(),
            };

            id.current += 1;
            return val;
        }),
    );
    const saveChangesButton = () => {
        handler(state);
        closeModal();
    };

    const swapAction = (data: IDraggableListItem[]) => {
        setState(data);
    };

    const addNewDistant = () => {
        if (newDistantValue && +newDistantValue > 0) {
            setState(prevState => [
                { id: id.current.toString(), isZeroDistance: false, title: newDistantValue.toString() },
                ...prevState,
            ]);
            id.current += 1;
            setNewDistantValue('');
        }
    };

    const removeDistant = useCallback((item: IDraggableListItem) => {
        setState(prevState => prevState.filter(el => el.id !== item.id));
    }, []);

    return (
        <ContentContainer style={{ flex: 1, height: '100%' }}>
            <InputWrapper>
                <NumericInput
                    value={newDistantValue}
                    onChangeText={setNewDistantValue}
                    label="Add new distant"
                    onBlur={() => undefined}
                    uint="m"
                    background={colors.appBg}
                />

                <DefaultButton onPress={addNewDistant}>
                    <Text20>{t('default_add')}</Text20>
                </DefaultButton>
            </InputWrapper>

            <GestureHandlerRootView style={{ flex: 2, overflowY: 'scroll' }}>
                <DraggableFlatList
                    data={state}
                    keyExtractor={item => item.id}
                    renderItem={props => <RenderItem {...props} removeDistant={removeDistant} />}
                    onDragEnd={({ data }) => swapAction(data)}
                />
            </GestureHandlerRootView>

            <AcceptButton onPress={saveChangesButton}>
                <Text20>{t('default_save_changes')}</Text20>
            </AcceptButton>
        </ContentContainer>
    );
};
