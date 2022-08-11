"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

(function (window) {
  var HelperInstance = new WeakMap();

  var RepLogApp = /*#__PURE__*/function () {
    /**
     * @param {HTMLElement} wrapper
     */
    function RepLogApp(wrapper) {
      _classCallCheck(this, RepLogApp);

      this.wrapper = wrapper;
      this.repLogs = [];
      HelperInstance.set(this, new Helper(this.repLogs));
      this.form = this.wrapper.querySelector(RepLogApp.selector.repLogForm);
      this.loadRepLogs();
      this.wrapper.querySelector('tbody').addEventListener('click', this.handleRepLogDelete.bind(this));
      this.form.addEventListener('submit', this.handleRepLogSubmit.bind(this));
    }

    _createClass(RepLogApp, [{
      key: "loadRepLogs",
      value: function loadRepLogs() {
        var _this = this;

        this.fetch('/api/reps', 'GET', {
          "Accept": "application/json"
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          var _iterator = _createForOfIteratorHelper(data.items),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var repLog = _step.value;

              _this._addRow(repLog);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        });
      }
    }, {
      key: "handleRepLogDelete",
      value: function handleRepLogDelete(e) {
        var _this2 = this;

        e.preventDefault();
        var link = e.target.closest(RepLogApp.selector.repLogDeleteLink);

        if (link) {
          Swal.fire({
            icon: 'question',
            title: 'Delete',
            text: 'Are you sure you want to delete this lift ?',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: function preConfirm() {
              return _this2.deleteRepLog(link);
            }
          }).then(function (result) {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your lift has been deleted.',
                icon: 'success'
              });
            }
          })["catch"](function (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Something went wrong! (".concat(error.message, ")")
            });
          });
        }
      }
    }, {
      key: "deleteRepLog",
      value: function deleteRepLog(link) {
        var _this3 = this;

        var deleteUrl = link.getAttribute('data-url');
        var row = link.closest('tr');
        var icon = link.querySelector('.fa-ban');

        this._toggleSpinnerToIcon(icon);

        return this.fetch(deleteUrl, 'DELETE').then( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(response) {
            var data;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (response.ok) {
                      _context.next = 5;
                      break;
                    }

                    _context.next = 3;
                    return response.json();

                  case 3:
                    data = _context.sent;

                    _this3._sendError(data);

                  case 5:
                    row.classList.add('hide');

                    _this3.repLogs.splice(parseInt(row.getAttribute('data-key')), 1);

                    _this3._updateTotalWeightAndReps();

                    setTimeout(function () {
                      row.remove();
                    }, 500);

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x3) {
            return _ref.apply(this, arguments);
          };
        }())["finally"](function () {
          _this3._toggleSpinnerToIcon(icon);
        });
      }
    }, {
      key: "handleRepLogSubmit",
      value: function handleRepLogSubmit(e) {
        var _this4 = this;

        e.preventDefault();
        var formData = new FormData(this.form);
        var formSubmitButton = this.form.querySelector('button[type="submit"]');
        var formJson = JSON.stringify(Object.fromEntries(formData));

        this._toggleDisabledButton(formSubmitButton);

        this._removeFormErrors();

        this._submitRepLog(formJson).then(function (data) {
          _this4._addRow(data);

          _this4.form.reset();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your lift have been added with success'
          });
        })["catch"](function (error) {
          if (error.code === 422) {
            _this4._mapErrorsToForm(error.errorsData);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Something went wrong! (".concat(error.message, ")")
            });
          }
        })["finally"](function () {
          _this4._toggleDisabledButton(formSubmitButton);
        });
      }
    }, {
      key: "_submitRepLog",
      value: function _submitRepLog(data) {
        var _this5 = this;

        var url = this.form.getAttribute('action');
        return this.fetch(url, 'POST', {
          'Content-Type': 'application/json'
        }, data).then( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(response) {
            var _data;

            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (response.ok) {
                      _context2.next = 5;
                      break;
                    }

                    _context2.next = 3;
                    return response.json();

                  case 3:
                    _data = _context2.sent;

                    _this5._sendError(_data);

                  case 5:
                    return _context2.abrupt("return", _this5.fetch(response.headers.get('Location'), 'GET', {
                      'accept': 'application/json'
                    }));

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function (_x4) {
            return _ref2.apply(this, arguments);
          };
        }()).then( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(response) {
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return response.json();

                  case 2:
                    return _context3.abrupt("return", _context3.sent);

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x5) {
            return _ref3.apply(this, arguments);
          };
        }());
      }
    }, {
      key: "_mapErrorsToForm",
      value: function _mapErrorsToForm(errors) {
        var _iterator2 = _createForOfIteratorHelper(errors),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _step2.value,
                property = _step2$value.property,
                message = _step2$value.message;
            var field = this.form.querySelector("[name=\"".concat(property, "\"]"));

            if (field) {
              field.classList.add('is-invalid');
              var feedBack = document.createElement('div');
              feedBack.classList.add('invalid-feedback');
              feedBack.innerText = message;
              field.after(feedBack);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "_removeFormErrors",
      value: function _removeFormErrors() {
        var fields = this.form.querySelectorAll('input, select');

        var _iterator3 = _createForOfIteratorHelper(fields),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _field$parentNode$que;

            var field = _step3.value;
            field.classList.remove('is-invalid');
            (_field$parentNode$que = field.parentNode.querySelector('.invalid-feedback')) === null || _field$parentNode$que === void 0 ? void 0 : _field$parentNode$que.remove();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }, {
      key: "_addRow",
      value: function _addRow(repLog) {
        this.repLogs.push(repLog);
        var htmlFragment = rowFragment(repLog);
        var row = htmlFragment.content.querySelector('tr'); // store the repLog index into data-key attribute

        row.setAttribute('data-key', (this.repLogs.length - 1).toString());
        this.wrapper.querySelector('tbody').appendChild(row);

        this._updateTotalWeightAndReps();
      }
    }, {
      key: "_updateTotalWeightAndReps",
      value: function _updateTotalWeightAndReps() {
        var _HelperInstance$get$g = HelperInstance.get(this).getTotalWeightAndRepsString(),
            weight = _HelperInstance$get$g.weight,
            reps = _HelperInstance$get$g.reps;

        this.wrapper.querySelector('.js-total-weight').textContent = weight;
        this.wrapper.querySelector('.js-total-reps').textContent = reps;
      }
      /**
       * @return {Promise<Response>}
       */

    }, {
      key: "fetch",
      value: function (_fetch) {
        function fetch(_x, _x2) {
          return _fetch.apply(this, arguments);
        }

        fetch.toString = function () {
          return _fetch.toString();
        };

        return fetch;
      }(function (url, method) {
        var headersOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var body = arguments.length > 3 ? arguments[3] : undefined;
        var headers = Object.assign({}, {
          "X-Requested-With": "XMLHttpRequest"
        }, headersOptions);

        if (method === "POST" && body !== undefined) {
          return fetch(url, {
            method: method,
            headers: headers,
            body: body
          });
        }

        return fetch(url, {
          method: method,
          headers: headers
        });
      })
    }, {
      key: "_toggleSpinnerToIcon",
      value: function _toggleSpinnerToIcon(icon) {
        icon.classList.toggle('fa-spin');
      }
    }, {
      key: "_toggleDisabledButton",
      value: function _toggleDisabledButton(button) {
        button.classList.toggle('disabled');
        var isButton = button.nodeName === 'BUTTON';

        if (button.classList.contains('disabled')) {
          button.setAttribute('aria-disabled', 'true');

          if (isButton) {
            button.setAttribute('tabindex', '-1');
          }
        } else {
          button.removeAttribute('aria-disabled');

          if (isButton) {
            button.removeAttribute('tabindex');
          }
        }
      }
    }, {
      key: "_sendError",
      value: function _sendError(_ref4) {
        var _ref4$message = _ref4.message,
            message = _ref4$message === void 0 ? '' : _ref4$message,
            _ref4$code = _ref4.code,
            code = _ref4$code === void 0 ? 0 : _ref4$code,
            _ref4$errors = _ref4.errors,
            errors = _ref4$errors === void 0 ? [] : _ref4$errors;
        var errorResponse = {
          type: 'Error',
          message: message || 'Something went wrong',
          code: code || 400,
          errorsData: errors
        };
        throw errorResponse;
      }
    }], [{
      key: "selector",
      get: function get() {
        return {
          repLogForm: '.js-new-rep-log-form',
          repLogDeleteLink: '.js-delete-rep-log'
        };
      }
    }]);

    return RepLogApp;
  }();

  var Helper = /*#__PURE__*/function () {
    function Helper(repLogs) {
      _classCallCheck(this, Helper);

      this.repLogs = repLogs;
    }

    _createClass(Helper, [{
      key: "calculTotalWeightAndReps",
      value: function calculTotalWeightAndReps(repLogs) {
        var total = {
          weight: 0,
          reps: 0
        };

        var _iterator4 = _createForOfIteratorHelper(repLogs),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _step4$value = _step4.value,
                reps = _step4$value.reps,
                totalWeightLifted = _step4$value.totalWeightLifted;
            total.reps += reps;
            total.weight += totalWeightLifted;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return total;
      }
    }, {
      key: "getTotalWeightAndRepsString",
      value: function getTotalWeightAndRepsString() {
        var totalObject = this.calculTotalWeightAndReps(this.repLogs);

        for (var _i = 0, _Object$entries = Object.entries(totalObject); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          totalObject[key] = value.toString();
        }

        return totalObject;
      }
    }]);

    return Helper;
  }();

  var rowFragment = function rowFragment(repLog) {
    var template = document.createElement('template');
    template.innerHTML = "<tr data-weight=\"".concat(repLog.totalWeightLifted, "\" data-reps=\"").concat(repLog.reps, "\">\n    <td>").concat(repLog.item, "</td>\n    <td>").concat(repLog.reps, "</td>\n    <td>").concat(repLog.totalWeightLifted, "</td>\n    <td>\n        <a class=\"btn btn-blue btn-sm js-delete-rep-log\" role=\"button\" data-url=\"").concat(repLog.links.self, "\">\n            <i class=\"fa-solid fa-ban\"></i>\n        </a>\n    </td>\n    </tr>");
    return template;
  };

  window.RepLogApp = RepLogApp;
})(window);
