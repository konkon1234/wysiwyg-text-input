# WYSIWYG-TEXT-INPUT

This JavaScript library is where you can enter the characters as if they were editing like the element directly.

## demo

[demo page](http://www.crossl.net/wysiwyg-text-input/demo/)

## support browsers

Chrome / Firefox / Safari / Microsoft Edge / Internet Explorer 11.

## how to use

It can be used only to create an instance.

```javascript
var wysiwyg_text_input =  new WysiwygTextInput(options);
```

## options

| name   | default | description |
| ---    | --- | --- |
| target | .value-cell | css selector for edit target. |
| input_field_tag_id | wysiwyg-text-input | DOM element id for make input field. |
| input_field_wrapper_id | wrapper-wysiwyg-text-input | DOM element id for make input wrapper field. |
| input_text_attribute_name | data-input-value | Set the user input value to this attribute. |
| commit_and_next_focus | true | When you press Enter, and move the focus to the next input element |

## DOM element attribute

You can change the behavior in that you set a specific value to the attribute of the element.

| name | description |
| ---  | --- |
| data-input-type | If you set the textarea allows input of multiple lines |
| data-input-class | Set the value to the class of the input field |
| data-input-maxlength | Set the value to the maxlength of the input field |
| data-input-add-offset-left | You can fine-tune crowded plus the value set in the position of the input field. Negative values can also be entered. |
| data-input-add-width | You can fine-tune crowded plus the value set in the position of the input field. Negative values can also be entered. |
| data-input-add-height | You can fine-tune crowded plus the value set in the position of the input field. Negative values can also be entered. |


## License

MIT License