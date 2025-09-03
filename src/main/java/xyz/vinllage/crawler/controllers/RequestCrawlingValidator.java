package xyz.vinllage.crawler.controllers;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class RequestCrawlingValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return RequestCrawling.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        RequestCrawling form = (RequestCrawling) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "url", "NotBlank");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "linkSelector", "NotBlank");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "titleSelector", "NotBlank");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "dateSelector", "NotBlank");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "contentSelector", "NotBlank");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "urlPrefix", "NotBlank");

        if (errors.hasErrors()) return;
    }
}