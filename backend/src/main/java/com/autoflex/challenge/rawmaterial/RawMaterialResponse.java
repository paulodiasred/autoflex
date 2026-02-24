package com.autoflex.challenge.rawmaterial;

import java.math.BigDecimal;

public class RawMaterialResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal stockQuantity;
    private String unit;

    public static RawMaterialResponse from(RawMaterial rawMaterial) {
        RawMaterialResponse response = new RawMaterialResponse();
        response.id = rawMaterial.getId();
        response.name = rawMaterial.getName();
        response.description = rawMaterial.getDescription();
        response.stockQuantity = rawMaterial.getStockQuantity();
        response.unit = rawMaterial.getUnit();
        return response;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getStockQuantity() { return stockQuantity; }
    public String getUnit() { return unit; }
}
