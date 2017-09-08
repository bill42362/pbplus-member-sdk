// ImageInputBoxContainer.js
import { connect } from 'react-redux';
import React from 'react';
import PictureEditor from './PictureEditor.js';
import { PbplusImageInputBox } from 'pbplus-member-ui';

const ImageInputBoxContainer = connect(
    (state, ownProps) => { return {
        editorState: state.pbplusMemberCenter.pictureEditor,
    }; },
    (dispatch, ownProps) => { return {
        updateImageSource: (url) => { dispatch(PictureEditor.Actions.updateImageSource(url)); },
        movePicture: (move) => { dispatch(PictureEditor.Actions.movePicture(move)); },
        stretchPicture: (stretch) => { dispatch(PictureEditor.Actions.stretchPicture(stretch)); },
    }; }
)(PbplusImageInputBox);

export default ImageInputBoxContainer;
