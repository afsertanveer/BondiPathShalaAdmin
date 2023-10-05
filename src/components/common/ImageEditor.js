import React from "react";
import TuiImageEditor from "tui-image-editor";
export class ImageEditor extends React.Component {
    rootEl = React.createRef();
    imageEditorInst = null;
  
    componentDidMount() {
      this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
        ...this.props
      });
    }
  
    componentWillUnmount() {
      // this.unbindEventHandlers();
      this.imageEditorInst.destroy();
      this.imageEditorInst = null;
    }
  
    render() {
      return <div ref={this.rootEl} />;
    }
  }