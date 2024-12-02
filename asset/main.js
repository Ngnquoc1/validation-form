function Validator(options) {
    var selectorRules = {};

    function getParent (inputElement, parent){
        while(inputElement.parentElement && inputElement.parentElement.matches( parent))
        {
            inputElement=inputElement.parentElement;
        }
        return inputElement;
    }

    function Validate(rule, inputElement) {
        // Vi tri dua message loi vao
        var errorElement = getParent(inputElement,options.formGroup).querySelector(options.errorSelector);

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
            getParent(inputElement,options.formGroup).classList.add('invalid');
            return true;
        }
        else {
            errorElement.innerText = '';
            getParent(inputElement,options.formGroup).classList.remove('invalid');
        }
        return false;

    }

    //Lay element cua form can Validate
    var formElement = document.querySelector(options.formName);

    if (formElement) {
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
                    var v=Validate(rule, inputElement);
                }
        
                var errorElement = getParent(inputElement,options.formGroup).querySelector(options.errorSelector);
                inputElement.addEventListener("click", () => {

                    errorElement.innerText = '';
                    getParent(inputElement,options.formGroup).classList.remove('invalid');

                })
            }
        });

        //Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid=true;
            //Kiem tra xem con input nao chua hop le
            options.rules.forEach((rule) => {
                var isInvalid=Validate(rule, formElement.querySelector(rule.selector));
                if(isInvalid) isFormValid=false;
            })
            if(isFormValid)
            {
                if(typeof options.onSubmit==='function')
                {
                    var enableInputs=formElement.querySelectorAll('[name]')

                    var formDatas=Array.from(enableInputs).reduce(function(values,input){
                        values[input.name]=input.value;
                        return values;
                    }, {});
                    options.onSubmit(formDatas);
                }

            }

        }
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