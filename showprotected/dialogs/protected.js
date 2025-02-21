CKEDITOR.dialog.add('showProtectedDialog', function (editor) {
  return {
    title: 'Edit Protected Source',
    minWidth: 300,
    minHeight: 60,
    onOk: function () {
      // get the cleaned text from the input field
      const cleanedCommentText = this.getContentElement('info', 'txtProtectedSource').getValue();
      const encodedSourceValue = CKEDITOR.plugins.showprotected.encodeProtectedSource(cleanedCommentText);

      // get the selected element
      const selectedElement = CKEDITOR.plugins.showprotected.selectedElement;

      // set data in the dataset
      const oldCleanedCommentText = selectedElement.$.dataset.cleanedCommentText;
      selectedElement.$.dataset.cleanedCommentText = cleanedCommentText;
      selectedElement.$.dataset.encodedCommentText = encodedSourceValue;

      // update source code
      let sourceCode = editor.getData();
      sourceCode = sourceCode.replace(oldCleanedCommentText, cleanedCommentText);
      editor.setData(sourceCode);
    },
    onHide: function () {
      CKEDITOR.plugins.showprotected.selectedElement = undefined;
    },
    onShow: function () {
      const selectedElement = CKEDITOR.plugins.showprotected.selectedElement;
      const decodedSourceValue = selectedElement.$.dataset.cleanedCommentText;
      this.setValueOf('info', 'txtProtectedSource', decodedSourceValue);
    },
    contents: [
      {
        id: 'info',
        label: 'Edit Protected Source',
        accessKey: 'I',
        elements: [
          {
            type: 'textarea',
            id: 'txtProtectedSource',
            label: 'Value',
            required: true,
            validate: function () {
              if (!this.getValue()) {
                alert('The value cannot be empty');
                return false;
              }
              return true;
            },
            inputStyle: 'height:200px;width:100%;',
          }
        ]
      }
    ]
  };
});