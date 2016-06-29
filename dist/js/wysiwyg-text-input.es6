"use strict";

export default class WysiwygTextInput {

    constructor(options) {
        this.options = Object.assign({},
            {
                target: ".value-cell",
                input_field_tag_id: "wysiwyg-text-input",
                input_field_wrapper_id: "wrapper-wysiwyg-text-input",
                input_text_attribute_name: "data-input-value",
                commit_and_next_focus: true,
                complete: function (elem) {
                }
            }, options);
        this._editWrapperElement = null;
        this._editElement = null;
        this._clickElement = null;
        this._restoreValue = null;

        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onTargetClick = this._onTargetClick.bind(this);
        this._onTextAreaKeyDown = this._onTextAreaKeyDown.bind(this);
        this._onInputTextKeyDown = this._onInputTextKeyDown.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this.bindEvent();
    }

    get _inputTagId() {
        return this.options.input_field_tag_id;
    }

    get _inputWrapperId() {
        return this.options.input_field_wrapper_id;
    }

    static get _supportDomAttributes() {
        return ["maxlength"];
    }

    bindEvent() {
        var body = document.getElementsByTagName("html").item(0);

        body.addEventListener("click", this._onDocumentClick);

        Array.prototype.slice.call(document.querySelectorAll(this.options.target)).forEach((elem) => {
            elem.addEventListener("click", this._onTargetClick);
        });

        //
        window.addEventListener("resize", (e) => {
            this._setEditElementPos(this._editWrapperElement, this._clickElement);
        });
    }

    _getObjectOffsetRect(elem, rect) {
        if (elem == null) {
            return rect;
        }

        rect.left += elem.offsetLeft;
        rect.top += elem.offsetTop;

        if (elem.offsetParent == null) {
            return rect;
        }

        return this._getObjectOffsetRect(elem.offsetParent, rect);
    }

    _onDocumentClick(e) {
        if (!this.editing) {
            return;
        }

        if (e.target == this._editElement) {
            e.stopPropagation();
            return;
        }

        this._commit();
    }

    _onTargetClick(e) {
        var editElement
            , editWrapperElement;

        let clickElement = e.target;

        if (this.editing) {
            this._commit();
        }

        editWrapperElement = document.createElement("div");
        editWrapperElement.setAttribute("id", this._inputWrapperId);
        editWrapperElement.style.position = "absolute";
        editWrapperElement.style.margin = 0;
        editWrapperElement.style.padding = 0;
        this._setEditElementPos(editWrapperElement, clickElement);

        var getDefaultValue = (elem) => {
            var value = elem.getAttribute(this.options.input_text_attribute_name);
            if (value == null) {
                return "";
            }
            return value;
        };

        if (clickElement.getAttribute("data-input-type") == "textarea") {
            // textarea
            editElement = document.createElement("textarea");
            editElement.addEventListener("keydown", this._onTextAreaKeyDown);
            editElement.textContent = getDefaultValue(clickElement).trim();
        } else {
            // input[type="text"]
            editElement = document.createElement("input");
            editElement.setAttribute("type", "text");
            editElement.value = getDefaultValue(clickElement).trim();
            editElement.addEventListener("keydown", this._onInputTextKeyDown);
        }

        editElement.setAttribute("id", this._inputTagId);
        editElement.style.margin = 0;
        editElement.style.width = "100%";
        editElement.style.height = editWrapperElement.style.height;

        // add css class
        let optionClassName = clickElement.getAttribute("data-input-class");
        if (optionClassName != null) {
            optionClassName.trim().split(" ").forEach((val, index, arr) => {
                editElement.classList.add(val);
            });
        }
        editElement.addEventListener("focus", this._onFocus);

        // set option attributes
        WysiwygTextInput._supportDomAttributes.forEach((attr_name, index, arr) => {
            var val = clickElement.getAttribute("data-input-" + attr_name);

            if (val != null) {
                editElement.setAttribute(attr_name, val);
            }
        });

        editWrapperElement.appendChild(editElement);

        document.getElementsByTagName("body").item(0).appendChild(editWrapperElement);

        this._editWrapperElement = editWrapperElement;
        this._editElement = editElement;
        this._clickElement = clickElement;
        //this._restoreValue = clickElement.textContent;
        this._restoreValue = getDefaultValue(clickElement);
        clickElement.textContent = "";

        editElement.focus();

        // stop parent event notice
        e.stopPropagation();
    }

    _onFocus(e) {
        this._editWrapperElement.classList.add("active");
    }

