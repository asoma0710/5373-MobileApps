import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
declare type Response = {
    uri: string;
    width: number;
    height: number;
};
declare type Props = {
    sourceUrl: string;
    style?: StyleProp<ViewStyle>;
    onImageCrop?: (res: Response) => void;
    keepAspectRatio?: boolean;
    aspectRatio?: {
        width: number;
        height: number;
    };
    iosDimensionSwapEnabled?: boolean;
};
declare class CropView extends React.PureComponent<Props> {
    static defaultProps: {
        keepAspectRatio: boolean;
        iosDimensionSwapEnabled: boolean;
    };
    private viewRef;
    saveImage: (preserveTransparency?: boolean, quality?: number) => void;
    rotateImage: (clockwise?: boolean) => void;
    render(): JSX.Element;
}
export default CropView;
