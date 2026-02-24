// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
package com.autoflex.challenge.product;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;

    public static ProductResponse from(Product product) {
        ProductResponse response = new ProductResponse();
        response.id = product.getId();
        response.name = product.getName();
        response.description = product.getDescription();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
