package xyz.vinllage.board_seul.controllers;

import lombok.Data;
import xyz.vinllage.global.search.CommonSearch;

import java.util.List;

@Data
public class BoardSearch_seul extends CommonSearch {
    private Long seq;
    private String bid;
    private List<String> category;
    private List<String> email;
}