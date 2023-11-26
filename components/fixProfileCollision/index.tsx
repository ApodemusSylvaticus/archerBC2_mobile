import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { ProfileWorker } from '@/core/profileWorker';
import { Text20 } from '@/components/text/styled';

function areStringArraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const copyArr1 = [...arr1];
    const copyArr2 = [...arr2];

    // eslint-disable-next-line no-restricted-syntax
    for (const str of copyArr1) {
        const index = copyArr2.indexOf(str);

        if (index === -1) {
            return false;
        }

        copyArr2.splice(index, 1);
    }

    return true;
}

export const FixProfileCollision: React.FC<PropsWithChildren> = ({ children }) => {
    const [hasCollision, setHasCollision] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFailed, setIsFailed] = useState<boolean>(false);

    const { profileListServerData, fileList } = useActiveProfileStore(state => ({
        profileListServerData: state.profileListServerData,
        fileList: state.fileList,
    }));

    const profileWorker = useMemo(() => new ProfileWorker(), []);

    useEffect(() => {
        if (!profileListServerData) {
            return;
        }
        const list = profileListServerData.profileDesc.map(el => el.filePath);

        if (!areStringArraysEqual(list, fileList)) {
            setHasCollision(true);
        }
    }, [fileList, profileListServerData]);

    const handler = useCallback(async () => {
        try {
            setHasCollision(false);
            setIsLoading(true);
            const profiles = await profileWorker.getAllProfiles(fileList);
            await profileWorker.sendProfilesListData({
                profileDesc: profiles.map(el => ({
                    shortNameTop: el.shortNameTop,
                    profileName: el.profileName,
                    shortNameBot: el.shortNameBot,
                    filePath: el.fileName,
                    cartridgeName: el.cartridgeName,
                })),
                activeprofile: 0,
            });
            setIsLoading(false);
        } catch {
            setIsFailed(true);
        }
    }, [fileList, profileWorker]);

    useEffect(() => {
        if (!hasCollision) {
            return;
        }
        console.log({ profileListServerData, fileList, hasCollision });

        handler();
    }, [hasCollision, fileList, profileListServerData]);

    return isLoading ? (
        <View>
            {isFailed ? (
                <>
                    <Text20>Failed to fix profiles collision</Text20>
                    <Text20>Check your connection and reload page</Text20>
                </>
            ) : (
                <>
                    <Text20>Trying to fix profiles collision...</Text20>
                    <Text20>Check your connection</Text20>
                </>
            )}
        </View>
    ) : (
        children
    );
};
