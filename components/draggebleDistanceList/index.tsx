import React, { useState } from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DistanceContainer } from '@/components/draggebleDistanceList/style';
import { Text20 } from '@/components/text/styled';

interface IDATA {
    title: string;
    isZeroDistance: boolean;
    id: string;
}
// TODO
export const DraggebleDistanceList: React.FC<{
    distances: number[];
    cZeroDistanceIdx: number;
}> = ({ distances, cZeroDistanceIdx }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    /*
    const id = useRef(distances.length);
*/
    const [state, setState] = useState<IDATA[]>(
        distances.map((el, index) => ({
            title: el.toString(),
            isZeroDistance: index === cZeroDistanceIdx,
            id: index.toString(),
        })),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <DistanceContainer onLongPress={drag} disabled={isActive}>
                    <Text20> {item.title}</Text20>
                </DistanceContainer>
            </ScaleDecorator>
        );
    };

    return (
        <GestureHandlerRootView style={{ width: '100%', height: '100%' }}>
            <DraggableFlatList
                data={state}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                onDragEnd={({ data }) => setState(data)}
            />
        </GestureHandlerRootView>
    );
};
