package xyz.vinllage.crawler.controllers;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "크롤링 요청 정보")
public class RequestCrawling {
    @NotBlank
    private String url;

    private List<String> keywords;

    @NotBlank
    private String linkSelector;

    @NotBlank
    private String titleSelector;

    @NotBlank
    private String dateSelector;

    @NotBlank
    private String contentSelector;

    @NotBlank
    private String urlPrefix;
}
