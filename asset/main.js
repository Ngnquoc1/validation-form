function Validator(options) {
    var selectorRules = {};

    function Validate(rule, inputElement) {
        // Vi tri dua message loi vao
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        //Lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];

        var errorMessage;
        //Lap qua tung rule
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

    }

    //Lay element cua form can Validate
    var formElement = document.querySelector(options.formName);

    if (formElement) {
        //Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            options.rules.forEach((rule) => {
                Validate(rule, formElement.querySelector(rule.selector));
            })

        }


        //Lap qua moi rule cua form va lang nghe su kien
        options.rules.forEach((rule) => {

            //lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }

            //Lay ra vi tri nhap input
            var inputElement = formElement.querySelector(rule.selector);


            if (inputElement) {

                
                inputElement.onblur = function () {
                    Validate(rule, inputElement);
                }
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                inputElement.addEventListener("click", () => {
                    
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    
                })
            }
        });
    }
}

Validator.isRequired = function (s, message) {
    return {
        selector: s,

        test: function (value) {
            return !value.trim() ? 'Vui lòng nhập trường này' : undefined;
        }
    }

}

Validator.isEmail = function (s, message) {
    return {
        selector: s,
        test: function (value) {
            var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }

}

Validator.isPassword = function (s, f, message) {
    return {
        selector: s,
        test: function (value) {
            return value.length >= f ? undefined : message || `Mật khẩu cần tối thiểu ${f} ký tự`;
        }
    }
}

Validator.isCofirmed = function (s, f, message) {
    return {
        selector: s,
        errorE: f,
        test: function (value) {
            return value === f() ? undefined : message || `Giá trị nhập lại không trùng khớp`;
        }
    }
} 