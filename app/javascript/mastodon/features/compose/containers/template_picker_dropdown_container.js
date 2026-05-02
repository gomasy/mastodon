import { connect } from 'react-redux';

import TemplatePickerDropdown from '../components/template_picker_dropdown';

const mapDispatchToProps = (dispatch, { onPickTemplate }) => ({
  onPickTemplate: template => {
    onPickTemplate(template.content);
  },
});

export default connect(null, mapDispatchToProps)(TemplatePickerDropdown);
