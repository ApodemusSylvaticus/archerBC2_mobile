import { IBullet, ICartridge, IDescription, IRiffle, IZeroing, Profile } from '@/interface/profile';
import { WithFileName } from '@/interface/helper';
import { ICartridgeForm, IRiffleForm } from '@/interface/newProfile';
import { IDraggableListItem } from '@/store/useModalControllerStore';

export interface IForm {
    goBack: () => void;
    goForward: () => void;
}

export interface IHandleChange<T> {
    handleChange: (data: WithFileName<T>) => void;
}

export type RiffleProfileProps = WithFileName<IRiffle> & IHandleChange<IRiffle>;
export type CartridgeProfileProps = WithFileName<ICartridge> & IHandleChange<ICartridge>;
export type DescriptionProfileProps = WithFileName<IDescription> &
    IHandleChange<IDescription & { prevFileName: string }> & { isFileNameChangeable: boolean };
export type BulletProfileProps = WithFileName<IBullet> & IHandleChange<IBullet>;
export type ZeroingProfileProps = WithFileName<IZeroing> & IHandleChange<IZeroing>;

export type NavigationFormType = { type: 'V1'; goBack: () => void } | { type: 'V2' };

export interface RiffleProfileFormProps {
    riffle: WithFileName<IRiffleForm>;
    onSubmit: (data: WithFileName<IRiffleForm>) => void;
    navigation: NavigationFormType;
    labelBg: string;
    withList: boolean;
}

export interface CartridgeProfileFormProps {
    cartridge: WithFileName<ICartridgeForm>;
    onSubmit: (data: WithFileName<ICartridgeForm>) => void;
    navigation: NavigationFormType;
    labelBg: string;
}

export interface DescriptionProfileFormProps {
    isFileNameChangeable: boolean;
    description: WithFileName<IDescription>;
    onSubmit: (data: WithFileName<IDescription & { prevFileName: string }>) => void;
    close: () => void;
}

export interface BulletProfileFormProps {
    bullet: WithFileName<IBullet>;
    onSubmit: (data: WithFileName<IBullet>) => void;
    close: () => void;
}

export interface ZeroingProfileFormProps {
    zeroing: WithFileName<IZeroing>;
    onSubmit: (data: WithFileName<IZeroing>) => void;
    close: () => void;
}

export interface IProfileProps extends Profile {
    isFileNameChangeable: boolean;
    setZeroing: (data: WithFileName<IZeroing>) => void;
    setBullet: (data: WithFileName<IBullet>) => void;
    setDescription: (data: WithFileName<IDescription & { prevFileName: string }>) => void;
    setCartridge: (data: WithFileName<ICartridge>) => void;
    setRiffle: (data: WithFileName<IRiffle>) => void;
    setDistances: (data: IDraggableListItem[]) => void;
}
