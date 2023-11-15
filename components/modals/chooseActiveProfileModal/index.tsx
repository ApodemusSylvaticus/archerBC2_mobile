import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import {
    ActiveOnDeviceLabel,
    Button,
    Container,
    DisabledText,
} from '@/components/modals/chooseActiveProfileModal/style';
import { TextSemiBold18, TextSemiBold20 } from '@/components/text/styled';
import { DefaultModal } from '@/components/modals/DefaultModal';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { SeparateRow } from '@/components/container/defaultBox';
import { IProfileCardData } from '@/interface/core/profileProtobuf';
import { ProfileWorker } from '@/core/profileWorker';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';

interface RenderItemProps {
    deviceActiveProfileIndex: number;
    activeProfileFileName: string;
    item: IProfileCardData;
    drag: () => void;
    isActive: boolean;
    getIndex: () => number;
    handlePressButton: (data: string) => void;
}

const RenderItem: React.FC<RenderItemProps> = React.memo(
    ({ item, drag, isActive, activeProfileFileName, getIndex, deviceActiveProfileIndex, handlePressButton }) => {
        const { t } = useTranslation();
        const index = getIndex();

        return (
            <Container
                key={item.filePath}
                onLongPress={drag}
                disabled={isActive}
                isActive={isActive}
                isDisabled={activeProfileFileName === item.filePath}>
                <TextSemiBold20>{item.profileName}</TextSemiBold20>
                <TextSemiBold18>{item.shortNameTop}</TextSemiBold18>
                <TextSemiBold18>{item.shortNameBot}</TextSemiBold18>
                <SeparateRow>
                    {deviceActiveProfileIndex === index && (
                        <ActiveOnDeviceLabel>{t('default_selected_on_device')}</ActiveOnDeviceLabel>
                    )}
                    {activeProfileFileName === item.filePath ? (
                        <Button>
                            <DisabledText>{t('default_selected')}</DisabledText>
                        </Button>
                    ) : (
                        <Button onPress={() => handlePressButton(item.filePath)}>
                            <TextSemiBold18>{t('default_select')}</TextSemiBold18>
                        </Button>
                    )}
                </SeparateRow>
            </Container>
        );
    },
);

export const ChooseActiveProfileModal: React.FC = () => {
    const { t } = useTranslation();
    const sendNotification = useNotificationStore(state => state.sendNotification);

    const { isChooseActiveProfileOpen, closeChooseActiveProfileModal } = useModalControllerStore(state => ({
        isChooseActiveProfileOpen: state.isChooseActiveProfileOpen,
        closeChooseActiveProfileModal: state.closeChooseActiveProfileModal,
    }));
    const { activeProfile, setActiveProfile, profileListServerData, setProfileListServerData } = useActiveProfileStore(
        state => ({
            activeProfile: state.activeProfile,
            setActiveProfile: state.setActiveProfile,
            profileListServerData: state.profileListServerData,
            setProfileListServerData: state.setProfileListServerData,
        }),
    );

    const [localState, setLocalState] = useState(profileListServerData);

    useEffect(() => {
        if (profileListServerData === null || localState !== null) {
            return;
        }
        setLocalState(profileListServerData);
    }, [profileListServerData, localState]);

    const handlePressButton = useCallback((el: string) => {
        closeChooseActiveProfileModal();
        setActiveProfile(el);
    }, []);

    const swipeAction = useCallback(
        async ({ data }: { data: IProfileCardData[] }) => {
            const profileWorker = new ProfileWorker();
            const activeProfileDesc = profileListServerData!.profileDesc[profileListServerData!.activeprofile];
            const activeprofile = data.findIndex(el => el.filePath === activeProfileDesc.filePath);
            setLocalState({ profileDesc: data, activeprofile });

            try {
                await profileWorker.sendProfilesListData({ profileDesc: data, activeprofile });
                setProfileListServerData({ profileDesc: data, activeprofile });
            } catch (e) {
                sendNotification({ msg: t('error_failed_to_update_profile_list'), type: NotificationEnum.ERROR });

                setLocalState(profileListServerData);
            }
        },
        [profileListServerData, sendNotification, setProfileListServerData, t],
    );

    return (
        <DefaultModal backButtonHandler={closeChooseActiveProfileModal} isVisible={isChooseActiveProfileOpen}>
            {localState !== null && (
                <GestureHandlerRootView style={{ flex: 2, overflowY: 'scroll' }}>
                    <DraggableFlatList
                        data={localState.profileDesc}
                        keyExtractor={item => item.filePath}
                        renderItem={props => (
                            <RenderItem
                                {...props}
                                activeProfileFileName={activeProfile}
                                deviceActiveProfileIndex={localState.activeprofile}
                                handlePressButton={handlePressButton}
                            />
                        )}
                        onDragEnd={swipeAction}
                    />
                </GestureHandlerRootView>
            )}
        </DefaultModal>
    );
};
