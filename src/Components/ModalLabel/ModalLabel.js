import React from "react";

class ModalLabel extends React.Component {
  render() {
    const { togglemodal, isOpen } = this.props;
    return (
      <div
        className={`modalLabel ${isOpen && "active"}`}
        onClick={togglemodal}
      ></div>
    );
  }
}

export default ModalLabel;