    _setEditElementPos(editElement, clickElement) {
        if (clickElement == null) {
            return;
        }

        let clickElemOffsetRect = this._getObjectOffsetRect(clickElement, {left: 0, top: 0})
            , clickElementRect = clickElement.getBoundingClientRect();

        var getIntAttr = function (elem, attrName) {
            var val = elem.getAttribute(attrName);

            if (val == null) {
                return 0;
            }

            return parseInt(val, 10);
        };

        editElement.style.left = (getIntAttr(clickElement, "data-input-add-offset-left") + clickElemOffsetRect.left) + "px";
        editElement.style.top = (getIntAttr(clickElement, "data-input-add-offset-top") + clickElemOffsetRect.top) + "px";
        editElement.style.width = (getIntAttr(clickElement, "data-input-add-width") + clickElementRect.width) + "px";
        editElement.style.height = (getIntAttr(clickElement, "data-input-add-height") + clickElementRect.height) + "px";

        return editElement;
    }

    _onInputTextKeyDown(e) {
        var key = e.which || e.keyCode || 0;
        var shiftKey = Boolean(e.shiftKey);

        if (key == 9) { // tab
            e.preventDefault();
            this._focusNextNode(this._clickElement, !shiftKey);

            return;
        }

        if (key == 13) { // enter
            var elem = this._clickElement;
            this._commit();
            this._focusNextNode(elem, true);
            return;
        }

        if (key == 27) { // escape
            this.cancel();
            return;
        }
    }

    _onTextAreaKeyDown(e) {
        var key = e.which || e.keyCode || 0;
        var shiftKey = Boolean(e.shiftKey);

        if (key == 9) { // tab
            e.preventDefault();

            if (shiftKey) {
                this._focusNextNode(this._clickElement, false);
            } else {
                this._focusNextNode(this._clickElement, true);
            }

            return;
        }

        if (key == 13 && !shiftKey) { // enter
            var elem = this._clickElement;
            this._commit();
            this._focusNextNode(elem, true);
            return;
        }

        if (key == 27) { // escape
            this.cancel();
            return;
        }
    }

    _focusNextNode(clickElement, next) {
        var nextElement;

        nextElement = this._searchNextNode(clickElement, clickElement.getAttribute("data-input-prev-node"), next);
        if (nextElement == null) {
            return;
        }

        nextElement.click();
    }

    _searchNextNode(clickElement, nextCssSelect, searchNext) {
        var nextElement
            , valueElements
            , i
            , nextIndex;

        if (!this.options.commit_and_next_focus) {
            return;
        }

        if (nextCssSelect == null) {
            valueElements = document.querySelectorAll(this.options.target);
            if (valueElements == null) {
                return;
            }

            for (i = 0; i < valueElements.length; i++) {
                if (valueElements[i] == clickElement) {
                    nextIndex = searchNext ? i + 1 : i - 1;

                    if (nextIndex < 0) {
                        nextIndex = valueElements.length - 1;
                    } else if (nextIndex >= valueElements.length) {
                        nextIndex = 0;
                    }

                    if (valueElements[nextIndex] != clickElement) {
                        nextElement = valueElements[nextIndex];
                    }
                    break;
                }
            }
        }
        else {
            nextElement = document.querySelectorAll(nextCssSelect).item(0);
        }

        return nextElement;
    }

    _escapeTags(str) {
        //return str.replace(/<[^>]*>/g, "");
        return str.replace("<", "＜").replace(">", "＞");
    }

    _convertInputToHtml(str) {
        return this._escapeTags(str).replace(/(\r\n|\r|\n)/g, "<br/ >");
    }

    _commit() {
        var clickElement = this._clickElement,
            elementComplete = clickElement.getAttribute("data-input-complete");

        this._clickElement.setAttribute(this.options.input_text_attribute_name, this._escapeTags(this._editElement.value));
        this._clickElement.innerHTML = this._convertInputToHtml(this._editElement.value);
        this._removeInputNode();

        // if (typeof elementComplete === "string") {
        //
        // } else {
        //     this.options.complete(clickElement);
        // }

    }

    get editing() {
        return (this._editWrapperElement != null);
    }

    cancel() {
        if (this.editing) {
            this._clickElement.innerHTML = this._convertInputToHtml(this._restoreValue);
            this._removeInputNode();
        }
    }

    _removeInputNode() {
        var element;

        if (this.editing) {
            element = document.getElementById(this._inputWrapperId);
            element.parentNode.removeChild(element);
            this._editWrapperElement = null;
            this._editElement = null;
            this._clickElement = null;
            this._restoreValue = null;
        }
    }
}

global['WysiwygTextInput'] = WysiwygTextInput;
