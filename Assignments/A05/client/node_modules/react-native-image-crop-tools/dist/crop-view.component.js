import React, { createRef } from 'react';
import { findNodeHandle, requireNativeComponent, UIManager, } from 'react-native';
const RCTCropView = requireNativeComponent('CropView');
class CropView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.viewRef = createRef();
        this.saveImage = (preserveTransparency = true, quality = 90) => {
            UIManager.dispatchViewManagerCommand(findNodeHandle(this.viewRef.current), UIManager.getViewManagerConfig('CropView').Commands.saveImage, [preserveTransparency, quality]);
        };
        this.rotateImage = (clockwise = true) => {
            UIManager.dispatchViewManagerCommand(findNodeHandle(this.viewRef.current), UIManager.getViewManagerConfig('CropView').Commands.rotateImage, [clockwise]);
        };
    }
    render() {
        const { onImageCrop, aspectRatio, ...rest } = this.props;
        return (React.createElement(RCTCropView, Object.assign({ ref: this.viewRef, cropAspectRatio: aspectRatio, onImageSaved: (event) => {
                onImageCrop(event.nativeEvent);
            } }, rest)));
    }
}
CropView.defaultProps = {
    keepAspectRatio: false,
    iosDimensionSwapEnabled: false,
};
export default CropView;
