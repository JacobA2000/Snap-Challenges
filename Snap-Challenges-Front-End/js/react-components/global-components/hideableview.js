import React, { Component } from 'react';
import { View } from 'react-native';
import { PropTypes } from 'prop-types';

class HideableView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <View style={[this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

HideableView.propTypes = {
  visible: PropTypes.bool.isRequired,
}

export default HideableView;