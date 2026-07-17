package com.novastudio.backend.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> data;
    private Long total;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;

    public static <T> PageResponse<T> of(List<T> data, Long total, Integer page, Integer pageSize) {
        int totalPages = pageSize > 0 ? (int) Math.ceil((double) total / pageSize) : 0;
        return PageResponse.<T>builder()
                .data(data)
                .total(total)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    public static <T> PageResponse<T> empty(Integer page, Integer pageSize) {
        return PageResponse.<T>builder()
                .data(List.of())
                .total(0L)
                .page(page)
                .pageSize(pageSize)
                .totalPages(0)
                .build();
    }
}
