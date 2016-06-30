/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WysiwygTextInput = function () {
	    function WysiwygTextInput(options) {
	        _classCallCheck(this, WysiwygTextInput);

	        this.options = _extends({}, {
	            target: ".value-cell",
	            input_field_tag_id: "wysiwyg-text-input",
	            input_field_wrapper_id: "wrapper-wysiwyg-text-input",
	            input_text_attribute_name: "data-input-value",
	            commit_and_next_focus: true,
	            complete: function complete(elem) {},
	            click: function click(elem) {},
	            cancel: function cancel(elem) {}
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

	    _createClass(WysiwygTextInput, [{
	        key: "bindEvent",
	        value: function bindEvent() {
	            var _this = this;

	            var body = document.getElementsByTagName("html").item(0);

	            body.addEventListener("click", this._onDocumentClick);

	            Array.prototype.slice.call(document.querySelectorAll(this.options.target)).forEach(function (elem) {
	                elem.addEventListener("click", _this._onTargetClick);
	            });

	            //
	            window.addEventListener("resize", function (e) {
	                _this._setEditElementPos(_this._editWrapperElement, _this._clickElement);
	            });
	        }
	    }, {
	        key: "_getObjectOffsetRect",
	        value: function _getObjectOffsetRect(elem, rect) {
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
	    }, {
	        key: "_onDocumentClick",
	        value: function _onDocumentClick(e) {
	            if (!this.editing) {
	                return;
	            }

	            if (e.target == this._editElement) {
	                e.stopPropagation();
	                return;
	            }

	            this._commit();
	        }
	    }, {
	        key: "_onTargetClick",
	        value: function _onTargetClick(e) {
	            var _this2 = this;

	            var editElement, editWrapperElement;

	            var clickElement = e.target;

	            if (this.editing) {
	                this._commit();
	            }

	            editWrapperElement = document.createElement("div");
	            editWrapperElement.setAttribute("id", this._inputWrapperId);
	            editWrapperElement.style.position = "absolute";
	            editWrapperElement.style.margin = 0;
	            editWrapperElement.style.padding = 0;
	            this._setEditElementPos(editWrapperElement, clickElement);

	            var getDefaultValue = function getDefaultValue(elem) {
	                var value = elem.getAttribute(_this2.options.input_text_attribute_name);
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
	            var optionClassName = clickElement.getAttribute("data-input-class");
	            if (optionClassName != null) {
	                optionClassName.trim().split(" ").forEach(function (val, index, arr) {
	                    editElement.classList.add(val);
	                });
	            }
	            editElement.addEventListener("focus", this._onFocus);

	            // set option attributes
	            WysiwygTextInput._supportDomAttributes.forEach(function (attr_name, index, arr) {
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
	            this._callOptionMethod(clickElement, "data-input-click", "click");

	            // stop parent event notice
	            e.stopPropagation();
	        }
	    }, {
	        key: "_onFocus",
	        value: function _onFocus(e) {
	            this._editWrapperElement.classList.add("active");
	        }
	    }, {
	        key: "_setEditElementPos",
	        value: function _setEditElementPos(editElement, clickElement) {
	            if (clickElement == null) {
	                return;
	            }

	            var clickElemOffsetRect = this._getObjectOffsetRect(clickElement, { left: 0, top: 0 }),
	                clickElementRect = clickElement.getBoundingClientRect();

	            var getIntAttr = function getIntAttr(elem, attrName) {
	                var val = elem.getAttribute(attrName);

	                if (val == null) {
	                    return 0;
	                }

	                return parseInt(val, 10);
	            };

	            editElement.style.left = getIntAttr(clickElement, "data-input-add-offset-left") + clickElemOffsetRect.left + "px";
	            editElement.style.top = getIntAttr(clickElement, "data-input-add-offset-top") + clickElemOffsetRect.top + "px";
	            editElement.style.width = getIntAttr(clickElement, "data-input-add-width") + clickElementRect.width + "px";
	            editElement.style.height = getIntAttr(clickElement, "data-input-add-height") + clickElementRect.height + "px";

	            return editElement;
	        }
	    }, {
	        key: "_onInputTextKeyDown",
	        value: function _onInputTextKeyDown(e) {
	            var key = e.which || e.keyCode || 0;
	            var shiftKey = Boolean(e.shiftKey);

	            if (key == 9) {
	                // tab
	                e.preventDefault();
	                this._focusNextNode(this._clickElement, !shiftKey);

	                return;
	            }

	            if (key == 13) {
	                // enter
	                var elem = this._clickElement;
	                this._commit();
	                this._focusNextNode(elem, true);
	                return;
	            }

	            if (key == 27) {
	                // escape
	                this.cancel();
	                return;
	            }
	        }
	    }, {
	        key: "_onTextAreaKeyDown",
	        value: function _onTextAreaKeyDown(e) {
	            var key = e.which || e.keyCode || 0;
	            var shiftKey = Boolean(e.shiftKey);

	            if (key == 9) {
	                // tab
	                e.preventDefault();

	                if (shiftKey) {
	                    this._focusNextNode(this._clickElement, false);
	                } else {
	                    this._focusNextNode(this._clickElement, true);
	                }

	                return;
	            }

	            if (key == 13 && !shiftKey) {
	                // enter
	                var elem = this._clickElement;
	                this._commit();
	                this._focusNextNode(elem, true);
	                return;
	            }

	            if (key == 27) {
	                // escape
	                this.cancel();
	                return;
	            }
	        }
	    }, {
	        key: "_focusNextNode",
	        value: function _focusNextNode(clickElement, next) {
	            var nextElement;

	            nextElement = this._searchNextNode(clickElement, clickElement.getAttribute("data-input-prev-node"), next);
	            if (nextElement == null) {
	                return;
	            }

	            nextElement.click();
	        }
	    }, {
	        key: "_searchNextNode",
	        value: function _searchNextNode(clickElement, nextCssSelect, searchNext) {
	            var nextElement, valueElements, i, nextIndex;

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
	            } else {
	                nextElement = document.querySelectorAll(nextCssSelect).item(0);
	            }

	            return nextElement;
	        }
	    }, {
	        key: "_escapeTags",
	        value: function _escapeTags(str) {
	            //return str.replace(/<[^>]*>/g, "");
	            return str.replace("<", "＜").replace(">", "＞");
	        }
	    }, {
	        key: "_convertInputToHtml",
	        value: function _convertInputToHtml(str) {
	            return this._escapeTags(str).replace(/(\r\n|\r|\n)/g, "<br/ >");
	        }
	    }, {
	        key: "_commit",
	        value: function _commit() {
	            var clickElement = this._clickElement,
	                elementComplete = clickElement.getAttribute("data-input-complete");

	            this._clickElement.setAttribute(this.options.input_text_attribute_name, this._escapeTags(this._editElement.value));
	            this._clickElement.innerHTML = this._convertInputToHtml(this._editElement.value);
	            this._removeInputNode();

	            this._callOptionMethod(clickElement, "data-input-complete", "complete");
	        }
	    }, {
	        key: "cancel",
	        value: function cancel() {
	            if (this.editing) {
	                this._clickElement.innerHTML = this._convertInputToHtml(this._restoreValue);
	                this._callOptionMethod(this._clickElement, "data-input-cancel", "cancel");
	                this._removeInputNode();
	            }
	        }
	    }, {
	        key: "_removeInputNode",
	        value: function _removeInputNode() {
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
	    }, {
	        key: "_callOptionMethod",
	        value: function _callOptionMethod(elem, attribute_name, option_name) {
	            var elementFunction = elem.getAttribute(attribute_name);

	            if (typeof elementFunction === "string") {
	                global[elementFunction].call(elem, elem);
	            } else {
	                this.options[option_name](elem, elem);
	            }
	        }
	    }, {
	        key: "_inputTagId",
	        get: function get() {
	            return this.options.input_field_tag_id;
	        }
	    }, {
	        key: "_inputWrapperId",
	        get: function get() {
	            return this.options.input_field_wrapper_id;
	        }
	    }, {
	        key: "editing",
	        get: function get() {
	            return this._editWrapperElement != null;
	        }
	    }], [{
	        key: "_supportDomAttributes",
	        get: function get() {
	            return ["maxlength"];
	        }
	    }]);

	    return WysiwygTextInput;
	}();

	exports.default = WysiwygTextInput;


	global['WysiwygTextInput'] = WysiwygTextInput;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);